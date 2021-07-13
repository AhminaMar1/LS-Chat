const express = require('express');
const http = require('http')
const socketIo = require('socket.io')
const cors = require('cors')
const mongoose = require('mongoose')
const redis = require('redis');
const redisClient = redis.createClient();

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

   //Save a new session in redis when the user is connet

   socket.on('newRedisSession', (data) => {
      checkUser.storageForCheking(data, redisClient, socket.id);
   })
   
   socket.on("sendMessage", (data) => {
      console.log(data);
   });

   
   socket.on("disconnect", () => {

      redisClient.del(socket.id);
      console.log("Client disconnected");
      
   });
});


//Lesten
server.listen(port, ()=>{console.log(`The SOCKET serve runing in PORT ${port}`)})