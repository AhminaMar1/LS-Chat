//Send to all socket client of one user

exports.sendToAllSocketOfOneClient = (id, redisClient, io, {type, data}) => {
    let socketList = 'sl_'+id;

    redisClient.lrange(socketList, 0, -1, (err, allSockets) => {
       //Send to all these sockets (allSockets)
       if(allSockets.length > 0) {
          allSockets.forEach(el => {
             io.to(el).emit(type, data);
          });
       }
    })

}