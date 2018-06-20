FROM node:10-alpine

WORKDIR /usr/app
RUN apk add --update python make gcc g++

COPY package.json .
COPY yarn.lock .
RUN yarn

COPY . .
