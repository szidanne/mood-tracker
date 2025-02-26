FROM node:18-alpine

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++ sqlite-dev

COPY package*.json ./

# Install dependencies
RUN npm install

COPY . .

# Rebuild sqlite3 for Alpine
RUN npm rebuild sqlite3

EXPOSE 8000

CMD ["npm", "start"] 