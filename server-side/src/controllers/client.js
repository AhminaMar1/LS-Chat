const redis = require('redis');
const redisClient = redis.createClient();
//connet with redis
redisClient.on('connect', () => console.log('Redis client connect'));

const User = require('../models/user')
const Chat = require('../models/chat')

const {userAuth, adminAuth} = require('../functions/authForSocket')

exports.lastChatDoc = (req, res) => {

    const getLRange = (redisClient, id, res, type) => {
        let messagesQuery = 'm:'+id;
        redisClient.lrange(messagesQuery, 0, -1, (err, ResData) => {
            if(!err && ResData) {
            
                let queryRechedAndSeen = 'grs:'+id;
                redisClient.hgetall(queryRechedAndSeen, (err, hData) => {
                    if(!err) {

                        let resSend = {
                            messages: ResData,
                            reached_and_seen: {
                                my_reached: (!hData) ? null : hData.my_reached,
                                my_seen: (!hData) ? null : (type === 'admin') ? hData.my_seen || null : null,
                                admin_reached: (!hData) ? null : hData.admin_reached || null,
                                admin_seen: (!hData) ? null : hData.admin_seen || null
                            }
                        };

                        res.status(200).json(resSend);
                    }
                })


            }

        })
    }

    let id = req.query.id,
        token= req.query.token,
        admin = req.query.admin,
        userId = req.query.id_user;

    if(id && token) {
        let checkData = {id, token}
        userAuth({checkData, redisClient}, () => {
            getLRange(redisClient, id, res, 'user');
        });
    }else if (admin && userId) {

        let checkDataAdmin = {
            id: req.query.admin_id,
            token: req.query.admin_token
        }

        adminAuth({checkData: checkDataAdmin, redisClient}, () => {
            getLRange(redisClient, userId, res, 'admin');

        })
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