const jwt = require('jsonwebtoken');

const authCheck = (req, res, next)=>{
    try{
    const decoted = jwt.verify(req.body.token, process.env.JWT_SECRET);
    const {userID, accessToken, userName, email, Avatar,} = decoted;
    req.userID = userID;
    req.accessToken =accessToken;
    req.userName = userName;
    req.email = email;
    req.Avatar = Avatar;
    next();
    }
    catch{
    next()
    }
};

module.exports = authCheck;