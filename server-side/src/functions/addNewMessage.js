const ChatModel = require('../models/chat');
const UserModel = require('../models/user');

const {saveNewChat} = require('./saveInMongoForClient');

exports.addNewMessage = (userId, messageData, {redisClient, asyncClient = null}, isClient = false) => {
    
    let messagesQuery = 'm:'+userId;
    
    redisClient.rpush(messagesQuery, messageData, (err) => {
       if (err) {
          console.log(err);
       }
    })

    //This means the client did the auth with his token
    if (isClient) {

        //Checking who use this..
        redisClient.llen(messagesQuery, (err, num) => {//O(1) to get the llen fot checking
            if (err) {
               console.log(err);
            } else if(num > 50*4) { //Not always this is was true
                let queryMySeen = 'grs:'+userId;
                redisClient.hget(queryMySeen, 'my_seen', (err, mySeen) => {
                    if(!err && mySeen) {
                        
                        (async () => {
                            let messagesData = [];
                            let finish = false, i=0;
                            while(!finish && i < 30) {
    
                                let messageId = await asyncClient.lrange(messagesQuery, 2, 2);

                                if(messageId === mySeen) {
                                    finish = true;
                                } else {

                                    let oneMessage = [];
                                    
                                    //We need to change the config of Redis if we want to use a number with LPOP.. And because this is an open-source project I don't want to make the installation of this project needs too many configuration change.
                                    for(let j = 0; j < 4; j++) {
                                        let line = await asyncClient.lpop(messagesQuery);
                                        oneMessage.push(line);
                                    }
                                    
                                    let objOneMessage = {
                                        id: oneMessage[0],
                                        sender_id: oneMessage[1],
                                        message: oneMessage[2],
                                        data: oneMessage[3],
                                    }

                                    messagesData.push(objOneMessage)
                                }
                                
                                i++;
                            }

                            if(i >= 20) {
                                saveNewChat(userId, UserModel, ChatModel, messagesData);
                            }

                        })();


                    }
                });


                //get the current chat_id
    
            }
        })
    }

}