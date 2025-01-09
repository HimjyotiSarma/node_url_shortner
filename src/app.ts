import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Import and Use API Routers
import UrlRouter from "./routes/url.routes";

app.use("/url", UrlRouter);

// Finally Export the app, once the MiddleWares and Routers are setup

export default app;
