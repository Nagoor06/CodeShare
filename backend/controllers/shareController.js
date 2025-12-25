import Share from "../models/Share.js";
import { encrypt, decrypt } from "../utils/crypto.js";
import { hashCode } from "../utils/hash.js";
import cloudinary from "../config/cloudinary.js";

/* SAVE / UPDATE */
export const createShare = async (req, res) => {
  try {
    const { code, text } = req.body;

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

    const saved = await Share.findOneAndUpdate(
      { codeHash: hashCode(code) },
      {
        encryptedText: text ? encrypt(text, code) : undefined,
        fileUrl: fileUrl || undefined,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
      { upsert: true, new: true }
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Save failed" });
  }
};

/* OPEN / FETCH */
export const openShare = async (req, res) => {
  const { code } = req.body;

  const share = await Share.findOne({ codeHash: hashCode(code) });

  if (!share) {
    return res.json({ text: "", fileUrl: null });
  }

  res.json({
    text: share.encryptedText
      ? decrypt(share.encryptedText, code)
      : "",
    fileUrl: share.fileUrl || null,
  });
};
