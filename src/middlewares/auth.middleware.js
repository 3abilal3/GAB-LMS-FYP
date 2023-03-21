const { request } = require("express")
const jwt = require("jsonwebtoken")
const { verifyAccessJWT } = require("../helpers/jwt.helper")
const { getJWT, deleteJWT } = require("../helpers/redis.helper")


const userAuthorization=async(req,res,next)=>{
    const { authorization }=req.headers

    const decode=await verifyAccessJWT(authorization)
    if(decode.email){
        const userId=await getJWT(authorization)
        if(!userId){

        return res.status(403).json({message:"forbidden 1"})

        }
        req.userId= userId
        return next()

    }
    deleteJWT(authorization);
    return res.status(403).json({message:"forbidden 2"})
    
    
}

module.exports={
    userAuthorization
}