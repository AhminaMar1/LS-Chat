
exports.storageForCheking = (data, redisClient, socketId, io) => {
    const User = require('../models/user');
    User.findById(data.user_id, (err, user) => {
        if (err || !user || !data.token || data.token !== user.token) {
            console.log('err chek user token');
        }else {
            let id = data.user_id;
            let name = (user.new_name) ? user.new_name : user.random_name;
            let hmData = {
                user_id: id,
                token: data.token,
                name: name
            }
            let socketIdQuery = 'sid:'+socketId; //si = Socket id
            redisClient.hmset(socketIdQuery, hmData);
            
            let userQuery = 'USER:'+id;
            redisClient.set(userQuery, data.token, (err) => {console.log(err)});

            let nameQuery = 'NAME:'+id;
            redisClient.set(nameQuery, name);

            let keyOfList = "sl:"+id; // sl = sockets list
            redisClient.rpush(keyOfList, socketId, (err) => {
                if(err){
                    console.log(err);
                }
            });

            //List of connect users


            
            redisClient.hmset("onlines", id, name, (err) => {
                if(err){
                    console.log(err);
                } else {
                    //Send the updating of the list of onlines to the Admins
                    io.to('ADMIN').emit("newOnlineUser", {id: id, name: name})
                }

            });

        }
    });
}