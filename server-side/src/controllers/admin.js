const redis = require('redis');
const redisClient = redis.createClient();
//connet with redis
redisClient.on('connect', () => console.log('Redis admin connect'));

const Admin = require('../models/admin')
const bcrypt = require ('bcrypt');


exports.firstGet= (req, res) => {

    console.log(req.query)
    if(req.query && req.query.admin_id && req.query.admin_token) {
        let queryGetAdmin = 'ADMIN:'+req.query.admin_id;
        redisClient.get(queryGetAdmin, (err, data)=> {
            if(err){

            } else if (data && data ===req.query.admin_token){

                redisClient.hgetall('onlines', (err, onlinesData) => {

                    if(!err && onlinesData) {
                        res.json({onlines: onlinesData});
                    }
                    
                })

            }
        })
    }

    
}

exports.moreConversations= (req, res) => {

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