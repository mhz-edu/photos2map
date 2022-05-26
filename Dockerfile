FROM node:16-alpine

WORKDIR /app

COPY package.json .

RUN npm install

COPY ./src ./src

COPY tsconfig.json .

RUN npm run build

EXPOSE 3000

CMD [ "npm", "start" ]