const express=require("express");
const { verifyRefreshJWT, createAccessJWT } = require("../helpers/jwt.helper");
const { getUserByEmail } = require("../model/user/User.model");

const router=express.Router();

router.all('/',async(req,res,next)=>{

    const {authorization}=req.headers

    const decoded= await verifyRefreshJWT(authorization);

    if(decoded.email){
        const userProf = await getUserByEmail(decoded.email)
        if(userProf._id){
            res.status(200).json({message:userProf});

            let tokenExp  =userProf.refreshJWT.adddedAt;

            tokenExp=tokenExp.setDate(tokenExp.getDate() + parseInt(process.env.JWT_REFRESH_SECRET_EXP_DATE));
          const todayDate=new Date();
          if(tokenExp<todayDate){
            return res.status(403).json({message:"token is expired"})
          }

            const accessJWT = await createAccessJWT(decoded.email,userProf._id.toString())
        return res.status(200).json({message:"success",accessJWT})
            
        }
    }
   
   return res.status(403).json({message:"forbidden"})


})
module.exports=router