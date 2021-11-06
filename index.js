import express from "express";
import cookieParser from "cookie-parser";
import { join, dirname } from "path";
import { Low, JSONFile } from "lowdb";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { readFile } from "fs/promises";

const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, "db.json");
const dbBackup = JSON.parse(
  await readFile(join(__dirname, "./db-backup.json"))
);

const adapter = new JSONFile(file);
const db = new Low(adapter);
const app = express();

await db.read();
db.data ||= dbBackup;
await db.write();

const tokensList = [];

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}))

//////////=====================================================================
/////===== MIDDLEWARE DE AUTENTICAÇÃO
//////////=====================================================================
app.use((req, res, next) => {
  if (req.cookies.auth) {
    const tokenInfo = tokensList.find((tokenObj) => {
      return tokenObj.authToken === req.cookies.auth;
    });
    if (tokenInfo) {
      req.authenticationInfo = tokenInfo;
      return next();
    }
  }
  req.authenticationInfo = null;
  next();
});

//////////=====================================================================
/////===== ROTAS QUE NÃO PRECISAM DE AUTENTICAÇÃO
//////////=====================================================================

app.post("/login", async (req, res) => {
  if (req.authenticationInfo) {
    res.cookie("auth", req.authenticationInfo.authToken);
    return res.status(200).json("Já está logado");
  }

  const { username, password } = req.body;
  await db.read();
  const user = db.data.Users.find((_user) => {
    return username === _user.username;
  });

  if (!user) {
    return res.status(400).json("Usuário e/ou senha incorretos (usuário)");
  }

  const passcheck = await bcrypt.compare(password, user.password_hash);

  if (!passcheck) {
    return res.status(400).json("Usuário e/ou senha incorretos (senha)");
  }

  const token = crypto.randomBytes(64).toString("hex");
  const tokenObj = {
    authToken: token,
    user_id: user.id,
    is_admin: user.is_admin,
  };

  tokensList.push(tokenObj);

  res.cookie("auth", token);
  return res.status(200).json("ok");
});

app.post("/register", async (req, res) => {
  if (req.authenticationInfo) {
    res.cookie("auth", req.authenticationInfo.authToken);
    return res.status(200).json("Já está logado");
  }

  await db.read();

  const id = db.data.Users.length

  const userExists = db.data.Users.find(user => {
    if (req.body.username === user.username) {
      user.match = "username"
      return user
    }
    if (req.body.email ===user.email) {
      user.match = "email"
      return user
    }
  })
  if (userExists) {
    if (userExists.match === "username") {
      return res.status(400).json("Nome de usuário já existe")      
    }
    if (userExists.match === "email") {
      return res.status(400).json("Esse email já está sendo usado")
    }
    return res.status(500).json("Erro de cadastro. Tente novamente")
  }

  const password_hash = await bcrypt.hash(req.body.password, 12)

  const newUser = {
    id: id,
    username: req.body.username,
    password_hash: password_hash,
    fullname: req.body.fullname,
    email: req.body.email,
    phone: req.body.phone,
    address: req.body.address,
    is_admin: false,
    user_subscriptions: []
  }

  db.data.Users.push(newUser)
  await db.write()
  
  const publicUser = {
    id: newUser.id,
    username: newUser.username,
    fullname: newUser.fullname,
    email: newUser.email,
    phone: newUser.phone,
    address: newUser.address
  }

  const token = crypto.randomBytes(64).toString("hex");
  const tokenObj = {
    authToken: token,
    user_id: user.id,
    is_admin: user.is_admin,
  };

  tokensList.push(tokenObj);

  res.cookie("auth", token);
  return res.status(200).json(publicUser)
});

//////////=====================================================================
/////===== ROTAS QUE PRECISAM DE AUTENTICAÇÃO
//////////=====================================================================
/////===== ROTAS POST

// app.use((req, res, next) => {
//   if (!req.authenticationInfo) {
//     return res.status(400).json("Usuário não está logado");
//   }
//   next()
// })

app.post("/events", async (req, res) => {
  await db.read()

  const id = db.data.Events.length

  const validDateAndTime = new Date(req.body.dateAndTime)
  if (validDateAndTime == "Invalid Date" || validDateAndTime < new Date.now()) {
      return res.status(400).json(`A data e hora não podem ser no passado. Data e hora devem estar no formato ISO 8601: "YYYY-MM-DDTHH:MM:SS" (horário de Brasília).`)
  }

  const newEvent = {
    id: id,
    title: req.body.title,
    description: req.body.description,
    date_and_time: req.body.date,
    created_by: req.authenticationInfo.user_id,
    is_active: true,
    subscribers: []
  }

  db.data.Events.push(newEvent)
  await db.write()

  return res.status(200).json(newEvent)
});





app.post("/events/:id/subscribe", (req, res) => {});

app.post("/checkin", (req, res) => {});






app.post("/logout", (req, res) => {
  const userId = req.authenticationInfo.user_id

  const tokenInfo = tokensList.findIndex(tokenObj => {
    return tokenObj.user_id === userId
  })
  
  res.clearCookie("auth", req.authenticationInfo.authToken)
  return res.status(200).json("Logout ok")
});

/////===== ROTAS GET

app.get("/events", async (req, res) => {
  await db.read()

  res.status(200).json(db.data.Events)
});

app.get("/events/:id", async(req, res) => {
  await db.read()
  const event = db.data.Events[req.params.id]
  if (!event) {
    return res.status(400).json("Esse evento não existe")
  }

  res.status(200).json(event)
});

app.get("/users", async (req, res) => {
  await db.read

  const userslist = db.data.Users

  const publicUsersInfo = userslist.map(user => {
    const {password_hash, is_admin, ...publicUser} = user
    return publicUser
  })

  return res.status(200).json(publicUsersInfo)
});

app.get("/users/:id", async (req, res) => {
  await db.read
  
  const user = db.data.Users[req.params.id]
  if (!user) {
    return res.status(400).json("Usuário não existe")
  }
  const {password_hash, is_admin, ...publicUserInfo} = user
  
  return res.status(200).json(publicUserInfo)
});

app.get("/profile", async (req, res) => {
  await db.read
  
  const user = db.data.Users[req.authenticationInfo.user_id]
  const publicUsersInfo = userslist.map(user => {
    const {password_hash, is_admin, ...publicUser} = user
    return publicUser
  })
  
  return res.status(200).json(publicUserInfo)
})

app.get("/events/:id/subscribers", async (req, res) => {});
app.get("/users/:id/subscriptions", async (req, res) => {});

app.listen(3000, () => console.log("server up"));
