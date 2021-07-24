const express = require('express');
const http = require('http')
const socketIo = require('socket.io')
const cors = require('cors')
const mongoose = require('mongoose')
const redis = require('redis');
const redisClient = redis.createClient();
const { v4: uuid, validate: uuidValidate } = require('uuid');

//The env
require('dotenv').config()
const port = process.env.SOCKET_PORT || 6000;
const clientURL = process.env.CLIENT_SIDE;
const dbURL = process.env.DB_URL;

//connet with redis
redisClient.on('connect', function() {
   console.log('Redis is connected!');
 });


//Connect with the mongo DB
mongoose.connect(dbURL, {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))

//express
const app = express()

//Cors middleware 
app.use(cors())

// use json
app.use(express.json())

// Http server for the socket
const server = http.createServer(app)



//Init socket.io
const io = socketIo(server, {
   cors: {
       origin: clientURL,
   }
});

//Functons
const checkUser = require('./src/functions/checkUser')


io.on("connection", (socket) => {
   console.log("New client connected");

   socket.emit('FromAPI', {date: new Date()})

   //Join a new admin - ADMIN room

   socket.on('ImAdmin', (data) => {

      console.log('Ccccccccccc')

      if(data && data.admin_id){
         let queryGetAdmin = 'ADMIN:'+data.admin_id;
         redisClient.get(queryGetAdmin, (err, dataRedis) => {
            if(err) {

            } else if (dataRedis && dataRedis === data.admin_token){
               socket.join('ADMIN');
            }
         })
      }

   });

   //Save a new session in redis when the user is connet

   socket.on('newRedisSession', (data) => {
      checkUser.storageForCheking(data, redisClient, socket.id, io);
   })
   
   socket.on("sendMessage", (data) => {

      let checkData = data.checkData;

      let validUuid = uuidValidate(data.id);

      redisClient.hgetall(socket.id, (err, redisBackData) => {
         
         if (err){
            console.err(err)
         } else {
            //Checking token
            if(redisBackData && redisBackData.user_id == checkData.id && redisBackData.token == checkData.token) {
               //send to admins

               let now = new Date();
               let messageData = {
                  id: (validUuid) ? data.id : uuid(),
                  sender_id: 'me',
                  mssg: data.message,
                  date: now
               }

               socket.emit("newMessage", messageData);

               redisClient.rpush(checkData.id, [messageData.id, 'me', messageData.mssg, false, false, now], (err) => {
                  if (err) {
                     console.log(err);
                  }
               })

            }
         }
      })
   });

   
   socket.on("disconnect", () => {

      //If the user is not an admin
      redisClient.hgetall(socket.id, (err, retData) => {
         
         
         if (err){
            console.err(err)
         } else if (retData !== null) {
               redisClient.del(socket.id);
               let id = retData.user_id;
               let keyOfList = "sl_"+id; // sl = sockets list
               redisClient.LREM(keyOfList, 1, socket.id, (err) => {
                  if(err){
                     console.log(err);
                  }else{
                     redisClient.llen(keyOfList, (err, num) => {
                        if(err){
                           console.log(err);
                        }else if(num < 1){
                           redisClient.hdel('onlines', id);
                          //Send the updating of the list of onlines to the Admins
                          io.to('ADMIN').emit('RemoveFromOnlineUsers', {id: id});
                        }
                     });
                  }
               });

         }
         //console log
         console.log("Client disconnected");
      });

      //The the user is an admin




   });

});


//Listen
server.listen(port, ()=>{console.log(`The SOCKET serve runing in PORT ${port}`)})