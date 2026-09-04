# ==========================================
# Stage 1: Build React Application
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency specifications
COPY package*.json ./

# Install exactly the versions recorded in package-lock.json.
RUN npm ci

# Copy client source code
COPY . .

# Build production bundle
RUN npm run build

# ==========================================
# Stage 2: Serve with Nginx
# ==========================================
FROM nginx:alpine

# Copy custom nginx configuration with SPA fallback & API reverse proxy
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled static assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose HTTP port
EXPOSE 80

# Run nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
