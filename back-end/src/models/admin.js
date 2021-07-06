const mongoose = require('mongoose')

const AdminSchema = mongoose.Schema({
    //ID
    username : {
        type : String,
        require: true,
        min : 3
    },
    password : {
        type : String,
        require : true
    },
    token : {
        type : String,
        require: true,
        min : 3
    },
    date : {
        type : Date,
        default: new Date()
    },

})
module.exports =  mongoose.model( 'Admin' , AdminSchema);