FROM node:18-alpine

WORKDIR /app

# Copy package files first
COPY package*.json ./

# Copy Prisma schema and migrations
COPY prisma ./prisma/

# Install dependencies
RUN npm install

# Generate Prisma client
RUN npx prisma generate

# Copy the rest of the application
COPY . .

# Add wait-for-it script
COPY wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

# Build the application
RUN npm run build

EXPOSE 3000

# Use wait-for-it to ensure database is ready before starting
CMD ["/wait-for-it.sh", "db:3306", "--", "npm", "run", "start"]
