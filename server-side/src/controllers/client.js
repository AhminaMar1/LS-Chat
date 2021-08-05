const redis = require('redis');
const redisClient = redis.createClient();
//connet with redis
redisClient.on('connect', () => console.log('Redis client connect'));

const User = require('../models/user')
const Chat = require('../models/chat')


exports.lastChatDoc = (req, res) => {

    const getLRange = (redisClient, id, res) => {
        redisClient.lrange(id, 0, -1, (err, ResData) => {

            if(err) {

            } else {
                res.status(200).json(ResData);
            }

        })
    }

    let id = req.query.id;
    let token = req.query.token;
    let admin = req.query.admin;

    if(id && token) {
        let userQuery = 'USER:'+id;
        redisClient.get(userQuery, (err, data) => {
            if(!err && data && token===data){
                getLRange(redisClient, id, res);
            }
        })
    }else if (admin) {

        let adminId = req.query.admin_id;
        let adminToken = req.query.admin_token;
        let userId = req.query.id_user;
        
        if(adminId && adminToken && userId) {
            let adminQuery = 'ADMIN:'+adminId;
            redisClient.get(adminQuery, (err, data) => {
                if(!err && data && adminToken===data){
                    getLRange(redisClient, userId, res);
                }
            })
        }
    }
    
}

exports.prevChatDoc = (req, res) => {
    
}

const clientFunctions = require('../functions/saveInMongoForClient');

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