# LS-Chat

LS-Chat is an acronym for: *live support chat*

# technologies:
* front end: **React**
* back-end: **NodeJS, Redis, Socket.io**
* Databases: **MongoDB**, and **Redis** for caching.

# Features
* Live chat app, between admins and clients.
* Caching of the last 20 - 50 messages inside Redis for every user.
* Getting the latest messages from the RAM/Redis (faster X10).
* Old historic messages are saved into MongoDB (non-relational database), those old messages are not loaded when the user/admin starts browsing the website, just when they scroll up to get the historical/old messages.
* Create (use) many admins / support multiple webmasters.
* Know if the user is writing before sending the messages.
* Support message statuses: if "The message saved into the server", "has been reached by the user", "has been seen by the user", or "nothing yet".

# Explanations:
* New messages are saved in a Redis "double-ended queue".
* Getting the messages from the RAM makes this method faster. (RAM X10 better)
* We moved a patch of 30 oldest messages into MongoDB if the number of these messages in the RAM is bigger than 50.
* Every new message DOC has an ID pointer to the previous message DOC.
* When the user tries to get the next oldest messages (go to the top of the messages box), we know exactly the uid of the (next and previous) doc.
  => So getting the oldest messages always has O(1) time complexity.

![LS-CHAT explains](./LS-CHAT-explains.PNG)


# API's

[link of client API of LS-Chat](./api.http)

# Database diagram (MongoDB)

![database diagram of LS-Chat](./database-diagram.png)


# Screenshots:
### Clients page

![The client service](./LS-CHAT-2.png)

### Admin page

![The admin service](./LS-CHAT-1.png)


### Login page

![The login service](./LS-CHAT-3.png)


# Statuses:

![check statuses](./status.PNG)
