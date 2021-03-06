const express = require('express');
const http = require('http')
const socketIo = require('socket.io')
const cors = require('cors')
const mongoose = require('mongoose')
const redis = require('redis');
const redisClient = redis.createClient();

//Async redis
const asyncRedis = require("async-redis");
const asyncClient = asyncRedis.createClient();

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
const {storageForCheking} = require('./src/functions/storageForCheckingUser');
const {userAuth, adminAuth} = require('./src/functions/authForSocket');
const {messageFormat, formatSroreInRedis} = require('./src/functions/messageFormat');
const {sendToAllSocketOfOneClient} = require('./src/functions/sendToAllSocketOfOneClient');
const {reachedToUser, reachedToAdmin, seenFromAdmin, seenFromUser} = require('./src/functions/reachedAndSeen')
const {arrangeConversations, getConversations} = require('./src/functions/arrangeConversations');
const {addNewMessage} = require('./src/functions/addNewMessage');

// IO
io.on("connection", (socket) => {
   console.log("New client connected");

   socket.emit('FromAPI', {date: new Date()})

   //Join a new admin - ADMIN room

   socket.on('ImAdmin', (data) => {
      adminAuth({checkData: data, redisClient}, () => {
         socket.join('ADMIN');
      })

   });

   //Save a new session in redis when the user is connet

   socket.on('newRedisSession', (data) => {
      storageForCheking(data, redisClient, socket.id, io);
   })
   
   socket.on("sendMessage", (data) => {

      let checkData = data.checkData;
      if(checkData && checkData.id) {
         
         userAuth({checkData, redisClient}, () => {
            //the callback if the token is true
            let now = new Date();
            let messageData = messageFormat({
               id: data.id,
               message: data.message,
               sender: checkData.id,
               now: now
            });
         
            sendToAllSocketOfOneClient(checkData.id, redisClient, io, {type: 'newMessageFromMe', data: messageData});
   
            //send to admins
            io.to('ADMIN').emit('newMessage', messageData);
      
            let formatRedis = formatSroreInRedis({id: messageData.id, sender: checkData.id, message: messageData.mssg, date: now})

            addNewMessage(checkData.id, formatRedis, {redisClient, asyncClient}, true);

   
            arrangeConversations(redisClient, checkData.id);
   
         })
      }


            
   });

   socket.on("adminSendMessage", (data) => {
      let checkData = data.checkData;

      if(checkData && data.to) {

         adminAuth({checkData, redisClient}, () => {
            //Callback function
            let now = new Date();
            let messageData = messageFormat({
               id: data.id,
               message: data.message,
               sender: 'admin',
               date: now
            });
            
            io.to('ADMIN').emit('newMessageFromAdmin', {message_data: messageData, to: data.to});
            
            sendToAllSocketOfOneClient(data.to, redisClient, io, {type: 'newMessage', data: messageData});

            let formatRedis = formatSroreInRedis({id: messageData.id, sender: 'admin', message: messageData.mssg, date: now})

            //TODO *We need to check data.to*
            addNewMessage(data.to, formatRedis, {redisClient});

            arrangeConversations(redisClient, data.to);

         })     


      }
   });

   socket.on("reachedToUser", (data) => {
      let checkData = data.checkData;

      userAuth({checkData, redisClient}, () => {

         let reachedId = data.reached_id;
         
         reachedToUser(checkData.id, reachedId, redisClient, {io, type: 'ADMINROOM'});

      });

   });

   socket.on("reachedToAdmin", (data) => {
      adminAuth({checkData: data.checkData, redisClient}, () => {
         let reachedId = data.reached_id;
         let userId = data.user_id;
         
         reachedToAdmin(userId, reachedId, redisClient, {io, type: 'client'});

      });
   });

   socket.on("seenFromUser", (data) => {
      let checkData = data.checkData;

      userAuth({checkData, redisClient}, () => {

         let seenId = data.seen_id;
         
         seenFromUser(checkData.id, seenId, redisClient, {io, type: 'ADMINROOM'});

      });

   });

   socket.on("seenFromAdmin", (data) => {
      adminAuth({checkData: data.checkData, redisClient}, () => {
         let seenId = data.seen_id;
         let userId = data.user_id;
         
         seenFromAdmin(userId, seenId, redisClient, {io, type: 'client'});

      });
   });
   
   socket.on("disconnect", () => {

      //If the user is not an admin
      let socketIdQuery = 'sid:'+socket.id; //si = Socket id
      redisClient.hgetall(socketIdQuery, (err, retData) => {
         
         if (err){
            console.err(err)
         } else if (retData !== null) {
               redisClient.del(socketIdQuery);

               let id = retData.user_id;
               let keyOfList = "sl:"+id; // sl = sockets list
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