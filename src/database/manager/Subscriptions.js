import db from "../db-init.js";

export async function subscribeUserToEvent({user_id, event_id, token}) {
  await db.read();
  const event = db.data.Events[event_id];
  const user = db.data.Users[user_id];
  if(!event) {
    return new Error("O evento em que você está tentando se inscrever não existe")
  }

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

  if(user == undefined || !user.user_subscriptions){
    return new Error("Token de checkin inválido")
  }

  const checkTokenIndex = user.user_subscriptions.findIndex((subscription) => {
    return token === subscription.token;
  });
  if (checkTokenIndex == -1) {
    return new Error("Token de checkin inválido");
  }
  
  const subscription = user.user_subscriptions[checkTokenIndex]
  
  if (subscription.checked_in) {
    return new Error(`Usuário ${user.username} já fez check-in no evento ${db.data.Events[subscription.event_id].title}`);
  }

  subscription.checked_in = true;

  db.write()
  return subscription;
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
  return subscribersList;
}
