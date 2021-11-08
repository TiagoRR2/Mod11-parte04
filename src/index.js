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
app.use(cors())
app.use(logger("common"));
app.use(express.json());
app.use(cookieParser())

/////=====ROUTES
app.use(routes);

/////=====SERVER UP
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
