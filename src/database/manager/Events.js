import db from "../db-init.js";

export async function listAllEvents() {
  await db.read()
  const eventsList = db.data.Events
  await db.write()
  return eventsList
}

export async function findEventByTitle(title) {
  await db.read();
  const event = db.data.Events.find((_event) => {
    return title === _event.title;
  });
  await db.write();
  return event;
}

export async function findEventById(event_id) {
  await db.read();
  const event = db.data.Events[event_id];
  await db.write();
  return event;
}

export async function createNewEvent({
  title,
  description,
  date,
  time,
  creator_id,
}) {
  await db.read();
  const id = db.data.Events.length();

  const event = {
    id,
    title,
    description,
    date,
    time,
    created_by: creator_id,
    is_active: true,
    subcribers: [],
  };

  db.data.Events.push(event);
  await db.write();
  return event;
}

export async function listEventSubscribers(event_id) {
  await db.read();
  const event = db.data.Events[event_id];
  const subscribersList = event.subscribers.map(
    (subscriber_id) => db.data.Users[subscriber_id]
  );
  await db.write();
  return subscribersList;
}

export async function endEvent(event_id) {
  await db.read();
  const event = db.data.Events[event_id];
  event.is_active = false;
  await db.write();
  return event;
}
