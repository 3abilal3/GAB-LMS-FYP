const mongoose=require('mongoose')

const userSchema=mongoose.Schema({

    "name":{
        type:String,
        required:true,
        maxlength:50
    },
    "company":{
        type:String,
        required:true,
        maxlength:50
    },
    "address":{
        type:String,
        required:true,
        maxlength:50
    },
    "phone":{
        type:Number,
        required:true,
        maxlength:12
    },
    "email":{
        type:String,
        required:true,
        unique:true,
        maxlength:20
    },
    "password":{
        type:String,
        required:true,
    
        minlength:8
    },
    refreshJWT:{
        token:{
        type:String,
        maxlength:500,
        default:""
        },
        adddedAt:{
            type:Date,
            required:true,
            default:Date.now()
        },
    }
})

module.exports={
    UserSchema:mongoose.model("NewUser",userSchema)
}
