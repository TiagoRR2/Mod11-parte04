import {randomBytes} from "crypto"
import { userCheckIn } from "../database/manager/Subscriptions.js"

export default async function checkInService (user_id) {

  const token = await randomBytes(64).toString('hex')

  const userCkeckedIn = await userCheckIn(user_id, token)

  if (userCkeckedIn instanceof Error) {
    return new Error(userCkeckedIn.message)
  }

  return userCheckIn
}