import db from "../db-init.js";

export async function listAllUsers() {
  await db.read();
  const usersList = db.data.Users.map((user) => {
    return {
      id: user.id,
      username: user.username,
      fullname: user.fullname,
      email: user.email,
      phone: user.phone,
      address: user.address,
      user_subscriptions: user.user_subscriptions,
    };
  });
  await db.write();
  return usersList;
}

export async function findUserByUsername(username) {
  await db.read();
  const user = db.data.Users.find((_user) => {
    return username === _user.username;
  });
  await db.write();
  return user;
}

export async function findUserById(user_id) {
  await db.read();
  const user = db.data.Users[user_id];
  await db.write();
  return user;
}

export async function createNewUser({
  username,
  fullname,
  password_hash,
  email,
  phone,
  address,
}) {
  await db.read();

  let userAlreadyExists = db.data.Users((user) => {
    return username === user.username;
  });

  if (userAlreadyExists) {
    return new Error("Nome de usuário já existe");
  }

  userAlreadyExists = db.data.Users((user) => {
    return username === user.username;
  });

  if (userAlreadyExists) {
    return new Error("Email já cadastrado");
  }

  const id = db.data.Users.length();

  const user = {
    id,
    username,
    password_hash,
    fullname,
    email,
    phone,
    address,
    is_admin: false,
    user_subscriptions: [],
  };

  db.data.Users.push(user);
  await db.write();
  return user;
}

export async function listUserEvents(user_id) {
  await db.read();
  const user = db.data.Users[user_id];
  const eventsList = user.user_subscriptions.map(
    (subscription) => db.data.Events[subscription.event_id]
  );
  await db.write();
  return eventsList;
}
