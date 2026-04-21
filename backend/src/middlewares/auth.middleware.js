const jwt = require("jsonwebtoken");
const tokenBlacklistModel = require('../models/blacklist.model');

async function authMiddleware(req, res, next) {
    const token = req.cookies.token

    if(!token){
        return res.status(401).json({
            message: "Unauthorized token not provided"
        })
    }
    const isBlacklisted = tokenBlacklistModel.findOne({token})  
    if(isBlacklisted){
        return res.status(401).json({
            message: "Unauthorized token is blacklisted please login again"
        })
    }
    try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next()
    }
    catch(err){
        return res.status(401).json({
            message:"Invalid token"
        

    })
    
    }
}

module.exports = {authMiddleware};
