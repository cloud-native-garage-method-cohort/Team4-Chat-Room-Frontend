# Specify a base image
FROM node:alpine

WORKDIR /app

COPY package.json yarn.lock ./

# install dependencies
RUN yarn install

COPY . .

# build
RUN yarn build

# Uses port which is used by the actual application
EXPOSE 3000

# Default command
CMD ["yarn", "run", "start"]
