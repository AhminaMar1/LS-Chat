
exports.storageForCheking = async (data, redisClient, socketId) => {
    const User = require('../models/user');
    User.findById(data.user_id, (err, user) => {
        if (err || !user || !data.token || data.token !== user.token) {
            console.log('err chek user token');
        }else {
            redisClient.hmset(socketId, data);
            let keyOfList = "sl_"+data.user_id; // sl = sockets list
            redisClient.rpush(keyOfList, socketId, (err) => {
                if(err){
                    console.log(err);
                }
            });
        }
    });
}