
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build


FROM node:22-alpine AS production

WORKDIR /app

COPY --from=builder /app/ ./

EXPOSE 3000

CMD ["npm", "run", "start"]