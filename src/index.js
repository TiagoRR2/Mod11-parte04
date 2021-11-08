/////=====DEPENDENCIES
import express from "express";
import logger from "morgan";
import cookieParser from "cookie-parser";
import dotenv from "dotenv"
import cors from "cors"

import routes from "./routes.js";
dotenv.config()

/////=====VARIABLES
const app = express();
const port = process.env.PORT || 3000;

/////=====DATABASE
import db from "./database/db-init.js";
await db.read();
db.data ||= { Users: [], Events: [], AuthTokens: [] };
// db.data.AuthTokens = []
await db.write();

/////=====MIDDLEWARES
app.use(cors({
  origin: "http://localhost:5000",
  allowedHeaders: true,
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(logger("common"));
app.use(express.json());
app.use(cookieParser())
app.use((req, res, next) => {console.log(req.body); next()})

/////=====ROUTES
app.use(routes);

/////=====SERVER UP
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
