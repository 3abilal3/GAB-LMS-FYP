
const { randomPinNumber } = require("../../utils/Random.pin");
const { ResetPinSchema } = require("./ResetPin.schema");


// const { UserSchema } = require("./User.schema")

const setPasswordResetPin = async(email) => {
    let pinLen=6;
    const randPIn=await randomPinNumber(pinLen)
    const resetObj={
        email,
        pin:randPIn
    }
    return new Promise((resolve, reject) => {
        ResetPinSchema(resetObj)
            .save()
            .then(data => { resolve(data) })
            .catch(error => { reject(error) })
    })
}

const getPinByEmail =(email,pin)=>{
    return new Promise((resolve, reject) => {
        try {
            ResetPinSchema.findOne({ email,pin }, (error, data) => {
                if (error) {
                    console.log(error)
                    resolve(false)
                }
                resolve(data)
            }
            )
        } catch (error) {
            reject(error)
        }
    
    })
    }
    
    const deletePin =(email,pin)=>{
      
            try {
                ResetPinSchema.findOneAndDelete({ email,pin }, (error, data) => {
                    if (error) {
                        console.log(error)
                        resolve(false)
                    }
                 
                }
                )
            } catch (error) {
                console.log(error)
            }
        
      
        }

   
module.exports = { 
    setPasswordResetPin,
    getPinByEmail,
    deletePin
    
 }