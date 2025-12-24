import Share from "../models/Share.js";
import { encrypt, decrypt } from "../utils/crypto.js";
import { hashCode } from "../utils/hash.js";
import cloudinary from "../config/cloudinary.js";

export const createShare = async (req, res) => {
  try {
    const { code, text } = req.body;

    if (!code) return res.status(400).json({ error: "Code required" });
    if (text && text.length > 1_000_000)
      return res.status(400).json({ error: "Text too large" });

    let fileUrl = null;

    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.v2.uploader.upload_stream(
          { resource_type: "raw" },
          (err, result) => (err ? reject(err) : resolve(result))
        ).end(req.file.buffer);
      });
      fileUrl = uploadResult.secure_url;
    }

    await Share.create({
      codeHash: hashCode(code),
      encryptedText: text ? encrypt(text, code) : null,
      fileUrl,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    });

    res.json({ message: "Shared successfully" });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
};

export const openShare = async (req, res) => {
  const { code } = req.body;

  const share = await Share.findOne({ codeHash: hashCode(code) });
  if (!share) return res.status(404).json({ error: "Invalid code" });

  res.json({
    text: share.encryptedText
      ? decrypt(share.encryptedText, code)
      : null,
    fileUrl: share.fileUrl
  });
};
