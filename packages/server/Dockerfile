FROM node

WORKDIR /app/server

RUN npm install -g yarn --force

# Копируем только нужные файлы
# COPY ./yarn.lock /app/
# COPY ./package.json /app/
COPY ./package.json /app/server/
COPY ./.env /app/server/
COPY ./ /app/server/

WORKDIR /app/server

RUN yarn install --production
RUN yarn config set registry https://registry.npmjs.org

WORKDIR /app/server

RUN yarn build

ENV NODE_ENV=production
EXPOSE 4000

CMD ["node", "dist/index.js"]
