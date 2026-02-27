FROM node:20-slim

WORKDIR /app

# Build the React frontend
COPY client/package*.json ./client/
RUN cd client && npm ci

COPY client/ ./client/
RUN cd client && npm run build

# Install server dependencies
COPY server/package*.json ./server/
RUN cd server && npm ci --omit=dev

COPY server/ ./server/

# Seed the database on first run, then start the server
ENV PORT=8080
ENV DB_PATH=/data/nursery.db
EXPOSE 8080

CMD ["sh", "-c", "cd server && node seed.js && node index.js"]
