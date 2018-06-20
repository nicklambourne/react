# Week One
This week we are just going to get familiar with the create-react-app setup, the api, and get started by setting up:

  - Routing
  - A signup page
  - A login page

## API
Before starting I recommend looking over the docs for the api `server/readme.md`.

## Setup
enter the client directory and run `yarn start`

In the client folder we have a project set up with [create-react-app](https://github.com/facebook/create-react-app), with one small change. It is setup with css modules.

If you are not familiar with css modules see `client/src/index.js` and `client/src/styles.module.css`.


## Challenge 1

First of we are going to setup a signup page. API details you will need are:

API: http://social.workshops.tanda.co

ENDPOINT: /users

METHOD: POST

BODY:

```js
{
  "name": "Example Name",
  "email": "test@example.com",
  "password": "hunter2"
}
```

A good goal for this will be to just create the user and log it to the console.

## Challenge 2

Try signing that user in to get an auth token

ENDPOINT: /login

METHOD: POST

BODY:

```js
{
  "email": "test@example.com",
  "password": "hunter2"
}
```

