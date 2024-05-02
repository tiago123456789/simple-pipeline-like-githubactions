FROM node:16-alpine3.18

RUN apk add terraform --repository=https://dl-cdn.alpinelinux.org/alpine/edge/community

RUN terraform --version

WORKDIR app/

COPY package.json package-lock.json ./

COPY . ./

COPY credential.json ./

RUN npm install --omit=dev --silent

CMD ["node", "index.js"]