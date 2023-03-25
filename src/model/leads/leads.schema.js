const mongoose=require('mongoose')

const LeadsSchema=mongoose.Schema({
    clientId:{
        type: mongoose.Schema.Types.ObjectId
    },
    subject:{
        type:String,
        required:true,
        maxlength:100,
        default:""
    },

    openAT:{
        type:Date,
        required:true,
        default:Date.now()

    },
    status:{
        type:String,
        required:true,
        maxlength:30,
        default:"pending operator response"
    }
    ,
    conservation:[
        {
            sender:{
                type:String,
                required:true,
                maxlength:50,
                default:""
            },
            message:{
                type:String,
                required:true,
                maxlength:1000,
                default:""
                
            },
            msgAt:{
                type:Date,
                required:true,
                default:Date.now()
        

            }
        }
    ]
})

module.exports={
    LeadsSchema:mongoose.model("Leads",LeadsSchema)
}
