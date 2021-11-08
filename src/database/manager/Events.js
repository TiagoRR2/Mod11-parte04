import db from "../db-init.js";

export async function listAllEvents() {
  await db.read()
  const eventsList = db.data.Events
  return eventsList
}

export async function findEventByTitle(title) {
  await db.read();
  const event = db.data.Events.find((_event) => {
    return title === _event.title;
  });
  return event;
}

export async function findEventById(event_id) {
  await db.read();
  const event = db.data.Events[event_id];
  return event;
}

export async function createNewEvent(
  title,
  description,
  date_and_time,
  location,
  creator_id,
) {
  await db.read();
  const id = db.data.Events.length;

  const event = {
    id,
    title: title,
    description: description,
    date_and_time: date_and_time,
    location: location,
    created_by: creator_id,
    is_active: true,
    subscribers: [],
  };

  db.data.Events.push(event);
  await db.write();
  return event;
}

export async function endEvent(event_id) {
  await db.read();
  const event = db.data.Events[event_id];
  if (!event){
    return new Error("O evento especificado não existe.")
  }
  if (event.is_active === false) {
    return new Error("Esse evento já foi encerrado.")
  }
  event.is_active = false;
  await db.write();
  return event;
}
