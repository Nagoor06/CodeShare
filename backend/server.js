import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import shareRoutes from "./routes/shareRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.use("/api/share", shareRoutes);

app.listen(process.env.PORT || 5000, () =>
  console.log("Backend running")
);
