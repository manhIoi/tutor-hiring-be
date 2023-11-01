FROM node:14.18-slim

COPY . /opt/ws-football

WORKDIR /opt/ws-football

RUN yarn && \
    yarn install

CMD yarn start
