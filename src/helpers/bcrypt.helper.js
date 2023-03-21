const bcrypt= require('bcrypt')
const saltRounds=10;
const hashedPassword= plainPassword=>{
return new Promise(resolve=>{
resolve(bcrypt.hashSync(plainPassword,saltRounds))
})
}

const compPassword=(plainPass,passFromDb)=>{
    return new Promise((resolve,reject)=>{
        bcrypt.compare(plainPass,passFromDb,function(err,result){
                if(err){
                    reject(err)
                }
                resolve(result)
        })
    })
}

module.exports={
    hashedPassword,
    compPassword
}