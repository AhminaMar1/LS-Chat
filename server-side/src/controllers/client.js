const User = require('../models/user')

exports.lastChatDoc = (req, res) => {
    
}

exports.prevChatDoc = (req, res) => {
    
}

const clientFunctions = require('../functions/client');

exports.startSession = async (req, res) => {
    
    let id = req.body.id || null,
        token = req.body.token || null;

    if (id === null || token === null){
        //Create new session
        clientFunctions.saveNewSession(User, res)
    } else {
        User.findById(id, function (err, user) {
            if (err || !user) {

                //Create new session
                clientFunctions.saveNewSession(User, res)
    
            } else {
                
                if (token===user.token) {
                    //result to return it
                    const resultat = {
                        _id: user._id,
                        random_name: user.random_name,
                        token: user.token,
                        already: true
                    }
                    //succes status
                    res.status(200).json(resultat)
                } else {
                    //Create new session
                    clientFunctions.saveNewSession(User, res)
                }
            }
        });
    }
}