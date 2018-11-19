FROM node:10.13-alpine as build

ENV APP_PATH /rcli

WORKDIR ${APP_PATH}

COPY package*.json ./
RUN npm install
COPY angular.json tsconfig.json tslint.json ./
COPY src ./src/
RUN ./node_modules/.bin/ng build --prod


FROM nginx:1.13.12-alpine

ENV APP_PATH /rcli
ENV NGINX_ROOT /usr/share/nginx/html

COPY --from=build ${APP_PATH}/dist/redmine-client ${NGINX_ROOT}
COPY ./redmine-client.sh /usr/bin

CMD [ "/usr/bin/redmine-client.sh" ]
