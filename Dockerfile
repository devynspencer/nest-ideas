FROM node:12.13-alpine as development
ENV NODE_ENV=development
WORKDIR /usr/src/app
COPY package*.json .
RUN npm install glob rimraf
RUN npm install --only=development
COPY . .
RUN npm run build
