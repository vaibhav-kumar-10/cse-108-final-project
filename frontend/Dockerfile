# # FROM node:20.18-bookworm
# # WORKDIR /app
# # COPY public/ /app/public
# # COPY src/ /app/src
# # COPY package.json /app/
# # COPY .env /app/
# # # RUN npm install react-tradingview-widget
# # # RUN npm install react-bootstrap
# # # RUN npm install axios
# # # RUN npm install react-router-dom
# # # RUN npm install react-cookie
# # # RUN npm install chartjs
# # # RUN npm install react-chartjs-2 --force
# # RUN npm install --force
# # CMD npm run start

# FROM node:20.18-bookworm
# WORKDIR /app
# COPY package*.json .       
# # Copy both package.json and package-lock.json
# RUN npm install --force
# COPY . .                   
# # Then copy the rest of the app (public, src, etc.)
# EXPOSE 3000
# CMD ["npm", "start", "--", "--host", "0.0.0.0"]
# Build step

# Build phase
FROM node:20 as build
WORKDIR /app
COPY . .
RUN npm install --force
RUN npm run build

# Serve phase
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

# Add custom NGINX config
COPY default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]