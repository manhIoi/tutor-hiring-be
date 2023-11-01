FROM node:14.18-slim

COPY . /opt/crawl-tutor-hiring

WORKDIR /opt/crawl-tutor-hiring

RUN npm install

CMD npm start
