const Admin = require('../models/admin')

exports.firstGet= (req, res) => {

    res.json({test: "Json test succes"});
}

exports.moreConversations= (req, res) => {

}

exports.login= async (req, res) => {

    let username = req.body.username || "test",
    password = req.body.password
    Admin.findOne({
        "username": username
    }, (err, data) => {
        if(err || data==null || password !== data.password) {
            let result = {
                success_login: false,
            }
            res.status(400).json(result)
        } else {
            let result = {
                success_login: true,
                token: data.token
            }
            res.status(200).json(result)
        }
    })

}