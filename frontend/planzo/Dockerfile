FROM node:22 AS frontend-builder	

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

#stage 2
FROM node:22-slim

WORKDIR /app

COPY --from=frontend-builder /app .

EXPOSE 3000

CMD ["npm", "run", "start"]

