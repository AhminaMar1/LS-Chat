const express = require('express');
const http = require('http')
const cors = require('cors')

//The env
require('dotenv').config()


const app = express()
const server = http.createServer(app)

const port = process.env.PORT || 5000;

//Cors middleware 
app.use(cors())


//Express routers - APIs
app.get('/' , (req , res)=>{

   res.status(200).send('The index http runing');

});


//Listen
server.listen(port, ()=>{console.log(`The serve runing in PORT ${port}`)})