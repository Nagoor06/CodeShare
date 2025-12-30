import Share from "../models/Share.js";
import { encrypt, decrypt } from "../utils/crypto.js";
import { hashCode } from "../utils/hash.js";
import { getGFS } from "../config/db.js";
import mongoose from "mongoose";

/* SAVE TEXT OR FILE */
export const createShare = async (req, res) => {
  try {
    const { code, text } = req.body;
    if (!code) return res.status(400).json({ success: false });

    let fileId, fileName, fileType;

    // ✅ STORE FILE IN GRIDFS (NO CORRUPTION)
    if (req.file) {
      const gfs = getGFS();

      fileName = req.file.originalname;
      fileType = req.file.mimetype;

      const uploadStream = gfs.openUploadStream(fileName, {
        contentType: fileType,
      });

      uploadStream.end(req.file.buffer);

      await new Promise((resolve, reject) => {
        uploadStream.on("finish", resolve);
        uploadStream.on("error", reject);
      });

      fileId = uploadStream.id;
    }

    await Share.findOneAndUpdate(
      { codeHash: hashCode(code) },
      {
        encryptedText: typeof text === "string" ? encrypt(text, code) : undefined,
        fileId,
        fileName,
        fileType,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
      { upsert: true, new: true }
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};

/* OPEN METADATA */
export const openShare = async (req, res) => {
  const { code } = req.body;

  const share = await Share.findOne({ codeHash: hashCode(code) });

  if (!share) {
    return res.json({
      text: "",
      hasFile: false,
    });
  }

  res.json({
    text: share.encryptedText ? decrypt(share.encryptedText, code) : "",
    hasFile: !!share.fileId,
    fileName: share.fileName,
    fileType: share.fileType,
    fileId: share.fileId,
  });
};

/* DOWNLOAD FILE (STREAM) */
export const downloadFile = async (req, res) => {
  const { fileId } = req.params;
  const gfs = getGFS();

  const _id = new mongoose.Types.ObjectId(fileId);

  const files = await gfs.find({ _id }).toArray();
  if (!files.length) return res.sendStatus(404);

  res.set("Content-Type", files[0].contentType);
  res.set(
    "Content-Disposition",
    `attachment; filename="${files[0].filename}"`
  );

  gfs.openDownloadStream(_id).pipe(res);
};
