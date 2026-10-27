# -------------------------------------------------------------
# Stage 1: Build React 19 + Vite application
# -------------------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Argument to pass VITE_API_URL during docker build
ARG VITE_API_URL=http://localhost:3000
ENV VITE_API_URL=$VITE_API_URL

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source and build production bundle
COPY . .
RUN npm run build

# -------------------------------------------------------------
# Stage 2: Production Nginx Server
# -------------------------------------------------------------
FROM nginx:1.27-alpine AS runner

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
