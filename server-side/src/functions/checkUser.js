
exports.storageForCheking = async (data, redisClient, socketId) => {
    const User = require('../models/user');
    User.findById(data.user_id, (err, user) => {
        if (err || !user || !data.token || data.token !== user.token) {
            console.log('err chek user token');
        }else {
            console.log(socketId);
            redisClient.hmset(socketId, data);
        }
    });
}