FROM node:22

WORKDIR /app

COPY package*.json ./

RUN npm install -g pnpm
RUN pnpm i

COPY . .

RUN pnpm build
