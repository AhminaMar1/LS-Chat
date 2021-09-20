# LS-Chat

LS-Chat it's acronym for: the live support chat


* In the front-end we are using the **React**
* And in the back-end we are using the **nodeJs, Redis, Socket.io**
* Databases: the **MongoDB**, and the **Redis** for the caching.

# Features
* Live chat between admins and clients.
* We are using the redis for caching the session, the new message before complete it numbers 20msg, online users for the best practice (The fastest of the app)
* Create (use) many of admins.
* Find out who writes before his sent the first message.

# all client API

[link of client API of LS-Chat](./api.http)

# Database diagram (MongoDB)

![database diagram of LS-Chat](./database-diagram.png)


# Status of check of messages

![Status of check of messages](./Status-of-check-message.png)

# photos

### The admin service

![The admin service](./LS-CHAT-1.png)

### The client service

![The client service](./LS-CHAT-2.png)

### The login service

![The login service](./LS-CHAT-3.png)

### When we visit the admin from a phone

![When we visit the admin from a phone](./LS-CHAT-4.png)
