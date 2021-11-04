/////=====DEPENDENCIES
import express from "express";
import logger from "morgan";
import {join, dirname} from "path";
import { fileURLToPath } from 'url'
import cookieParser from "cookie-parser";
import dotenv from "dotenv"

import routes from "./routes.js";
dotenv.config()

/////=====VARIABLES
const app = express();
const port = process.env.PORT || 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));

/////=====DATABASE
import db from "./database/db-init.js";
await db.read();
db.data ||= { Users: [], Events: [] };
await db.write();

/////=====MIDDLEWARES
app.use(logger("common"));
app.use(express.json());
app.use(cookieParser())
app.use(express.static(join(__dirname, "public")));

/////=====ROUTES
app.use(routes);

/////=====SERVER UP
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
