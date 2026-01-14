# Dockerfile for BuySmart Admin System - Railway Deployment

# Use official Node.js runtime as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY backend/package*.json ./

# Install dependencies
RUN npm install --production

# Copy source files from backend directory
COPY backend/config ./config
COPY backend/controllers ./controllers
COPY backend/middleware ./middleware
COPY backend/models ./models
COPY backend/routes ./routes
COPY backend/views ./views
COPY backend/public ./public
COPY backend/uploads ./uploads
COPY backend/.env ./
COPY backend/server.js ./

# Create necessary directories if they don't exist
RUN mkdir -p uploads && mkdir -p public/images

# Build step (if needed for frontend assets)
# RUN npm run build

# Expose port
EXPOSE 3000

# Environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Start the application
CMD ["npm", "start"]