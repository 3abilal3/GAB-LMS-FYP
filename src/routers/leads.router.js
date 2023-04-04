const express = require("express");
const { userAuthorization } = require("../middlewares/auth.middleware");
const { createNewLeadValidation, replyLeadMessageValidation } = require("../middlewares/formValidation.middleware");
const { insertLeads, getLeads, getLeadsById,deleteLead , updateClientReply, updateStatusClose } = require("../model/leads/leads.model");
const { LeadsSchema } = require("../model/leads/leads.schema");
const mongoose = require('mongoose');
const router = express.Router();

// router.all('/',(req,res,next)=>{
// res.json({message:"returning leads routes"})

// })

//create url endpoint

router.post('/',userAuthorization , async(req, res) => {

    try {
        
    //receive new ticket data
    const { leadName,sender,subject, wealth,experience, currentBusinesses,mostPreferedBusinesses, source,assignedTo,message } = req.body;


    const userId = req.userId
    const assignedToId = mongoose.Types.ObjectId(assignedTo);

    const leadsObj = {
        clientId: userId,
        leadName,sender,subject, wealth,experience, currentBusinesses,mostPreferedBusinesses,assignedTo: assignedToId,message,source,
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
router.put('/:_id', replyLeadMessageValidation ,userAuthorization , async(req, res) => {
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



// Filter leads based on status, source, or assigned user
  
router.get('/filtering', userAuthorization, async (req, res) => {
    const { status, source, assignedTo } = req.query;
    const filter = {};
    if (status) {
      filter.status = status;
    }
    if (source) {
      filter.source = source;
    }
    if (assignedTo) {
      try {
        filter.assignedTo = mongoose.Types.ObjectId(assignedTo);
      } catch (err) {
        res.status(400).send("Invalid assignedTo value");
        return;
      }
    }
    try {
      const leads = await LeadsSchema.find(filter);
      console.log(filter)
      res.send(leads);
    } catch (err) {
      res.status(500).send(err.message);
    }
  });

const filterSchema = {
  type: 'object',
  properties: {
    wealth_min: { type: 'number' },
    wealth_max: { type: 'number' },
    experience_min: { type: 'number' },
    experience_max: { type: 'number' },
    current_business: { type: 'string' },
    preferred_businesses: { type: 'string' }
  }
};
// Define the endpoint to filter the leads
router.post('/filter_leads',userAuthorization, async (req, res) => {
  try {
    // Validate the filter criteria against the schema
    const ajv = new (require('ajv'))();
    const validate = ajv.compile(filterSchema);
    if (!validate(req.body)) {
      return res.status(400).json({ error: 'Invalid filter criteria' });
    }

    // Build the filter query
    const filter = {};
    if (req.body.wealth_min !== undefined) {
      filter.wealth = { $gte: req.body.wealth_min };
    }
    if (req.body.wealth_max !== undefined) {
      filter.wealth = { ...filter.wealth, $lte: req.body.wealth_max };
    }
    if (req.body.experience_min !== undefined) {
      filter.experience = { $gte: req.body.experience_min };
    }
    if (req.body.experience_max !== undefined) {
      filter.experience = { ...filter.experience, $lte: req.body.experience_max };
    }
    if (req.body.current_business !== undefined) {
      filter.currentBusinesses = req.body.current_business;
    }
    if (req.body.preferred_businesses !== undefined) {
      filter.mostPreferedBusinesses= { $regex: new RegExp(req.body.preferred_businesses, 'i') };
    }

    // Find the leads matching the filter criteria
    const leads = await LeadsSchema.find(filter);
    if(leads){
      return res.json(leads)
    }
     return res.json("no leads found")
    // Return the filtered leads
    // return res.json(leads);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


// Define the endpoint to retrieve the filter options
router.get('/filter_options', async (req, res) => {
  try {
    // Retrieve the distinct values of the relevant fields from the leads collection
    const wealthOptions = await LeadsSchema.distinct('wealth');
    const experienceOptions = await LeadsSchema.distinct('experience');
    const currentBusinessOptions = await LeadsSchema.distinct('current_business');
    const preferredBusinessesOptions = await LeadsSchema.distinct('preferred_businesses');

    // Return the filter options
    return res.json({
      wealth_options: wealthOptions,
      experience_options: experienceOptions,
      current_business_options: currentBusinessOptions,
      preferred_businesses_options: preferredBusinessesOptions
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

  

module.exports = router