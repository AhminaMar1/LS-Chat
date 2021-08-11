const {sendToAllSocketOfOneClient} = require('../functions/sendToAllSocketOfOneClient')

const awaitCheckAndChange = async ({runThisFun}, index, userId, reachedId, redisClient, {io, field, condition, socketEmitFun}) => {
    
    //Start and end Indexes of the message
    let sIndex = index - 4;
    let eIndex = index - 1;

    let messagesQuery = 'm:'+userId;
    await redisClient.lrange(messagesQuery, sIndex, eIndex, (err, data) => {
        
        if(err) {
            console.log(err);
        } else if(data && data.length>2) {

            return runThisFun(reachedId, data, userId, redisClient, io, {field, condition, socketEmitFun});

        }

    })
}


const reachedAndSeen = ({runThisFun}, userId, reachedId, redisClient, {io, type, field, condition, socketEmitFun}) => {

    //We will use a positive number to deal with this.. not -1,-4 to get the latest.. because if the connection is slow this method will be wrong.
    //Todo change the comment
    //I will use the negative number.. Beacuse after shearch I get the time complexity of get(N) it's O(N) but if I begin when the latest.. Always the number it's smalest
    let messagesQuery = 'm:'+userId;
    redisClient.llen(messagesQuery, (err, num) => {

        if (err) {
            console.log(err);
        } else {
            let index = 0;

            //To await when looping
            (async() => {
                let repeat = true;
                while (repeat && index-4 >= -num) {
                    repeat = await awaitCheckAndChange({runThisFun}, index, userId, reachedId, redisClient, {io, type, field, condition, socketEmitFun}) || false;
                    index = index - 4;
                }
            
            })();

        }

    })


};

const reached = (userId, reachedId, redisClient, {io, type, field, runThisFun, condition, socketEmitFun}) => {
    return reachedAndSeen({runThisFun}, userId, reachedId, redisClient, {io, type, field, condition, socketEmitFun});
};

const seen = (userId, seenId, redisClient, {io, type, field, runThisFun, condition, socketEmitFun}) => {
    return reachedAndSeen({runThisFun}, userId, seenId, redisClient, {io, type, field, condition, socketEmitFun});
};



//HOF
const runThisFunHOF = (id, data, userId, redisClient, io, {field, condition, socketEmitFun}) => {

    if(data[0] === id && condition(data, userId)) {
            
        let queryRechedAndSeen = 'grs:'+userId;
        redisClient.hset(queryRechedAndSeen, field, id, (err) => {
            if (!err) {
                let dataEmit = {
                    id: id,
                    field,
                    to: userId
                }
                
                socketEmitFun(io, dataEmit, userId, redisClient);
            }
        })

    } else return true;
}

//reached
exports.reachedToUser = (userId, reachedId, redisClient, {io, type}) => {
    
    const  condition = (data, userId) => {
        return (data[1] !== userId)
    }
    
    const socketEmitFun = (io, dataEmit) => {
        return io.to('ADMIN').emit('reachedAndSeen', dataEmit);
    }

    return reached(userId, reachedId, redisClient, {io, type, field: 'my_reached', runThisFun: runThisFunHOF, condition, socketEmitFun})
}
exports.reachedToAdmin = (userId, reachedId, redisClient, {io, type}) => {
    
    const  condition = (data, userId) => {
        return (data[1] === userId)
    }
    
    const socketEmitFun = (io, dataEmit, userId, redisClient) => {
        return sendToAllSocketOfOneClient(userId, redisClient, io, 
            {
                type: 'reachedAndSeen',
                data: dataEmit
            }
        )
    }

    return reached(userId, reachedId, redisClient, {io, type, field: 'admin_reached', runThisFun: runThisFunHOF, condition, socketEmitFun})
}

//Seen
exports.seenFromUser = (userId, seenId, redisClient, {io, type}) => {
    
    const  condition = (data, userId) => {
        return (data[1] !== userId)
    }
    
    const socketEmitFun = (io, dataEmit) => {
        return io.to('ADMIN').emit('reachedAndSeen', dataEmit);
    }

    return seen(userId, seenId, redisClient, {io, type, field: 'my_seen', runThisFun: runThisFunHOF, condition, socketEmitFun})
}

exports.seenFromAdmin = (userId, seenId, redisClient, {io, type}) => {
    
    const  condition = (data, userId) => {
        return (data[1] === userId)
    }
    
    const socketEmitFun = (io, dataEmit, userId, redisClient) => {
        sendToAllSocketOfOneClient(userId, redisClient, io, 
            {
                type: 'reachedAndSeen',
                data: dataEmit
            }
        )
        io.to('ADMIN').emit('reachedAndSeen', dataEmit);
    }

    return seen(userId, seenId, redisClient, {io, type, field: 'admin_seen', runThisFun: runThisFunHOF, condition, socketEmitFun})
}