FROM node:14

COPY package.json package.lock ./

RUN npm ci

COPY . .

CMD ["node", "index.js"]
