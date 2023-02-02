FROM node:16-alpine
RUN apk update
RUN apk upgrade
RUN apk add --no-cache ffmpeg
RUN npm install --location=global npm
EXPOSE 80
WORKDIR /home
COPY ./build ./build
COPY .env.build .env
COPY ./package.json .
COPY ./package-lock.json .
COPY ./LICENSE .
RUN npm install --production
ENTRYPOINT ["node", "build/index.js"]
    