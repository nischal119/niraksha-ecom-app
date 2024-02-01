import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoute from "./routes/authRoute.js";
import creategoryRoute from "./routes/categoryRoutes.js";
import productRoute from "./routes/porductRoute.js";
import bodyParser from "body-parser";
//dotenv config
dotenv.config();

//database connection
connectDB();

const PORT = process.env.PORT || 8080;
//rest object

const app = express();

//middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(bodyParser.json());

//routing
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/category", creategoryRoute);
app.use("/api/v1/product", productRoute);

//rest API

app.get("/", (req, res) => {
  res.send({
    message: "Hello Mom!",
  });
});

//Listen app

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`.bgCyan.white);
});
