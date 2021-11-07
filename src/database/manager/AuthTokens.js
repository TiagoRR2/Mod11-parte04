import db from "../db-init.js";

export async function createAuthToken(user_id, token) {
  await db.read()
  
  const user = db.data.Users[user_id]

  const authObj = {
    user_id: user_id,
    is_admin: user.is_admin,
    token: token
  }

  db.AuthTokens.push(authObj)
  await db.write()

  return authObj
}

export async function findToken(token) {
  await db.read()

  const tokenObj = db.data.AuthTokens.find(_tokenObj => {
    return token === _tokenObj.token
  })

  return tokenObj
}

export async function deleteToken(token) {
  await db.read()

  const tokenObjIndex = db.data.AuthTokens.findIndex(_tokenObj => {
    return token === _tokenObj.token
  })

  if (!tokenObj) {
    return new Error("Token de autenticação inválido")
  }

  db.data.AuthTokens.splice(tokenObjIndex, 1)
  await db.write()

  return
}