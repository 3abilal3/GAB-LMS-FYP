
const { UserSchema } = require("./User.schema")

const insertUser = userObj => {
    return new Promise((resolve, reject) => {
        UserSchema(userObj).save()
            .then(data => { resolve(data) })
            .catch(error => { reject(error) })
    })
}

const getUserByEmail = (email) => {
 

    return new Promise((resolve, reject) => {
        if (!email) return error
        try {
            UserSchema.findOne({ email }, (error, data) => {
                if (error) {
                    console.log(error)
                    reject(error)
                }
                resolve(data)
                console.log(data)
            }
            )
        } catch (error) {
            console.log(error)
        }

    })
}

const getUserById = (_id) =>{
    return new Promise((resolve, reject) => {
        if (!_id) return error
        try {
            UserSchema.findOne({ _id }, (error, data) => {
                if (error) {
                    console.log(error)
                    reject(error)
                }
                resolve(data)
            }
            )
        } catch (error) {
            reject(error)
        }

    })
}


const storeUserRefreshJWT = (_id, token) => {
    return new Promise((resolve, reject) => {

        try {
            UserSchema.findOneAndUpdate(
                { _id },
                {
                    $set: {
                        "refreshJWT.token": token,
                        "refreshJWT.addedAt": Date.now()
                    },
                },
                {
                    new: true
                }
            ).then((data) => { resolve(data) })
            .catch((error) => {
                reject(error)
                console.log(error)

            })
        } catch (error) {
            reject(error)
            console.log(error)
            
        }
})

}
    
const updatePassword = (email,newHashPass)=>{
    return new Promise((resolve, reject) => {

        try {
            UserSchema.findOneAndUpdate(
                { email },
                {
                    $set: {
                       password: newHashPass
                    },
                },
                {
                    new: true
                }
            ).then((data) => { resolve(data) })
            .catch((error) => {
                reject(error)
                console.log(error)

            })
        } catch (error) {
            reject(error)
            console.log(error)
            
        }
})
}
   
module.exports = { insertUser, getUserById ,getUserByEmail,storeUserRefreshJWT,updatePassword }