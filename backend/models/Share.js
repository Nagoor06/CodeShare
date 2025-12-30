import mongoose from "mongoose";

const ShareSchema = new mongoose.Schema({
  codeHash: { type: String, unique: true },

  encryptedText: String,

  fileId: mongoose.Schema.Types.ObjectId, // GridFS ID
  fileName: String,
  fileType: String,

  expiresAt: Date,
});

export default mongoose.model("Share", ShareSchema);
