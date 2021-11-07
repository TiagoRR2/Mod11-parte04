import { deleteToken } from "../database/manager/AuthTokens.js"

export default (token) => {
  const logout = deleteToken()

  if (logout instanceof Error) {
    return new Error(logout.message)
  }

  return
}