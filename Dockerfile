# Install dependencies and build the app
FROM quay.io/upslopeio/node-alpine as build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Serve the static site using nginx
FROM quay.io/upslopeio/nginx-unprivileged

COPY --from=build /app/build /usr/share/nginx/html
COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf

# Document the port
EXPOSE 3000
