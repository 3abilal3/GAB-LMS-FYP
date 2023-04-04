const Joi = require('joi');

const email= Joi.string()
.email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
const pin= Joi.string().min(6).max(6).required()

const newPassword= Joi.string()
.alphanum()
.min(3)
.max(30)
.required()

const shortStr = Joi.string().min(1).max(5000)
const longStr = Joi.string().min(1).max(5000)

const resetPassValidation =(req,res,next)=>{
    const schema=Joi.object({email})
    const value=schema.validate(req.body)
    if(value.error){
        return res.json({status:"error",message:value.error.message})
    }
    next()
}


const updatePassValidation =(req,res,next)=>{
    const schema=Joi.object({email,pin,newPassword})
    const value=schema.validate(req.body)
    if(value.error){
        return res.json({status:"error",message:value.error.message})
    }
    next()
}

const createNewLeadValidation = (req,res,next) =>{
    const schema=Joi.object({
        subject:shortStr.required(),
        sender:shortStr.required(),
        leadName:longStr.required(),
        sender:longStr.required(),
        currentBusinesses:longStr.required(),
        mostPreferedBusinesses:longStr.required(),
        wealth:longStr.required(),
        experience:longStr.required(),
        message:longStr.required(),
        status:shortStr.required(),
        source:shortStr.required(),
        assignedTo:shortStr.required()

    })    

    const value=schema.validate(req.body)

    if(value.error){
        res.json({status:"error",message:value.error.message})
    }

next()
}



const replyLeadMessageValidation = (req,res,next) =>{
    const schema=Joi.object({
        sender:shortStr.required(),
        message:longStr.required()

    })

    const value=schema.validate(req.body)

    if(value.error){
        return res.json({status:"error",message:value.error.message})
    }

next()
}


module.exports={
    resetPassValidation,
    updatePassValidation,
    createNewLeadValidation,
    replyLeadMessageValidation
}
