import db from "../db-init.js";

export async function listAllUsers() {
  await db.read();
  const usersList = db.data.Users
  return usersList;
}

export async function findUserByUsername(username) {
  await db.read();
  const user = db.data.Users.find((_user) => {
    return username === _user.username;
  });
  return user;
}

export async function findUserById(user_id) {
  await db.read();
  const user = db.data.Users[user_id];
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

  const userAlreadyExists = db.data.Users.find((user) => {
    if (username === user.username) {
      user.match = "username";
      return user;
    }
    if (email === user.email) {
      user.match = "email";
      return user;
    }
  });

  if (userAlreadyExists) {
    if (userAlreadyExists.match === "username") {
      return new Error("Nome de usuário já existe");
    }
    if (userAlreadyExists.match === "email") {
      return new Error("Email já cadastrado");
    }
    return new Error("Erro de cadastro. Tente novamente");
  }

  const id = db.data.Users.length;

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
