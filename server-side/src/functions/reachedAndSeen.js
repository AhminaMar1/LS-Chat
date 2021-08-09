const {sendToAllSocketOfOneClient} = require('../functions/sendToAllSocketOfOneClient')

const awaitCheckAndChange = async ({indexOfRedes, runThisFun}, index, userId, reachedId, redisClient, {io, type, condition, socketEmitFun}) => {
    
    //Start and end Indexes of the message
    let sIndex = index - 6;
    let eIndex = index - 1;

    await redisClient.lrange(userId, sIndex, eIndex, (err, data) => {
        
        if(err) {
            console.log(err);
        } else if(data && data.length>2) {

            return runThisFun(reachedId, data, userId, sIndex, indexOfRedes, redisClient, io, {condition, socketEmitFun});

        }

    })
}


const reachedAndSeen = ({indexOfRedes, runThisFun}, userId, reachedId, redisClient, {io, type, condition, socketEmitFun}) => {

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
                    repeat = await awaitCheckAndChange({indexOfRedes, runThisFun}, index, userId, reachedId, redisClient, {io, type, condition, socketEmitFun}) || false;
                    index = index - 6;
                }
            
            })();

        }

    })


};

const reached = (userId, reachedId, redisClient, {io, type, runThisFun, condition, socketEmitFun}) => {
    return reachedAndSeen({indexOfRedes: 3, runThisFun}, userId, reachedId, redisClient, {io, type, condition, socketEmitFun});
};

const seen = (userId, seenId, redisClient, {io, type, runThisFun, condition, socketEmitFun}) => {
    return reachedAndSeen({indexOfRedes: 4, runThisFun}, userId, seenId, redisClient, {io, type, condition, socketEmitFun});
};



//reached
const runThisFunHOF = (id, data, userId, sIndex, indexOfRedes, redisClient, io, {condition, socketEmitFun}) => {

    if(condition(data, id, userId)) {
        if(data[indexOfRedes] == 'false'){
            redisClient.lset(userId, sIndex+indexOfRedes, true, (err) => {
                if (!err) {
                    let dataEmit = {
                        id: id,
                        reached : true,
                        seen: (indexOfRedes === 4) ? true : false,
                    }

                    socketEmitFun(io, dataEmit, userId, redisClient);
                }
            });
        }
    } else return true;
}

exports.reachedToUser = (userId, reachedId, redisClient, {io, type}) => {
    
    const  condition = (data, id, userId) => {
        return (data[0] === id && data[1] !== userId)
    }
    
    const socketEmitFun = (io, dataEmit) => {
        return io.to('ADMIN').emit('reachedAndSeen', dataEmit);
    }

    return reached(userId, reachedId, redisClient, {io, type, runThisFun: runThisFunHOF, condition, socketEmitFun})
}
exports.reachedToAdmin = (userId, reachedId, redisClient, {io, type}) => {
    
    const  condition = (data, id, userId) => {
        return (data[0] === id && data[1] === userId)
    }
    
    const socketEmitFun = (io, dataEmit, userId, redisClient) => {
        return sendToAllSocketOfOneClient(userId, redisClient, io, 
            {
                type: 'reachedAndSeen',
                data: dataEmit
            }
        )
    }

    return reached(userId, reachedId, redisClient, {io, type, runThisFun: runThisFunHOF, condition, socketEmitFun})
}

//Seen
exports.seenFromUser = (userId, seenId, redisClient, {io, type}) => {
    
    const  condition = (data, id, userId) => {
        return (data[0] === id && data[1] !== userId)
    }
    
    const socketEmitFun = (io, dataEmit) => {
        return io.to('ADMIN').emit('reachedAndSeen', dataEmit);
    }

    return seen(userId, seenId, redisClient, {io, type, runThisFun: runThisFunHOF, condition, socketEmitFun})
}

exports.seenFromAdmin = (userId, seenId, redisClient, {io, type}) => {
    
    const  condition = (data, id, userId) => {
        return (data[0] === id && data[1] === userId)
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

    return seen(userId, seenId, redisClient, {io, type, runThisFun: runThisFunHOF, condition, socketEmitFun})
}