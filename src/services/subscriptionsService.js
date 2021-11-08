import { listEventSubscribers, listUserSubscriptions, subscribeUserToEvent } from "../database/manager/Subscriptions.js";
import {randomBytes} from "crypto"

export async function subscribeService(user_id, event_id) {

  const token = await randomBytes(64).toString('hex')

  const subscription = await subscribeUserToEvent({user_id, event_id, token})

  if (subscription instanceof Error) {
    return new Error(subscription.message)
  }

  return token
}

export async function listUserSubscriptionsService(user_id) {

  const subscriptionsList = await listUserSubscriptions(user_id)

  return subscriptionsList
}

export async function listEventSubscribersService(event_id) {

  const subscribersList = await listEventSubscribers(event_id)

  const publicSubscribersList = subscribersList.map( subscriber => {
    const {password_hash, ...publicSubscriberInfo} = subscriber
    return publicSubscriberInfo
  })

  return publicSubscribersList
}