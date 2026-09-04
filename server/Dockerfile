# Use lightweight official Node.js Alpine base image
FROM node:20-alpine

# Set working directory inside container
WORKDIR /usr/src/app

# Copy dependency manifests
COPY package*.json ./

# Install production dependencies
RUN npm install --omit=dev

# Copy source code
COPY . .

# Expose API port
EXPOSE 5000

# Start server
CMD ["node", "src/server.js"]
