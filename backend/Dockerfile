FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install --verbose

COPY . .

RUN npx prisma generate

RUN npm run build

EXPOSE 5000

CMD npx prisma migrate deploy && npm run start