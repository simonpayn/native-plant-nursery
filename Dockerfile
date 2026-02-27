FROM node:20-slim AS frontend

WORKDIR /app

# Build the React frontend
COPY client/package*.json ./client/
RUN cd client && npm ci

COPY client/ ./client/
RUN cd client && npm run build

FROM node:20-slim

# Install build tools needed for better-sqlite3 native compilation
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install server dependencies (needs build tools for better-sqlite3)
COPY server/package*.json ./server/
RUN cd server && npm ci --omit=dev

COPY server/ ./server/

# Copy built frontend from first stage
COPY --from=frontend /app/client/dist ./client/dist

# Seed the database on first run, then start the server
ENV PORT=8080
ENV DB_PATH=/data/nursery.db
EXPOSE 8080

CMD ["sh", "-c", "cd server && node seed.js && node index.js"]
