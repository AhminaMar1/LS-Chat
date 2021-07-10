const router = require('express').Router()

const clientController = require('../controllers/client');

//gets from mongoDB

//Get my lastest doc-mssg
router.get('/lastchatdoc' , (req , res)=>{
})

// Get the prev doc-mssgs
router.get('/prevchatdoc' , (req , res)=>{

})


// start session. Create and retuen the token
router.post('/startsession' , clientController.startSession)

module.exports  = router;