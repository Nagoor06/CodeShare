import mongoose from "mongoose";

const ShareSchema = new mongoose.Schema({
  codeHash: { type: String, required: true },
  encryptedText: String,
  fileUrl: String,
  createdAt: { type: Date, default: Date.now },
  expiresAt: Date
});

export default mongoose.model("Share", ShareSchema);
