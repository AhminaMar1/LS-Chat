const Admin = require('../models/admin')
const bcrypt = require ('bcrypt');


exports.firstGet= (req, res) => {

    res.json({test: "Json test succes"});
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

        if(err || data==null || data.password == null){
            infWrong(res);
        }else{

            bcrypt.compare(password, data.password, (err, checkPassword) => {

                if(checkPassword) {
                    let result = {
                        success_login: true,
                        id: data._id,
                        token: data.token
                    }
                    res.status(200).json(result)
                }else {
                    infWrong(res);
                }
            });
        }
    });
}