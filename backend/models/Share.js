import mongoose from "mongoose";

const ShareSchema = new mongoose.Schema({
  codeHash: { type: String, unique: true },
  encryptedText: String,

  fileUrl: String,
  fileName: String,
  fileType: String,

  expiresAt: Date
});

export default mongoose.model("Share", ShareSchema);
