# Use lightweight official Node.js Alpine base image
FROM node:20-alpine

# Set working directory inside container
WORKDIR /usr/src/app

# Copy dependency manifests
COPY package*.json ./

# Install exactly the versions recorded in package-lock.json.
RUN npm ci --omit=dev

# Copy source code
COPY . .

# Expose API port
EXPOSE 5000

# Keep the runtime process unprivileged.
USER node

# Start server
CMD ["node", "src/server.js"]
