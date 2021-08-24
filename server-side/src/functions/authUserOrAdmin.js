exports.authUserOrAdmin = (req, {userAuth, adminAuth, redisClient}, callback) => {

    let id = req.query.id,
        token= req.query.token,
        admin = req.query.admin,
        userId = req.query.id_user;

    if(id && token) {
        let checkData = {id, token}
        userAuth({checkData, redisClient}, () => {
            callback(id, 'client');
        });
    }else if (admin && userId) {

        let checkDataAdmin = {
            id: req.query.admin_id,
            token: req.query.admin_token
        }

        adminAuth({checkData: checkDataAdmin, redisClient}, () => {
            callback(userId, 'admin');
        })
    }

}