exports.userAuth = ({checkData, redisClient}, callback) => {
   if(checkData && checkData.id && checkData.token) {
      let userQuery = 'USER:'+checkData.id;
      redisClient.get(userQuery, (err, redisBackData) => {
         
         if (err){
            console.err(err)
         } else if(redisBackData === checkData.token) {

            callback();
            
         }
      });
   }

}

exports.adminAuth = ({checkData, redisClient}, callback) => {
   if(checkData) {
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
}