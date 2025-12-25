import Share from "../models/Share.js";
import { encrypt, decrypt } from "../utils/crypto.js";
import { hashCode } from "../utils/hash.js";
import cloudinary from "../config/cloudinary.js";

export const createShare = async (req, res) => {
  try {
    const { code, text } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, message: "Code missing" });
    }

    let fileUrl = undefined;

    // SAFE Cloudinary uploadn
    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.v2.uploader.upload_stream(
          { resource_type: "raw" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      fileUrl = uploadResult.secure_url;
    }

    const updated = await Share.findOneAndUpdate(
      { codeHash: hashCode(code) },
      {
        encryptedText: text !== undefined ? encrypt(text, code) : undefined,
        fileUrl: fileUrl !== undefined ? fileUrl : undefined,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
      { upsert: true, new: true }
    );

    // 🔥 THIS RESPONSE IS CRITICAL
    return res.json({
      success: true,
      hasText: !!updated.encryptedText,
      hasFile: !!updated.fileUrl,
    });
  } catch (err) {
    console.error("SAVE ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Save failed",
    });
  }
};