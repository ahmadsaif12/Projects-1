FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4500

CMD ["sh", "-c", "node init/index.js && node app.js"]
