import { userCheckIn } from "../database/manager/Subscriptions.js"

export default async function checkInService (user_id, token) {

  const userCheckedIn = await userCheckIn(user_id, token)
  if (userCheckedIn instanceof Error) {
    return new Error(userCheckedIn.message)
  }

  return userCheckedIn
}
