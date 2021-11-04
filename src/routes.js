import express from "express"
import authenticationService from "./services/authenticationService.js"
const routes = express.Router()

const tokensList = []

//////////=====================================================================
/////===== ROTAS QUE NÃO PRECISAM DE AUTENTICAÇÃO
//////////=====================================================================

routes.post("/login", async (req, res) => {
  const {username, password} = req.body

  const result = await authenticationService({username, password})

  if (result instanceof Error) {
    return res.status(400).json(result.message)
  }

  tokensList.push(result)

  res.cookie("auth", result.token, {expires: new Date(Date.now() + 900000)})
  return res.json(result.token)
})

routes.post("/register", (req, res) => {
})

//////////=====================================================================
/////===== ROTAS QUE PRECISAM DE AUTENTICAÇÃO
//////////=====================================================================
/////===== ROTAS POST

routes.post("/events", (req, res) => {
})

routes.post("/events/:id/subscribe", (req, res) => {
})

routes.post("/checkin", (req, res) => {
})

routes.post("/logout", (req, res) => {
})

/////===== ROTAS GET

routes.get("/events", (req, res) => {
})

routes.get("/events/:id", (req, res) => {
})

routes.get("/events/:id/subscribers", (req, res) => {
})

routes.get("/users", (req, res) => {
})

routes.get("/users/:id", (req, res) => {
})

routes.get("/users/:id/subscriptions", (req, res) => {
})

export default routes