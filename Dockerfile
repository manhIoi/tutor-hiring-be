FROM node:16.20-slim

COPY . /opt/crawl-tutor-hiring

WORKDIR /opt/crawl-tutor-hiring

RUN npm install

CMD npm start
