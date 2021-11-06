# Mod11-parte04-back-end -MOCKUP-

para instalar os pacotes 
```
npm install
```

para iniciar o servidor 
```
npm start
```

## Rotas incompletas

As rotas: 
* app.post("/**events/:id/subscribe**", (req, res) => {});
* app.post("**/checkin**", (req, res) => {});
* app.get("**/events/:id/subscribers**", async (req, res) => {});
* app.get("**/users/:id/subscriptions**", async (req, res) => {});

ainda não estão finalizadas.

## Requisitos de rotas

| ***app.post("/login"...*** |
|---|
| requer {"username": "admin", "password": "admin"} |

| ***app.post("/register"...*** |
|---|
| requer {"username": "string", "password": "string", "fullname": "string", "phone": "string", "email": "string", "address": "string"} |

| ***app.post("/events"...*** |
|---|
| requer {"title": "string", "description": "string", "date": "string"} |
| a data tem que estar em um formato que pode ser colocado no `new Date(data)` |
| tem que ser admin para criar evento|

| ***app.post("/logout"...*** |
|---|
| só precisa estar logado (ter um cookie) |

| ***app.get("/events"...*** |
|---|
| devolve todos os eventos em json |

| ***app.get("/events/:id"...*** |
|---|
| devolve o evento com id específico |

| ***app.get("/users"...*** |
|---|
| devolve todas as informações públicas dos usuários em json (ou seja, não mostra password_hash e is_admin) |

| ***app.get("/users/:id"...*** |
|---|
| devolve todas as informações públicas do usuários com id específico (ou seja, não mostra password_hash e is_admin) |

| ***app.get("/profile"...*** |
|---|
| devolve as informações do usuário que está logado (exceto password_hash) |
