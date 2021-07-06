const express = require('express');
const http = require('http')
const socketIo = require('socket.io')
const cors = require('cors')

//The env
require('dotenv').config()


const app = express()
const server = http.createServer(app)

const port = process.env.PORT || 5000;
const clientURL = process.env.CLIENT_SIDE;


//Cors middleware 
app.use(cors())


//Express routers - APIs
app.get('/' , (req , res)=>{

   res.status(200).send('The index http runing');

});

//Init socket.io
const io = socketIo(server, {
   cors: {
       origin: clientURL,
   }
});

io.on("connection", (socket) => {
   console.log("New client connected");

   socket.emit('FromAPI', {socket: true})

   socket.on("disconnect", () => {
      console.log("Client disconnected");
   });
});


//Listen
server.listen(port, ()=>{console.log(`The serve runing in PORT ${port}`)})