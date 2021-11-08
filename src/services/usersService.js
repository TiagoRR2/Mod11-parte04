import { findUserById, listAllUsers } from "../database/manager/User.js";

export async function getAllUsersInfoService() {
  const usersList = await listAllUsers()

  const publicUsersInfo = usersList.map(user => {
    const {password_hash, ...publicUser} = user
    return publicUser
  })

  return publicUsersInfo
}

export async function getUserInfoByIdService(id) {
  const user = await findUserById(id)

  if (!user) {
    return new Error("O usuário especificado não existe.")
  }

  const {password_hash, ...publicUserInfo} = user
  
  return publicUserInfo
}