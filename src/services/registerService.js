import { createNewUser } from "../database/manager/User";
import bcrypt from "bcrypt"
const saltRounds = process.env.saltRounds || 12

export default async function registerService(newUserInfo) {

  //TODO: VALIDAR CAMPOS
  
  const password_hash = await bcrypt.hash(password, saltRounds)
  newUser.password_hash = password_hash
  
  const newUser = createNewUser(newUserInfo)

  if (newUser instanceof Error){
    return new Error(newUser.message)
  }
  
  const token = await randomBytes(64).toString('hex')

  const authenticationObj = await createAuthToken(newUser.id, token)

  return authenticationObj
} 