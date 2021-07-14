const express = require('express');
const cors = require('cors')
const mongoose = require('mongoose')

//The env
require('dotenv').config()
const port = process.env.PORT || 5000;
const dbURL = process.env.DB_URL;


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


//Express routers - APIs
app.get('/' , (req , res)=>{

   res.status(200).send('The index http runing');

});

//Routers
const admin = require ('./src/routers/admin');
const client = require ('./src/routers/client');

app.use('/api/admin', admin);
app.use('/api/client', client);

//Listen
app.listen(port, ()=>{console.log(`The API serve runing in PORT ${port}`)})