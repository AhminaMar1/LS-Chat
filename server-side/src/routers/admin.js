const router = require('express').Router()


//To get the last 10 titles-of-mssg-box (redis)
// and to get onlines-users (from redis)
// and to get the lastest mssgs-conversation
router.get('/firstget' , (req , res)=>{

});

// the next 10 (DB)
router.get('/moreconversations' , (req , res)=>{

});

router.post('/login' , (req , res)=>{
    // router code here
});

module.exports  = router;