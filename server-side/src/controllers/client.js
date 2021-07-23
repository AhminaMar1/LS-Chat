const redis = require('redis');
const redisClient = redis.createClient();
//connet with redis
redisClient.on('connect', () => console.log('Redis client connect'));

const User = require('../models/user')
const Chat = require('../models/chat')

exports.lastChatDoc = (req, res) => {

    let id = req.query.id;
    let token = req.query.token;

    if(id && token) {
        let userQuery = 'USER:'+id;
        redisClient.get(userQuery, (err, data) => {
            if(!err && data && token===data){
                redisClient.lrange(id, 0, -1, (err, ResData) => {

                    if(err) {

                    } else {
                        res.status(200).json(ResData);
                    }

                })
            }
        })
    }
    
}

exports.prevChatDoc = (req, res) => {
    
}

const clientFunctions = require('../functions/client');

exports.startSession = async (req, res) => {
    
    let id = req.body.id || null,
        token = req.body.token || null;

    if (id === null || token === null){
        //Create new session
        clientFunctions.saveNewSession(User, Chat, res)
    } else {
        User.findById(id, function (err, user) {
            if (err || !user) {

                //Create new session
                clientFunctions.saveNewSession(User, Chat, res)
    
            } else {
                
                if (token===user.token) {
                    //result to return it
                    const resultat = {
                        _id: user._id,
                        random_name: user.random_name,
                        curr_chat_doc_id : user.current_chat_document_id,
                        token: user.token,
                        already: true
                    }
                    //succes status
                    res.status(200).json(resultat)
                } else {
                    //Create new session
                    clientFunctions.saveNewSession(User, Chat, res)
                }
            }
        });
    }
}