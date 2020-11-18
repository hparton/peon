FROM node:12.16.3

WORKDIR /bot

COPY . /bot

RUN npm ci

# Listen on the specified port
EXPOSE 5000

# Set Node server
ENTRYPOINT npm run start
