const redis = require('redis');
const redisClient = redis.createClient();
//connet with redis
redisClient.on('connect', () => console.log('Redis client connect'));

const User = require('../models/user');
const Chat = require('../models/chat');


const {userAuth, adminAuth} = require('../functions/authForSocket');
const {getChatDoc} = require('../functions/getChatDoc');
const {authUserOrAdmin} = require('../functions/authUserOrAdmin');

//We get this from the redis
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
                                my_seen: (!hData) ? null : hData.my_seen,
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

    authUserOrAdmin(req, {userAuth, adminAuth, redisClient}, (userId) => {
        
        //The callback function
        getLRange(redisClient, userId, res, 'admin');

    });
}



exports.prevChatDoc = (req, res) => {
    
    //Chech the user
    authUserOrAdmin(req, {userAuth, adminAuth, redisClient}, (userId, typeUser) => {
        
        //The callback function
        (async () => {
            let docId = req.query.doc_id; 
            docId = (!docId || docId === 'null') ? null : docId;
    
            let dataMessage = await getChatDoc(docId, userId, User, Chat);
    
            if(dataMessage && (typeUser === 'admin' || (typeUser === 'client' && userId && dataMessage.user_id === userId))) {

                let dataSend = {
                    doc_id_turn: dataMessage.prev_documet_id,
                    messages: dataMessage.messages
                }
                res.status(200).json(dataSend);
            } else {
                res.status(200).json(false);
            }

        })()

    });


}

const clientFunctions = require('../functions/saveInMongoForClient');

exports.startSession = async (req, res) => {
    
    let id = req.body.id || null,
        token = req.body.token || null;

    if (id === null || token === null){
        //Create new session
        clientFunctions.saveNewSession(User, res)
    } else {
        User.findById(id, function (err, user) {
            if (err || !user) {

                //Create new session
                clientFunctions.saveNewSession(User, res)
    
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
                    clientFunctions.saveNewSession(User, res)
                }
            }
        });
    }
}