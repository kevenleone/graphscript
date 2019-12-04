FROM node:10.17.0-alpine

# Create app directory
WORKDIR /app

COPY ./package.json .

RUN yarn install --production
# RUN npm install

COPY ./dist/ ./dist/
COPY ./.env ./.env
COPY ./ormconfig.json .

ENV NODE_ENV production

EXPOSE 3333

CMD [ "node", "dist/src/index.js" ]