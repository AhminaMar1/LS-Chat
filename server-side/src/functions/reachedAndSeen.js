const {sendToAllSocketOfOneClient} = require('../functions/sendToAllSocketOfOneClient')

const awaitCheckAndChange = async (reachedOrseen, index, userId, reachedId, redisClient, {io, type}) => {
    
    //index of the boolean that we need to change it.
    let reachedOrseenIndex = (reachedOrseen === 'seen') ? 4 : 3;
    
    //Start and end Indexes of the message
    let sIndex = index - 6;
    let eIndex = index - 1;

    await redisClient.lrange(userId, sIndex, eIndex, (err, data) => {
        
        if(err) {
            console.log(err);
        } else if(data && data.length>2) {
            if(data[0] === reachedId && ( data[1] !== userId || (data[1] === userId && type !== 'ADMINROOM'))) {
                if(data[reachedOrseenIndex] == 'false'){
                    
                    redisClient.lset(userId, sIndex+reachedOrseenIndex, true, (err) => {
                        if (!err) {
                            let dataEmit = {
                                id: reachedId,
                                reached : true,
                                seen: (reachedOrseen==='seen') ? true : false,
                            }
                            //To admin room
                            if(type === 'ADMINROOM') {                                
                                io.to('ADMIN').emit('reachedAndSeen', dataEmit);
                            } else { //To all socket of on client
                                sendToAllSocketOfOneClient(userId, redisClient, io, 
                                    {
                                        type: 'reachedAndSeen',
                                        data: dataEmit
                                    }
                                )
                                
                            }
                            
                        }
                        
                    });
                    
                }
                
            } else return true;

        }

    })
}


const reachedAndSeen = (reachedOrseen, userId, reachedId, redisClient, {io, type}) => {

    //We will use a positive number to deal with this.. not -1,-6 to get the latest.. because if the connection is slow this method will be wrong.
    redisClient.llen(userId, (err, num) => {

        if (err) {
            console.log(err);
        } else {
            let index = num;

            //To await when looping
            (async() => {
                let repeat = true;
                while (repeat && index >= 6) {
                    repeat = await awaitCheckAndChange(reachedOrseen, index, userId, reachedId, redisClient, {io, type}) || false;
                    index = index - 6;
                }
            
            })();

        }

    })


};

exports.reached = (userId, reachedId, redisClient, {io, type}) => {
    reachedAndSeen('reched', userId, reachedId, redisClient, {io, type});
};

exports.seen = (userId, seenId, redisClient, {io, type}) => {
    reachedAndSeen('seen', userId, seenId, redisClient, {io, type});
};