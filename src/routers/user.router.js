const express = require("express")
const { insertUser, getUserByEmail, getUserById, updatePassword, storeUserRefreshJWT } = require('../model/user/User.model')
const router = express.Router();

const { hashedPassword, compPassword } = require('../helpers/bcrypt.helper');
const { createAccessJWT, createRefreshJWT } = require("../helpers/jwt.helper");
const { userAuthorization } = require("../middlewares/auth.middleware");
const { setPasswordResetPin, getPinByEmail, deletePin } = require("../model/resetpin/Resetpin.model");
const { emailProcessor } = require("../helpers/email.helper");
const { resetPassValidation, updatePassValidation } = require("../middlewares/formValidation.middleware");
const { deleteJWT } = require("../helpers/redis.helper");

router.all('/', (req, res, next) => {
    // res.json({message:"returning user routes"})
    next()
})

router.post('/', async (req, res) => {
    const { name, company, password, address, phone, email } = req.body
    try {
        const hashed = await hashedPassword(password)
        const newUserObj = { name, company, password: hashed, address, phone, email }
        const result = await insertUser(newUserObj)
        console.log(result)
        return res.json({ message: "new user created", result })
    } catch (error) {
        console.log(error)
        res.json({ status: "error", message: error.message })
    }

})

router.get('/',userAuthorization,async(req,res)=>{
  const _id= req.userId
    const userProf =await getUserById(_id)
    res.json({ user: userProf })

     })

router.post('/login', async (req, res) => {
    const { email, password } = req.body
    console.log(req.body)

    if (!email || !password) {
        res.json({ status: "Invalid", message: "invalid email or password" })

    }
    const user = await getUserByEmail(email)
    const passFromDb = user && user._id ? user.password : null
    if (!passFromDb) return res.json({ status: "Error", message: "invalid email or password" })



    const result = await compPassword(password, passFromDb)

    if (!result) { 
        res.json({ status: "Invalid", message: "invalid email or password" })

    }
    const accessJWT = await createAccessJWT(user.email,`${user._id}`)
    const refreshJWT = await createRefreshJWT(user.email,`${user._id}`)

    console.log(result)
    res.json({ status: "Success", message: "login successfully",accessJWT,refreshJWT})

})

router.post('/reset-password',resetPassValidation ,async(req,res)=>{
    const {email} =req.body;
    //validating with db
    const user= await getUserByEmail(email);

    if(user && user._id){
        //create a 6 digit pin
        const setPin =await setPasswordResetPin(email);
        await emailProcessor({email,pin:setPin.pin,type:'request reset-password'})

       
            return res.json({status:"success",
            message:"if your email exist in our db then a password reset email wil be sent to you in few seconds"})
                
  }

    
        
    

    res.json({status:"error",
    message:"if your email exist in our db then a password reset email wil be sent to you in few seconds"})
})



router.patch('/reset-password',updatePassValidation,async(req,res)=>{
    const { email,pin,newPassword } = req.body;
    const getPin = await getPinByEmail(email,pin)
 
    //validate pin

    if(getPin._id){
        const dbDate = getPin.addedAt;
        const expiresIn =1;
        let expDate = dbDate.setDate(dbDate.getDate()+expiresIn)
        
        const today=new Date()

        if(today>expDate){
            return res.json({status:"error",message:"The pin is invalid or expired"})
        }
        //encrypt the password

        const hashedPass = await hashedPassword(newPassword)

        const user = await updatePassword(email,hashedPass)

        if(user._id){
        
             await emailProcessor({email,type:'update-password'})
             deletePin(email,pin)

           return res.json({status:"success",message:"you password has been updated successfully"})
        }
    }
    res.json({status:"error",message:"unable to update your password please try again later"})

}) 


router.delete('/logout',userAuthorization,async(req,res)=>{
    const {authorization}= req.headers
      //this is coming from db
      const _id =req.userId 
      //delete access jwt from redis db
      deleteJWT(authorization)
      //delete refresh jwt from atlas
      const result = await storeUserRefreshJWT(_id,'')
        if(result._id){
            
      return res.json({ status: "success", message:"logged out successfully" })
        }
      res.json({ status: "error", message:"cant logged out!!!!!!try again later" })
  
       })




module.exports = router