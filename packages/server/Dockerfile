FROM node:latest

WORKDIR /app

COPY ./.env ./
COPY ./package.json ./
COPY . .

RUN npm install -g yarn --force

RUN yarn workspaces focus @crossflow/server --production

RUN yarn build

ENV NODE_ENV=production
EXPOSE 4000

CMD ["node", "dist/index.js"]