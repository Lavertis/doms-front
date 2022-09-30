# build environment
FROM node:18-alpine as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json /app/package.json
RUN npm install --silent
RUN npm install react-scripts@5.0.1 -g --silent
COPY . /app
RUN npm run build:production

# production environment
FROM nginx:1.23-alpine
COPY --from=build /app/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY ./nginx/nginx.conf /etc/nginx/conf.d/nginx.conf.template
CMD /bin/sh -c "envsubst '\$PORT' < /etc/nginx/conf.d/nginx.conf.template > /etc/nginx/conf.d/default.conf" && nginx -g 'daemon off;'