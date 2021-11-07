import { createNewEvent, endEvent, findEventById, listAllEvents } from "../database/manager/Events.js";

export async function createEventService (user_id, ...newEventInfo) {

  //TODO: validate req info

  newEventInfo.creator_id = user_id

  const newEvent = await createNewEvent(newEventInfo)

  if (newEvent instanceof Error) {
    return new Error(newEvent.message)
  }

  return newEvent
}

export async function getAllEventsInfoService () {
  const eventsList = await listAllEvents()
  return eventsList
}

export async function getEventInfoByIdService (event_id) {
  const event = await findEventById(event_id)

  if (!event) {
    return new Error("O evento especificado não existe.")
  }

  return event
}

export async function endEventService(event_id) {
  const finishedEvent = await endEvent(event_id)

  if (finishedEvent instanceof Error) {
    return new Error(finishedEvent.message)
  }

  return finishedEvent
}