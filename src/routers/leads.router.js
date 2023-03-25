const express = require("express");
const { userAuthorization } = require("../middlewares/auth.middleware");
const { insertLeads, getLeads, getLeadsById,deleteLead , updateClientReply, updateStatusClose } = require("../model/leads/leads.model");

const router = express.Router();

// router.all('/',(req,res,next)=>{
// res.json({message:"returning leads routes"})

// })

//create url endpoint

router.post('/', userAuthorization , async(req, res) => {

    try {
        
    //receive new ticket data
    const { subject, sender, message } = req.body;

    const userId = req.userId

    const leadsObj = {
        clientId: userId,
        subject ,
        conservation: [
            {
                sender,
                message,
            }
        ]
    }
    const result = await insertLeads(leadsObj);
    console.log(result)
    //insert in mongodb

    if(result._id){
        return res.json({ status:"success" ,message: "new lead have been created" })

    }

    res.json({ status:"error" ,message: "Unable to create ticket please try again later" })
        
    } catch (error) {
 res.json({ status:"error" ,message: error.message })
        
    }


})  


//get all leads for specific user only
router.get('/', userAuthorization , async(req, res) => {

    try {       
    const userId = req.userId
    
    const result = await getLeads(userId);
    console.log(result)
    //insert in mongodb

        return res.json({ status:"success" , result })
        
    } catch (error) {
 res.json({ status:"error" ,message: error.message })
        
    }


}) 

//get single lead by id
router.get('/:_id', userAuthorization , async(req, res) => {
console.log(req.params)
    try {       
    const clientId = req.userId
    const {_id}=req.params;
    const result = await getLeadsById(_id,clientId)
    console.log(result)
    //insert in mongodb

        return res.json({ status:"success" , result })
        
    } catch (error) {
 res.json({ status:"error" ,message: error.message })
        
    }


}) 

//update the lead status after client reply
router.put('/:_id', userAuthorization , async(req, res) => {
        try {     
        const { message, sender} = req.body;  
        const clientId = req.userId
        const {_id}=req.params;
        const result = await updateClientReply({_id,message,sender})
        console.log(result)
        //insert in mongodb
    if(result._id){
        return res.json({ status:"success" , message:"your message have been updated" })

    }
    return res.json({ status:"success" , message:"Unable to update your message please try again later "  })
            
        } catch (error) {
     res.json({ status:"error" ,message: error.message })
            
        }
    
    
}) 

//update the leads status to close the leads
router.patch('/close-lead/:_id', userAuthorization , async(req, res) => {
    try {     
    const clientId = req.userId
    const {_id}=req.params;
    const result = await updateStatusClose({_id,clientId})
    console.log(result)
    //insert in mongodb
if(result._id){
    return res.json({ status:"success" , message:"your lead have been closed" })

}
return res.json({ status:"success" , message:"Unable to update your message please try again later "  })
        
    } catch (error) {
 res.json({ status:"error" ,message: error.message })
        
    }


}) 

//Delete  the lead which have been closed
router.delete('/:_id', userAuthorization , async(req, res) => {
    try {     
    const clientId = req.userId
    const {_id}=req.params;
    const result = await deleteLead({_id,clientId})
    console.log(result)
    //insert in mongodb

    return res.json({ status:"success" , message:"your lead have been deleted from our system" })

        
    } catch (error) {
 res.json({ status:"error" ,message: error.message })
        
    }


}) 





module.exports = router