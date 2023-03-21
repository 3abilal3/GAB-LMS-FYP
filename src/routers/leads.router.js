const express=require("express")

const router=express.Router();

router.all('/',(req,res,next)=>{
res.json({message:"returning leads routes"})
next()
})
module.exports=router