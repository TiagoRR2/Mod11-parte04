import express from "express";
import authenticationService from "./services/authenticationService.js";
import cookieAuthenticationMiddleware from "./middlewares/cookieAuthentication.js";
import cookieAuthorizationMiddleware from "./middlewares/cookieAuthorization.js";
import registerService from "./services/registerService.js";
import { createEventService, endEventService, getAllEventsInfoService, getEventInfoByIdService } from "./services/eventsServices.js";
import logoutService from "./services/logoutService.js";
import { getAllUsersInfoService, getUserInfoByIdService } from "./services/usersService.js";
const routes = express.Router();

//////////=====================================================================
/////===== MIDDLEWARE DE AUTENTICAÇÃO
//////////=====================================================================

routes.use(cookieAuthenticationMiddleware);

//////////=====================================================================
/////===== ROTAS QUE NÃO PRECISAM DE AUTENTICAÇÃO
//////////=====================================================================

routes.post("/login", async (req, res) => {
  if (req.authenticationInfo) {
    return res.status(200).json({ message: "Já está logado" });
  }

  const { username, password } = req.body;

  const result = await authenticationService({ username, password });

  if (result instanceof Error) {
    return res.status(400).json({ message: result.message });
  }

  res.cookie("auth", result.token);
  return res.status(200).json({ userId: result.user_id });
});

routes.post("/register", async (req, res) => {
  if (req.authenticationInfo) {
    return res.status(200).json({ message: "Já está logado" });
  }

  const result = await registerService({
    username: req.body.username,
    fullname: req.body.fullname,
    email: req.body.email,
    password: req.body.password,
    phone: req.body.phone,
    address: req.body.address,
  });

  if (result instanceof Error) {
    return res.status(400).json({ message: result.message });
  }

  res.cookie("auth", result.token);
  return res.status(200).json({ userId: result.user_id });
});

//////////=====================================================================
/////===== ROTAS QUE PRECISAM DE AUTENTICAÇÃO
//////////=====================================================================

/////===== ROTAS POST

routes.use(cookieAuthorizationMiddleware);

routes.post("/events", async (req, res) => {
  if (!req.authenticationInfo.is_admin) {
    return res.status(400).json("É necessário ser admin para criar um evento");
  }

  const result = await createEventService(
    req.authenticationInfo.user_id,
    {
      title: req.body.title,
      description: req.body.description,
      date_and_time: req.body.date_and_time,
      location: req.body.location,
      creator_id,
    }
  );

  return res.status(200).json(result)
});






routes.post("/events/:id/subscribe", async (req, res) => {});

routes.post("/checkin", async (req, res) => {
  if (!req.authenticationInfo.is_admin) {
    return res.status(400).json("Somente um admin pode acessar esse recurso");
  }
});







routes.post("/event/:id/end", async (req, res) => {
  if (!req.authenticationInfo.is_admin) {
    return res.status(400).json("É necessário ser admin para encerrar um evento");
  }

  const result = await endEventService(req.params.id)

  if (result instanceof Error) {
    return res.status(400).json({message: result.message})
  }

  return res.status(200).json(result)
})

routes.post("/logout", async (req, res) => {
  const result = await logoutService(req.authenticationInfo.token)
  
  if (result instanceof Error) {
    return res.status(400).json({message: result.message})
  }
  
  res.clearCookie("auth")
  return res.status(200).json({message: "Logout efetuado com sucesso"})
});

/////===== ROTAS GET

routes.get("/events", async (req, res) => {
  const eventsList = await getAllEventsInfoService()

  //TODO: Check for 500 error

  return res.status(200).json(eventsList)
});

routes.get("/events/:id", async (req, res) => {
  const eventId = parseInt(req.params.id)

  const result = await getEventInfoByIdService(eventId)

  if (result instanceof Error) {
    return res.status(400).json({message: result.message})
  }

  return res.status(200).json(result)  
});

routes.get("/users", async (req, res) => {
  const usersList = await getAllUsersInfoService()

  //TODO: Check for 500 error

  return res.status(200).json(usersList)
});

routes.get("/users/:id", async (req, res) => {
  const userId = parseInt(req.params.id)

  const result = await getUserInfoByIdService(userId)

  if (result instanceof Error) {
    return res.status(400).json({message: result.message})
  }

  return res.status(200).json(result)
});

routes.get("/profile", async (req, res) => {
  const userId = req.authenticationInfo.user_id
  const result = await getUserInfoByIdService(userId)

  if (result instanceof Error) {
    return res.status(400).json({message: result.message})
  }

  return res.status(200).json(result)
});




routes.get("/users/:id/subscriptions", async (req, res) => {});
routes.get("/events/:id/subscribers", async (req, res) => {});

export default routes;
