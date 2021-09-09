FROM node:14-alpine
RUN apk add --no-cache ffmpeg
EXPOSE 80
WORKDIR /home
COPY ./src ./src
COPY ./tsconfig.json .
COPY ./package.json .
COPY ./LICENSE .
COPY .env.build .env
RUN npm install --production
CMD ["npm", "run", "deploy"]
