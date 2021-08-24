const router = require('express').Router()

const clientController = require('../controllers/client');

//gets from mongoDB

//Get my lastest doc-mssg
router.get('/lastchatdoc' , clientController.lastChatDoc)

// Get the prev doc-mssgs
router.get('/prevchatdoc' , clientController.prevChatDoc)


// start session. Create and retuen the token
router.post('/startsession' , clientController.startSession)

module.exports  = router;