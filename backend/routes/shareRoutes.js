import express from "express";
import multer from "multer";
import { createShare, openShare } from "../controllers/shareController.js";

const router = express.Router();

const upload = multer({ limits: { fileSize: 5 * 1024 * 1024 } });
router.post("/", upload.single("file"), createShare);

router.post("/open", openShare);

export default router;
