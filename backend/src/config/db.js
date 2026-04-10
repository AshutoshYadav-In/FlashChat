const mongoose = require('mongoose');

const connectDb = async (mongoUri) => {
  if (!mongoUri) {
    throw new Error('MONGO_URI is required');
  }

  await mongoose.connect(mongoUri);
  console.log('MongoDB connected');
};

const closeDb = async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed');
};

module.exports = { connectDb, closeDb };
