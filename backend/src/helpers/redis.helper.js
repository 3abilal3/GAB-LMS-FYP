 const mongoose = require('mongoose');

// Replace the values below with your MongoDB Atlas cluster information
const DB_USERNAME = 'your-username';
const DB_PASSWORD = 'your-password';
const DB_CLUSTER = 'your-cluster-name';
const DB_NAME = 'your-database-name';

// Connect to the MongoDB Atlas cluster
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB Atlas');
}).catch((err) => {
  console.error('Error connecting to MongoDB Atlas:', err.message);
});

// Create a schema for storing JWTs
const jwtSchema = new mongoose.Schema({
  key: String,
  value: String,
});

// Create a JWT model based on the schema
const JWT = mongoose.model('JWT', jwtSchema);

// Define functions for interacting with the JWTs collection
const setJWT = (key, value) => {
  return JWT.findOneAndUpdate({ key }, { value }, { upsert: true, new: true });
};

const getJWT = (key) => {
  return JWT.findOne({ key }).exec();
};

const deleteJWT = (key) => {
  return JWT.deleteOne({ key }).exec();
};

module.exports = { getJWT, setJWT, deleteJWT };
