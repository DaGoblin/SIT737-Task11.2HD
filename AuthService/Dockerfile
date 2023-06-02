FROM node:16  as base

WORKDIR /usr/scr/app

COPY package*.json ./

FROM base as test
RUN npm ci
COPY server.js auth.js database.js logger.js .env ./
COPY test ./test
RUN npm run test

FROM base as prod
RUN npm ci --production
COPY server.js auth.js database.js logger.js ./
EXPOSE 4000
CMD ["node", "server.js"]