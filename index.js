import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.routes.js";
import authRouter from "./routes/auth.route.js";
import projectRouter from "./routes/project.route.js";
import productRouter from "./routes/product.route.js";
import itemRouter from "./routes/item.route.js";
import receivingRouter from "./routes/receiving.route.js";
import issuenceRouter from "./routes/issuance.route.js";
import historyRouter from "./routes/history.route.js";
import cookieParser from "cookie-parser";
import departmentRouter from "./routes/department.route.js";
import subprojectRouter from "./routes/subproject.route.js";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(__dirname);

dotenv.config();

mongoose
  .connect(process.env.DB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(express.static(path.join(__dirname, '/client/dist')));
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, 'client/dist/index.html'))
);
// Define API routes
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/product", productRouter);
app.use("/api/project", projectRouter);
app.use("/api/item", itemRouter);
app.use("/api/receive", receivingRouter);
app.use("/api/issuance", issuenceRouter);
app.use("/api/history", historyRouter);
app.use("/api/department", departmentRouter);
app.use("/api/subproject", subprojectRouter);

// Test route for dogs (GET request example)
app.get("/api/dogs", (req, res) => {
  const dogNames = [
    "Buddy",
    "Max",
    "Charlie",
    "Bella",
    "Lucy",
    "Molly",
    "Daisy",
    "Rocky",
  ];

  res.status(200).json({
    success: true,
    dogs: dogNames,
  });
});

app.use((req, res, next) => {
  console.log(req.body); // Log incoming request body
  next();
});

// Global error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// Start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});