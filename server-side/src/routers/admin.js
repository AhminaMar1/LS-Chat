const router = require('express').Router()

const adminController = require('../controllers/admin');

//To get the last 10 titles-of-mssg-box (redis)
// and to get onlines-users (from redis)
// and to get the lastest mssgs-conversation
router.get('/firstget' , adminController.firstGet);

// the next 10 (DB)
router.get('/moreconversations' , adminController.moreConversations);

//get name of user
router.get('/getname' , adminController.getName);

//login part
router.post('/login' , adminController.login);


router.post('/checkadmin' , adminController.checkAdmin);

module.exports  = router;