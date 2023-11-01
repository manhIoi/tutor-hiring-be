FROM node:14.18-slim

COPY . /opt/crawl-tutor-hiring

WORKDIR /opt/crawl-tutor-hiring

RUN yarn && \
    yarn install

CMD yarn start
