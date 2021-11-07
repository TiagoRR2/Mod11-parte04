import db from "../db-init.js";

export async function subscribeUserToEvent(user_id, event_id, token) {
  await db.read();
  const event = db.data.Events[event_id];
  const user = db.data.Users[user_id];

  const userAlreadySubscribed = user.user_subscriptions.find((subscription) => {
    return event_id === subscription.event_id;
  });

  if (userAlreadySubscribed) {
    return new Error("Usuário já inscrito nesse evento");
  }

  ///// no Objeto DB de Users vai ficar armazenado um array de objetos de subscriptions
  const subscription = {
    event_id,
    checked_in: false,
    token,
  };

  ///// no Objeto DB de Events vai ficar armazenado um array de números de id de subscribers
  const subscriber = user_id;
  event.subscribers.push(subscriber);
  
  user.user_subscriptions.push(subscription);
  await db.write();

  return event;
}

export async function userCheckIn(user_id, token) {
  await db.read();
  const user = db.data.Users[user_id];

  const validToken = user.user_subscriptions.find((subscription) => {
    return token === subscription.token;
  });

  if (!validToken) {
    return new Error("Token de checkin inválido");
  }

  if (validToken.checked_in) {
    return new Error("Usuário já fez check-in");
  }

  validToken.checked_in = true;

  return user;
}


export async function listUserSubscriptions (user_id) {
  await db.read();
  const user = db.data.Users[user_id];
  const eventsList = user.user_subscriptions.map(
    (subscription) => db.data.Events[subscription.event_id]
  );
  return eventsList;
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
