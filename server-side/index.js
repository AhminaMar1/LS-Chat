const express = require('express');
const http = require('http')
const socketIo = require('socket.io')
const cors = require('cors')
const mongoose = require('mongoose')

//The env
require('dotenv').config()


const app = express()
const server = http.createServer(app)

const port = process.env.PORT || 5000;
const clientURL = process.env.CLIENT_SIDE;
const dbURL = process.env.DB_URL;

//
mongoose.connect(dbURL, {useNewUrlParser: true, useUnifiedTopology: true});
//mongoose.connect('mongodb://test:test123@localhost:27017/tschat', {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))



//Cors middleware 
app.use(cors())

// use json
app.use(express.json())


//Express routers - APIs
app.get('/' , (req , res)=>{

   res.status(200).send('The index http runing');

});

const admin = require ('./src/routers/admin');
const client = require ('./src/routers/client');

app.use('/api/admin', admin);
app.use('/api/client', client);


//Init socket.io
const io = socketIo(server, {
   cors: {
       origin: clientURL,
   }
});

io.on("connection", (socket) => {
   console.log("New client connected");

   socket.emit('FromAPI', {date: new Date()})

   socket.on("disconnect", () => {
      console.log("Client disconnected");
   });
});


//Lesten
server.listen(port, ()=>{console.log(`The serve runing in PORT ${port}`)})