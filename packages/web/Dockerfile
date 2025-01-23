FROM node:latest

WORKDIR /app


COPY ./.env ./
COPY ./package.json ./
COPY . .

RUN npm install -g yarn --force

RUN yarn workspaces focus @crossflow/web --production

ENV NODE_ENV=production
EXPOSE 3000

CMD ["yarn", "dev"]