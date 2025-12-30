import mongoose from "mongoose";
import { GridFSBucket } from "mongodb";

let gfsBucket;

export const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI);

  gfsBucket = new GridFSBucket(conn.connection.db, {
    bucketName: "files",
  });

  console.log("MongoDB + GridFS connected");
};

export const getGFS = () => gfsBucket;
