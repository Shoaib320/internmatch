const mongoose = require("mongoose");

async function connectDatabase() {
  const { MONGODB_URI, MONGODB_DB_NAME } = process.env;

  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is missing. Add it in server/.env");
  }

  console.log("Connecting to MongoDB...");

  await mongoose.connect(MONGODB_URI, {
    dbName: MONGODB_DB_NAME || "internmatch",
    serverSelectionTimeoutMS: 10000,
  });
  console.log("MongoDB connected");
}

module.exports = connectDatabase;
