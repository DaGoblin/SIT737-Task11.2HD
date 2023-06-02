FROM node:16

WORKDIR /usr/scr/app

COPY package*.json ./

RUN npm install

COPY server.js routes.js ./
COPY public ./public

EXPOSE 4000
CMD ["node", "server.js"]