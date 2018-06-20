# Tanda Social Server

> An API for Tanda's first social network

## Overview

Everyone is friends with everyone. You can create an account, log in, and post.
Posts can be replied to, as well, and users can be looked up to see post
history.

## Overview

Standard REST API, for the most part. Start by [creating a user](#user-create)
and then logging in to get a token. All responses are JSON. GET requests take no
params unless specified.

### Auth

Bearer token auth. Post to [login](#login) to get a token.
Attach the following header to all requests, where `<token>` is the user's
token.

```
Authorization: bearer <token>
```

### Posts

- Posts don't have any limits on comment depth
- Deleting a post just removes the user's association from it - you should
  handle the case where `userId` is `null`.
- The title can't be longer than 255 characters
- The body is plaintext only

## Endpoints

### User Get All

Method: `GET`
URL: `/users`
Response: Array of User

```js
[{
  "id": 1,
  "name": "Example Name",
  "email": "test@example.com",
  "posts": [{
    "id": 1,
    "title": "autem cupiditate doloribus",
    "body": "Ratione alias voluptas est ex architecto libero dolores quaerat tempore.",
    "userId": 1,
    "parentId": null, // this is a root-level post
    "createdAt": "2018-06-20T01:10:31.617Z",
    "updatedAt": "2018-06-20T01:10:31.619Z"
  }],
  "replies": [{
    "id": 2,
    "title": "unde eligendi non",
    "body": "Ad nobis voluptatem.\nPerferendis iste velit libero eum sequi dignissimos.",
    "userId": 1,
    "parentId": 1, // this is a reply
    "createdAt": "2018-06-20T01:10:31.617Z",
    "updatedAt": "2018-06-20T01:10:31.619Z"
  }]
}]
```

### User Get

Method: `GET`
URL: `/users/:id`

Response: User

```js
{
  "id": 1,
  "name": "Example Name",
  "email": "test@example.com",
  "posts": [{
    "id": 1,
    "title": "autem cupiditate doloribus",
    "body": "Ratione alias voluptas est ex architecto libero dolores quaerat tempore.",
    "userId": 1,
    "parentId": null, // this is a root-level post
    "createdAt": "2018-06-20T01:10:31.617Z",
    "updatedAt": "2018-06-20T01:10:31.619Z"
  }],
  "replies": [{
    "id": 2,
    "title": "unde eligendi non",
    "body": "Ad nobis voluptatem.\nPerferendis iste velit libero eum sequi dignissimos.",
    "userId": 1,
    "parentId": 1, // this is a reply
    "createdAt": "2018-06-20T01:10:31.617Z",
    "updatedAt": "2018-06-20T01:10:31.619Z"
  }]
}
```

### User Create

Method: `POST`
URL: `/users`
Body:

```js
{
  "name": "Example Name",
  "email": "test@example.com",
  "password": "hunter2"
}
```

Reponse:

```js
{
  "id": 1,
  "name": "Example Name",
  "email": "test@example.com",
  "posts": [],
  "replies": []
}
```

### Login

Method: `POST`
URL: `/login`
Body:

```js
{
  "email": "test@example.com",
  "password": "hunter2"
}
```

Response:

```js
{
  "id": 1,
  "name": "Example Name",
  "email": "test@example.com",
  "posts": [],
  "replies": [],
  // this is the difference for the login response
  token: "<token here>"
}
```

### Post Get All

Method: `GET`
URL: `/posts`
Params:
  - `page` (default: 1) - the page to retrieve (25 records per page)
Note: Only returns top-level posts - no replies

Response:

```js
[{
  "items": {
    "id": 1,
    "title": "autem cupiditate doloribus",
    "body": "Ratione alias voluptas est ex architecto libero dolores quaerat tempore.",
    "userId": 1,
    "parentId": null,
    "replyCount": 12, // how many replies are attached to *this* post
    "createdAt": "2018-06-20T01:10:31.617Z",
    "updatedAt": "2018-06-20T01:10:31.619Z"
  },
  "page": 1,
  "count": 1, // how many posts are there in total
  "next": false // is there another page after this one
}]
```

### Post Get

Method: `GET`
URL: `/posts/:id`
Note: To get comments for children, keep traversing into the replies until there
are none with a reply count > 0.

Response:

```js
{
  "id": 149,
  "title": "rem sed est",
  "body": "Dolor itaque consequatur.\nEst est nam sunt et ad accusamus rerum nihil.\nIpsa sint aliquam voluptates atus.\nDicta esse facere tempora velit quia.",
  "createdAt": "2018-06-20T01:10:31.617Z",
  "updatedAt": "2018-06-20T01:10:31.619Z",
  "userId": 12,
  "parentId": null,
  "replies": [{
    "id": 181,
    "title": "maxime ipsum iste",
    "body": "Autem ipsam est. Voluptatem eos laudantium quos",
    "createdAt": "2018-06-20T01:10:32.107Z",
    "updatedAt": "2018-06-20T01:10:32.110Z",
    "userId": 14,
    "parentId": 149,
    "replyCount": 1
  }, {
    "id": 239,
    "title": "voluptas dolores non",
    "body": "Consectetur explicabo corrupti consequatur blanditiis consequatur inventore sed eum iste. Tenetur placeat eritatis enim.",
    "createdAt": "2018-06-20T01:10:32.992Z",
    "updatedAt": "2018-06-20T01:10:32.995Z",
    "userId": 6,
    "parentId": 149,
    "replyCount": 1
  }]
}
```

### Post Update

Method: `PUT`
URL: `/posts/:id`
Note: All fields in body are optional
Note: There are no update records - you can't tell if a post has been edited, as
there is some DB latency between `createdAt` and `updatedAt`.
Note: You cannot change which post a reply is to

Body:

```js
{
  "title": "a new title",
  "body": "a new body"
}
```

Reponse:

```js
{
  "id": 149,
  "title": "a new title",
  "body": "a new body",
  "createdAt": "2018-06-20T01:10:31.617Z",
  "updatedAt": "2018-06-20T01:13:31.619Z",
  "userId": 12,
  "parentId": null,
  "replyCount": 2
}
```

### Post Delete

Method: `DELETE`
URL: `/posts/:id`

Response:

204 (No Content)
