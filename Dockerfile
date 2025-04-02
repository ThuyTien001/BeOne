# base image
FROM node:18.16.0 as builder
ARG CONFIG_NAME
RUN echo $CONFIG_NAME

# set working directory
WORKDIR /home/node/mojo-lms-web

# install and cache app dependencies
COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .
COPY tsconfig.app.json .
COPY tsconfig.spec.json .
COPY .eslintrc.json .
COPY angular.json .
COPY gulpfile.js .
COPY src ./src/

RUN npm install && npm install -g @angular/cli@16.0.0 && npm run build:prod

# Config nginx
FROM nginx:1.13
COPY --from=builder /home/node/mojo-lms-web/dist /var/www/dist/mojo-lms-web
COPY ./nginx.conf /etc/nginx/conf.d/mojo-lms-web

CMD ["/bin/bash", "-c", "envsubst 'localhost 80' < /etc/nginx/conf.d/mojo-lms-web > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]