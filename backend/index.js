const express= require ("express")
const bodyParser=require("body-parser")
const cors=require("cors")
const morgan=require("morgan")
const helmet = require("helmet")
const userRouter=require("./src/routers/user.router")
const tokensRouter=require("./src/routers/tokens.router")
const leadsRouter=require("./src/routers/leads.router")
const handleError=require("./src/utils/errorHandler")
const mongoose=require("mongoose")
const dotenv=require('dotenv').config()
const app=express()

// const customCron =require('./cron')

//for api security
// app.use(helmet())<


//handles cors error
app.use(cors())

//logger
app.use(morgan("tiny"))

//body parser
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

PORT=process.env.PORT 

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected!',process.env.MONGODB_URL))
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });
  mongoose.set('strictQuery', false);
  mongoose.set('bufferCommands', true);
  mongoose.set('autoCreate', false);




//routes
app.use('/v1/user',userRouter)
app.use('/v1/leads',leadsRouter)
app.use('/v1/tokens',tokensRouter)

app.use((req,res,next)=>{
    const error=new Error("resource not found")
    error.status=404
    next(error)
})


app.use((error,req,res,next)=>{
handleError(error,res)
})

// customCron.sendMailAllUser();

app.listen(PORT,()=>{console.log(`app is listening on port ${PORT}`)})