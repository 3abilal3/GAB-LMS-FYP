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
    
    leadName:{
        type:String,
        required:true,
        maxlength:100,
        default:""
    },
    wealth:{
        type:Number,
        required:true,
        maxlength:100,
        default:""
    },
    experience:{
        type:Number,
        required:true,
        maxlength:1000,
        default:""
    },
    currentBusinesses:{
        type:Number,
        required:true,
        maxlength:10000,
        default:""
    },
    mostPreferedBusinesses:{
        type:String,
        required:true,
        maxlength:10000,
        default:""
    },
    assignedTo: { type: mongoose.Schema.Types.ObjectId },
    status: { type: String },
    source: { type: String },

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
    },
    engagement: Number, // 1-10 scale
    levelOfInterest: Number, // 1-10 scale
    demographic: {
      age: Number,
      gender: String,
      location: String
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
