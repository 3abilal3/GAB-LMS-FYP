const jwt = require('jsonwebtoken');
const { storeUserRefreshJWT } = require('../model/user/User.model');
const { setJWT,getJWT } = require('./redis.helper');
const dotenv=require('dotenv').config()


const createAccessJWT = async(email,_id) => {
    try {
    const accessJWT = await jwt.sign({ email }, process.env.JWT_ACCESS_SECRET, { expiresIn: '1y' });
    await setJWT(accessJWT,_id)
    return Promise.resolve(accessJWT)
    } catch (error) {
        
    return Promise.reject(error)
    }
    
}

const createRefreshJWT = async(email,_id) => {
   try {
    const refreshJWT = await jwt.sign({ email }, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' })
    await storeUserRefreshJWT(_id,refreshJWT)
    return Promise.resolve(refreshJWT)
    
   } catch (error) {
    console.log(error)
    Promise.reject(error)
   } 
}


const verifyAccessJWT=(userJWT)=>{
    try {
        return Promise.resolve(jwt.verify(userJWT,process.env.JWT_ACCESS_SECRET))
    } catch (error) {
        return Promise.resolve(error)
    }
}


const verifyRefreshJWT=(userJWT)=>{
    try {
        return Promise.resolve(jwt.verify(userJWT,process.env.JWT_REFRESH_SECRET))
    } catch (error) {
        return Promise.resolve(error)
    }
}

module.exports = {
    createRefreshJWT,
    createAccessJWT,
    verifyAccessJWT,
    verifyRefreshJWT
}