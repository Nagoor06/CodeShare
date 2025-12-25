import Share from "../models/Share.js";
import cloudinary from "../config/cloudinary.js";
import { encrypt, decrypt } from "../utils/crypto.js";
import { hashCode } from "../utils/hash.js";

/**
 * CREATE or UPDATE (UPSERT)
 * - Saves text and/or file for a given code
 * - One record per code
 */
export const createShare = async (req, res) => {
  try {
    const { code, text } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Code is required",
      });
    }

    let fileUrl;
    let fileName;
    let fileType;

    // ✅ SAFE Cloudinary upload (NO corruption)
    if (req.file) {
      fileName = req.file.originalname;
      fileType = req.file.mimetype;

      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.v2.uploader.upload_stream(
          {
            resource_type: "auto",     // 🔥 auto-detect pdf/image/etc
            use_filename: true,
            unique_filename: true,
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      fileUrl = uploadResult.secure_url;
    }

    // ✅ UPSERT (update if exists, else create)
    const saved = await Share.findOneAndUpdate(
      { codeHash: hashCode(code) },
      {
        encryptedText:
          typeof text === "string" ? encrypt(text, code) : undefined,
        fileUrl: fileUrl || undefined,
        fileName: fileName || undefined,
        fileType: fileType || undefined,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hrs
      },
      { upsert: true, new: true }
    );

    // 🔥 ALWAYS return a response
    return res.json({
      success: true,
      hasText: !!saved.encryptedText,
      hasFile: !!saved.fileUrl,
    });
  } catch (error) {
    console.error("CREATE SHARE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Save failed",
    });
  }
};

/**
 * OPEN / FETCH
 * - Loads saved text or file for the code
 * - Never throws 404 (frontend-safe)
 */
export const openShare = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Code is required",
      });
    }

    const share = await Share.findOne({
      codeHash: hashCode(code),
    });

    // ✅ No data yet → return empty but valid response
    if (!share) {
      return res.json({
        text: "",
        fileUrl: null,
        fileName: null,
        fileType: null,
      });
    }

    return res.json({
      text: share.encryptedText
        ? decrypt(share.encryptedText, code)
        : "",
      fileUrl: share.fileUrl || null,
      fileName: share.fileName || null,
      fileType: share.fileType || null,
    });
  } catch (error) {
    console.error("OPEN SHARE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Open failed",
    });
  }
};

/**
 * DELETE FILE ONLY (OPTIONAL FEATURE)
 * - Keeps text, removes file
 */
export const deleteFile = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ success: false });
    }

    await Share.findOneAndUpdate(
      { codeHash: hashCode(code) },
      {
        $unset: {
          fileUrl: "",
          fileName: "",
          fileType: "",
        },
      }
    );

    return res.json({ success: true });
  } catch (error) {
    console.error("DELETE FILE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Delete failed",
    });
  }
};
