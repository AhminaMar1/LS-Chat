const redis = require('redis');
const redisClient = redis.createClient();
//connet with redis
redisClient.on('connect', () => console.log('Redis admin connect'));

//Async redis
const asyncRedis = require("async-redis");
const asyncClient = asyncRedis.createClient();

asyncClient.on("error", function (err) {
    console.log("Error " + err);
});


const Admin = require('../models/admin')
const bcrypt = require ('bcrypt');
const {adminAuth} = require('../functions/authForSocket');
const {getConversations} = require('../functions/arrangeConversations');
exports.firstGet= (req, res) => {

    const tokenIsFalse = (res) => {
        res.status(200).json({token_is_true: false});
    }


    if(req.query && req.query.admin_id && req.query.admin_token) {
        let checkData = {
            id: req.query.admin_id,
            token: req.query.admin_token
        };

        adminAuth({checkData, redisClient}, () => {
            //callback // like a resoleve
            redisClient.hgetall('onlines', (err, onlinesData) => {

                if(!err) {
                    res.json({token_is_true: true, onlines: onlinesData});
                } else {
                    tokenIsFalse(res);
                }
                
            })


        }, () => {
            //reject // like a error
            tokenIsFalse(res);
        })


        
    }

    
}

exports.moreConversations= (req, res) => {
    if(req.query && req.query.admin_id && req.query.admin_token) {
        let checkData = {
            id: req.query.admin_id,
            token: req.query.admin_token
        };
        adminAuth({checkData, redisClient}, () => {
        
            let start = req.query.id_start || null;
            
            getConversations({redisClient, asyncClient}, start, (data) => {
                res.status(200).json(data); 
            });
        
        });

    }

}

exports.getName= (req, res) => {

    if(req.query && req.query.admin_id && req.query.admin_token && req.query.user_id) {

        let id = req.query.user_id;
        let checkData = {
            id: req.query.admin_id,
            token: req.query.admin_token
        };

        adminAuth({checkData, redisClient}, () => {
            let nameQuery = 'NAME:'+id;
            redisClient.get(nameQuery, (err, name) => {
                if (!err && name) {

                    let retRes = {
                        id,
                        name,
                    }
                    
                    res.status(200).json(retRes);
                }
            });
        
        });
    }
}


exports.login= async (req, res) => {

    const infWrong = (res) => {
        let result = {
            success_login: false,
        }
        res.status(200).json(result)
    }

    let username = req.body.username || "test",
    password = req.body.password
    Admin.findOne({
        "username": username
    }, (err, data) => {

        if(err || data==null || data.password == null || data.token == null){
            infWrong(res);
        }else{
            let queryGetAdmin = 'ADMIN:'+data._id;
            let dataToken = data.token;

            bcrypt.compare(password, data.password, (err, checkPassword) => {

                if(checkPassword) {
                    redisClient.get(queryGetAdmin, (err, data) => {
                        if (err) {

                        } else if (data == null) {
                            redisClient.set(queryGetAdmin, dataToken, (err) => {});
                        }
                    })
                    
                    let result = {
                        success_login: true,
                        id: data._id,
                        token: dataToken
                    }
                    res.status(200).json(result)
                }else {
                    infWrong(res);
                }
            });
        }
    });
}

exports.checkAdmin= async (req, res) => {
    
    let checkData = {
        id: req.body.admin_id,
        token: req.body.admin_token
    };

    adminAuth({checkData, redisClient}, 
        //True
        () => {
            let resSend = {
                auth: true
            }
            res.status(200).json(resSend);
        },
        //false
        () => {
            let resSend = {
                auth: false
            }

            res.status(200).json(resSend);
        }

        );
}