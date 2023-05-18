const mongoose=require('mongoose')

const ResetPinSchema=mongoose.Schema({
    "email":{
        type:String,
        required:true
    },
    "pin":{
        type:String,
        minLength:6,
        maxLength:6,
    },
    "addedAt":{
        type:Date,
        required:true,
        default:Date.now()
    }
})

module.exports={
    ResetPinSchema:mongoose.model("ResetPin",ResetPinSchema)
}