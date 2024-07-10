# Build stage for the client
FROM node:14-alpine AS build-stage
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client ./
RUN npm run build

# Production stage
FROM node:14-alpine
WORKDIR /app

# Set up server
COPY server/package*.json ./server/
RUN npm install --prefix ./server
COPY server ./server

# Copy client build to server's static files directory
COPY --from=build-stage /app/client/build ./server/build

# Expose the ports
EXPOSE 3000

# Start the server
CMD ["node", "server/server.js"]