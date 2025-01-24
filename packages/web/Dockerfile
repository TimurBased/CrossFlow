FROM node:20.17.0-alpine

WORKDIR /app

RUN mkdir -p /app/web
RUN npm install -g yarn --force

COPY ./yarn.lock ./ 
COPY ./package.json ./
COPY ./packages/web/package.json ./web/
COPY ./packages/web/.env ./web/
COPY ./packages/web ./web/

# RUN yarn install --production
RUN npm config rm proxy 
RUN npm config rm https-proxy --force


ENV NODE_ENV=production
EXPOSE 3000

CMD ["yarn", "dev"]