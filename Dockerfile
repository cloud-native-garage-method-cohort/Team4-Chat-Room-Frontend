# Specify a base image
FROM node:alpine

WORKDIR /app

COPY package.json ./

# install dependencies
RUN npm install

COPY --chown=node:node . .

# build
RUN npm run build

# Uses port which is used by the actual application
EXPOSE 3000

# Default command
CMD ["npm", "start"]
