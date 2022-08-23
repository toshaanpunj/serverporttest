FROM node:latest

WORKDIR /usr/src/app

COPY /package*.json ./

RUN npm install

COPY ../ .

EXPOSE 1529

CMD ["npm" , "start" ]