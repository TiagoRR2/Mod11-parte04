import { deleteToken } from "../database/manager/AuthTokens"

export default (token) => {
  const logout = deleteToken()

  if (logout instanceof Error) {
    return new Error(logout.message)
  }

  return
}