FROM node:18 as build
ARG REACT_APP_STATION_API=http://ev.local/stations
ARG REACT_APP_USER_API=http://ev.local/user
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV REACT_APP_STATION_API=$REACT_APP_STATION_API
ENV REACT_APP_USER_API=$REACT_APP_USER_API
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

