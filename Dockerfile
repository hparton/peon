FROM node:12.16.3

WORKDIR /bot

COPY . /bot

RUN npm i

# Listen on the specified port
EXPOSE 5000

# Set Node server
CMD ["npm", "start"]
