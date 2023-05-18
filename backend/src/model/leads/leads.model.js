const { LeadsSchema } = require("./leads.schema");



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
    insertUserLeads
    
}