import { findUserById, listAllUsers } from "../database/manager/User";

export async function getAllUsersInfoService() {
  const usersList = await listAllUsers()

  const publicUsersInfo = userslist.map(user => {
    const {password_hash, is_admin, ...publicUser} = user
    return publicUser
  })

  return publicUsersInfo
}

export async function getUserInfoByIdService(id) {
  const user = await findUserById(id)

  if (!user) {
    return new Error("O usuário especificado não existe.")
  }

  const {password_hash, is_admin, ...publicUserInfo} = user
  
  return publicUserInfo
}