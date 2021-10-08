# Specify a base image
FROM node:alpine

WORKDIR /app

COPY package.json ./

# install dependencies
RUN npm install
COPY . .
RUN whoami
RUN chown -R node:node /app/node_modules

# build
RUN npm run build

# Uses port which is used by the actual application
EXPOSE 3000

# Default command
CMD ["npm", "start"]
