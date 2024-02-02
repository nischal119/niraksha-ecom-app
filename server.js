import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoute from "./routes/authRoute.js";
import creategoryRoute from "./routes/categoryRoutes.js";
import productRoute from "./routes/porductRoute.js";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
//dotenv config
dotenv.config();

//database connection
connectDB();

const PORT = process.env.PORT || 8080;
//rest object

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "./client/dist")));

//routing
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/category", creategoryRoute);
app.use("/api/v1/product", productRoute);

//rest API

app.use("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./client/dist/index.html"));
});
//Listen app

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`.bgCyan.white);
});
