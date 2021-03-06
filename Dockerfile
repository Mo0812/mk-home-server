FROM node:15

WORKDIR /usr/src/app

COPY ["package*.json", "yarn.lock", "./"]

RUN yarn install

COPY . .

COPY [".env.docker", ".env.production"]

EXPOSE 8000 5353 5684 51379

CMD ["yarn", "run", "prod"]
