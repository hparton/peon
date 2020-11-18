FROM node:12.16.3

WORKDIR /code

COPY package.json /code/package.json

RUN npm install

RUN npm install -g pm2

COPY . /code

CMD [ "pm2", "start", "bot.js", "--name", "Lazy Peon"]