FROM node:18-alpine

WORKDIR /app

COPY package.json ./

RUN npm install

COPY prisma /app/prisma
RUN npx prisma generate

COPY . .

#COPY wait-for-it.sh /wait-for-it.sh
#RUN chmod +x /wait-for-it.sh

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "dev"]