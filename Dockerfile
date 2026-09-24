# Stage 1: build dell'applicazione Angular
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: serve dei file statici tramite nginx
FROM nginx:alpine
COPY --from=build /app/dist/meteo-app/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
