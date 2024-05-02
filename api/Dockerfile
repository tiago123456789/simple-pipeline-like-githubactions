FROM node:16-alpine3.18

WORKDIR app/

COPY package.json package-lock.json ./

COPY . ./

COPY credential.json ./

RUN npm install --omit=dev --silent

CMD ["node", "index.js"]