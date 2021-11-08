import { createNewUser } from "../database/manager/User.js";
import {randomBytes} from "crypto"
import bcrypt from "bcrypt"
import { createAuthToken } from "../database/manager/AuthTokens.js";

const saltRounds = process.env.saltRounds || 12

export default async function registerService(newUserInfo) {

  //TODO: VALIDAR CAMPOS
  const password_hash = await bcrypt.hash(newUserInfo.password, saltRounds)
  newUserInfo.password_hash = password_hash
  
  const newUser = await createNewUser(newUserInfo)

  if (newUser instanceof Error){
    return new Error(newUser.message)
  }
  
  const token = await randomBytes(64).toString('hex')

  const authenticationObj = await createAuthToken(newUser.id, token)

  return authenticationObj
} 