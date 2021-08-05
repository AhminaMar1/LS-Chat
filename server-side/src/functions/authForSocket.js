exports.userAuth = ({id, checkData, redisClient}, callback) => {
   //The id is the id of socket.
    redisClient.hgetall(id, (err, redisBackData) => {
       
       if (err){
          console.err(err)
       } else {
          //Checking token
          if(redisBackData && redisBackData.user_id == checkData.id && redisBackData.token == checkData.token) {
            
            callback();
          
        }
       }
    });

}

exports.adminAuth = ({checkData, redisClient}, callback) => {
   let adminQuery = 'ADMIN:'+checkData.id;
   redisClient.get(adminQuery, (err, token) => {
      if (err) {
         console.log(err);
      } else if(token && token === checkData.token) {
         //Succes   
         callback();
      }else{
         console.log('The token admin is wrong');
      }
   });
}