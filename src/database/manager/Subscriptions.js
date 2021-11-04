import db from "../db-init.js";

export async function subscribeUserToEvent(user_id, event_id) {
  await db.read();
  const event = db.data.Events[event_id];
  const user = db.data.Users[user_id];

  const userAlreadySubscribed = user.user_subscriptions.find((subscription) => {
    return event_id === subscription.event_id;
  });

  if (userAlreadySubscribed) {
    return new Error("Usuário já inscrito nesse evento");
  }

  const subscription = {
    event_id,
    checked_in: false,
  };

  const subscriber = user_id;

  event.subscribers.push(subscriber);
  user.user_subscriptions.push(subscription);

  await db.write();
  return event;
}

export async function userCheckIn(user_id, event_id) {
  await db.read();
  const user = db.data.Users[user_id];

  const validToken = user.user_subscriptions.find((subscription) => {
    return event_id === subscription.event_id;
  });

  if (!validToken) {
    return new Error("QR Code inválido");
  }

  if (validToken.checked_in) {
    return new Error("Usuário já fez check-in");
  }

  validToken.checked_in = true;

  return user;
}
