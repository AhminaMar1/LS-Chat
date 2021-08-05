checkTokenOfUserFun = ({id, checkData, redisClient}, callback) => {

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

exports.checkTokenOfUser = checkTokenOfUserFun;
