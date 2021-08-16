const asyncRedis = require("async-redis");
const asyncClient = asyncRedis.createClient();

asyncClient.on("error", function (err) {
    console.log("Error " + err);
});


exports.arrangeConversations = (redisClient, userId) => {
    
    redisClient.get('thelastconv', (err, theLastConv) => {
        if(err) {

        } else if (theLastConv !== userId) {

            let preLast = theLastConv || 'null';
            redisClient.set('thelastconv', userId);

            redisClient.hget('next_lc', userId, (err, myNext) => {
                if (!err) {
                    redisClient.hget('prev_lc', userId, (err, myPrev) => {
                        if(!err) {
                            
                            redisClient.hset('prev_lc', userId, 'null');
                            redisClient.hset('next_lc', userId, preLast);
        
                            if (preLast && preLast !== 'null') {
                                redisClient.hset('prev_lc', preLast, userId);
                            }

                            let prevId =  myPrev || 'null';
                            let nextId =  myNext || 'null';
        
                            if (prevId && prevId !== 'null') {
                                redisClient.hset('next_lc', prevId, nextId);
                            }

                            if (nextId && nextId !== 'null') {
                                redisClient.hset('prev_lc', nextId, prevId);
                            }
    
        

                        }
                    });
                }

            });



        }
    })

}

const getStartFrom = (redisClient, startFrom = null, callback) => {
    if(startFrom) {
        callback(startFrom);
    } else {
        redisClient.get('thelastconv', (err, startFromData) => {
            if (err) {

            } else if(startFromData) {
                callback(startFromData);
            }
        });
    }
}

const getAllDataAboutAConv = async (redisClient, id, callbackToPush) => {

    let messageData = await asyncClient.lrange('m:'+id, -4, -1);
    let name = await asyncClient.get('NAME:'+id);
    let rechedAndSeen = await asyncClient.hgetall('grs:'+id);
    let seen = false, reached = false;
    if(rechedAndSeen) {
        
        console.log(rechedAndSeen, messageData[0])
        seen = rechedAndSeen.my_seen === messageData[0] || rechedAndSeen.admin_seen === messageData[0];
        reached = seen || rechedAndSeen.my_reached === messageData[0] || rechedAndSeen.admin_reached === messageData[0];
    
    }
    

    let data = {
        id,
        name,
        message_data: messageData,
        reached,
        seen
    }
    callbackToPush(data);
}


const getTheNext = async (redisClient, id) => {

    return await asyncClient.hget('next_lc', id);

}


exports.getConversations = (redisClient, startFrom = null, callback) => {
    
    getStartFrom(redisClient, startFrom, (newStartFrom) => {
        
        (async() => {

            let arr = [];
            let i= 0;
            
            let nextId = newStartFrom;
            while (nextId && i <= 10) {

                getAllDataAboutAConv(redisClient, nextId, (data) => {
                    arr.push(data);
                });

                nextId = await getTheNext(redisClient, nextId);
                i++;

                if(!nextId || i > 10) {
                    callback(arr)
                }

            }

        })();


    })
    
    
}