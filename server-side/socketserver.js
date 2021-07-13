const express = require('express');
const http = require('http')
const socketIo = require('socket.io')
const cors = require('cors')
const mongoose = require('mongoose')
const redis = require('redis');
const client = redis.createClient();

//The env
require('dotenv').config()
const port = process.env.SOCKET_PORT || 6000;
const clientURL = process.env.CLIENT_SIDE;
const dbURL = process.env.DB_URL;

//connet with redis
client.on('connect', function() {
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

io.on("connection", (socket) => {
   console.log("New client connected");

   socket.emit('FromAPI', {date: new Date()})
   
   socket.on("sendMessage", (data) => {
      console.log(data);
   });

   
   socket.on("disconnect", () => {
      console.log("Client disconnected");
   });
});


//Lesten
server.listen(port, ()=>{console.log(`The SOCKET serve runing in PORT ${port}`)})