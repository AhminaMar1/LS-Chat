const mongoose = require('mongoose')    
const UserSchema = mongoose.Schema({
    //ID
    random_name : {
        type : String,
        require: true,
        min : 3,
        max: 10
    },
    new_name : {
        type : String,
        default: null,
        min : 3,
        max: 10
    },
    token : {
        type : String,
        require: true,
        min: 10
    },
    current_chat_document_id : {
        type : String,
        default: null
    },
    date : {
        type : Date,
        default: new Date()
    },

})
module.exports =  mongoose.model( 'User' , UserSchema);