//every documets has 50 messasge and has the ID of prevent-documet-chat-model (or null) and the next-document-Chat-model

const mongoose = require('mongoose')    
const ChatSchema = mongoose.Schema({
    user_id : {
        type : String,
        require: true
    },
    prev_documet_id : {
        type : String,
        default: null
    },
    next_documet_id : {
        type : String,
        default: null
    },
    messages: {
        type : Array,
        default: []
    },
    date : {
        type : Date,
        default: new Date()
    },

})
module.exports =  mongoose.model( 'Chat' , ChatSchema);