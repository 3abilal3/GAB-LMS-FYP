const {StaffSchema} = require("./Staff.schema");
const customerSchema = require("./customer.Schema");
const LeadCategorySchema = require("./category.Schema");
const { LeadsSchema } = require("./leads.schema");





const insertStaff = staffObj =>{

    return new Promise((resolve,reject)=>{
        try {
            StaffSchema(staffObj)
            .save()
            .then((data)=>{
                resolve(data)
                
            })
            .catch((error)=>{
                reject(error)
            })
        
        } catch (error) {

            reject(error)
            
        }
    })
   
}


const insertCat = catOBJ =>{

    return new Promise((resolve,reject)=>{
        try {
            LeadCategorySchema(catOBJ)
            .save()
            .then((data)=>{
                resolve(data)
                
            })
            .catch((error)=>{
                reject(error)
            })
        
        } catch (error) {

            reject(error)
            
        }
    })
   
}


const insertCust = custObj =>{

    return new Promise((resolve,reject)=>{
        try {
            customerSchema(custObj)
            .save()
            .then((data)=>{
                resolve(data)
                
            })
            .catch((error)=>{
                reject(error)
            })
        
        } catch (error) {

            reject(error)
            
        }
    })
   
}

// Function to generate the leads report
function generateLeadsReport(leads) {
    // Perform necessary calculations and formatting to generate the report
    const report = {
      totalLeads: leads.length,
      leads: leads.map(lead => ({
        id: lead.id,
        name: lead.name,
        email: lead.email,
        status: lead.status,
        closed: lead.closed
      }))
    };
  
    return report;
  }

const insertLeads = leadsObj =>{

    return new Promise((resolve,reject)=>{
        try {
            LeadsSchema(leadsObj)
            .save()
            .then((data)=>{
                resolve(data)
                
            })
            .catch((error)=>{
                reject(error)
            })
        
        } catch (error) {

            reject(error)
            
        }
    })
   
}

const insertUserLeads = leadsUserObj =>{

    return new Promise((resolve,reject)=>{
        try {
            LeadsSchema(leadsUserObj)
            .save()
            .then((data)=>{
                resolve(data)
                
            })
            .catch((error)=>{
                reject(error)
            })
        
        } catch (error) {

            reject(error)
            
        }
    })
   
}

const getLeads = clientId =>{

    return new Promise((resolve,reject)=>{
        try {
            LeadsSchema
            .find({clientId})
            .then((data)=>{
                resolve(data)
                
            })
            .catch((error)=>{
                reject(error)
            })
        
        } catch (error) {

            reject(error)
            
        }
    })
   
}

const getLeadsById = (_id,clientId) =>{

    return new Promise((resolve,reject)=>{
        try {
            LeadsSchema
            .findOne({_id,clientId})
            .then((data)=>{
                resolve(data)
                
            })
            .catch((error)=>{
                reject(error)
            })
        
        } catch (error) {

            reject(error)
            
        }
    })
   
}

const updateClientReply = ({_id,message,sender}) =>{

    return new Promise((resolve,reject)=>{
        try {
            LeadsSchema.findOneAndUpdate(
                {_id},
                {
                    status:"pending operator response",
                    $push:{
                        conservation:[
                            {
                                message,
                                sender
                    }]
                        }
                },
                {new:true}
            
            )
            .then((data)=>{
                resolve(data)
                
            })
            .catch((error)=>{
                reject(error)
            })
        
        } catch (error) {

            reject(error)
            
        }
    })
   
}

const  updateStatusClose = ({_id,clientId}) =>{

    return new Promise((resolve,reject)=>{
        try {
            LeadsSchema.findOneAndUpdate(
                {_id, clientId},
                {
                    status:"closed",
                },
                {new:true}
            
            )
            .then((data)=>{
                resolve(data)
                })
            .catch((error)=>{
                reject(error)
            })
        
        } catch (error) {

            reject(error)
            
        }
    })
   
}

const  deleteLead = ({_id,clientId}) =>{

    return new Promise((resolve,reject)=>{
        try {
            LeadsSchema.findOneAndDelete(
                {_id, clientId},
                
            
            )
            .then((data)=>{
                resolve(data)
                
            })
            .catch((error)=>{
                reject(error)
            })
        
        } catch (error) {

            reject(error)
            
        }
    })
   
}

module.exports={
    insertLeads,
    getLeads,
    getLeadsById,
    updateClientReply,
    updateStatusClose,
    deleteLead,
    insertUserLeads,
    generateLeadsReport,
    insertStaff,
    insertCust,
    insertCat
}