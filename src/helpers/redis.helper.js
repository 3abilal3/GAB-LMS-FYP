const redis = require("redis");
const client = redis.createClient();
 
client.on("error", function(error) {
  console.error(error);
});
  

// const setJWT=(key,value)=>{
//     try {
//         return new Promise((resolve,reject)=>{
//             client.set(key, value,(err,resp)=>{
//                 if(err){
//                     reject(err)
//                 }
//                 resolve(resp)
//             });
            
//         })
//     } catch (error) {
//         reject(error)
//     }
// }

// const getJWT=(key)=>{
//     try {
//         return new Promise((resolve,reject)=>{
//             client.get(key,(err,resp)=>{
//                 if(err){
//                     reject(err)
//                 }
//                 resolve(resp)
//             });
            
//         })
//     } catch (error) {
//         reject(error)
//     }
// }   

// const deleteJWT = (key) => {
//     return new Promise((resolve, reject) => {
//       try {
//         client.del(key, (err, resp) => {
//           if (err) {
//             reject(err);
//           }
//           resolve(resp);
//         });
//       } catch (error) {
//         reject(error);
//       }
//     });
//   };


const setJWT = (key, value) => {
    return new Promise((resolve, reject) => {
      try {
        client.set(key, value, (err, resp) => {
          if (err) {
            console.error(`Error setting Redis key ${key}:`, err);
            reject(new Error(`Error setting Redis key ${key}: ${err.message}`));
          }
          resolve(resp);
        });
      } catch (error) {
        console.error(`Error setting Redis key ${key}:`, error);
        reject(new Error(`Error setting Redis key ${key}: ${error.message}`));
      }
    });
  };
  
  const getJWT = (key) => {
    return new Promise((resolve, reject) => {
      try {
        client.get(key, (err, resp) => {
          if (err) {
            console.error(`Error getting Redis key ${key}:`, err);
            reject(new Error(`Error getting Redis key ${key}: ${err.message}`));
          }
          resolve(resp);
        });
      } catch (error) {
        console.error(`Error getting Redis key ${key}:`, error);
        reject(new Error(`Error getting Redis key ${key}: ${error.message}`));
      }
    });
  };
  
  const deleteJWT = (key) => {
    return new Promise((resolve, reject) => {
      try {
        client.del(key, (err, resp) => {
          if (err) {
            console.error(`Error deleting Redis key ${key}:`, err);
            reject(new Error(`Error deleting Redis key ${key}: ${err.message}`));
          }
          resolve(resp);
        });
      } catch (error) {
        console.error(`Error deleting Redis key ${key}:`, error);
        reject(new Error(`Error deleting Redis key ${key}: ${error.message}`));
      }
    });
  };
  

  
module.exports = {getJWT,setJWT,deleteJWT}
