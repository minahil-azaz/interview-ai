const jwt = require("jsonwebtoken");
const tokenBlacklistModel = require('../models/blacklist.model');

async function authMiddleware(req, res, next) {
    // Check for token in cookies first, then Authorization header
    let token = req.cookies.token;
    
    if (!token && req.headers.authorization) {
        // Extract token from "Bearer <token>" format
        const authHeader = req.headers.authorization;
        if (authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7);
        }
    }

    if(!token){
        return res.status(401).json({
            message: "Unauthorized token not provided"
        })
    }
    const isBlacklisted = await tokenBlacklistModel.findOne({token})  
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
