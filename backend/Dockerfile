# Dockerfile for BuySmart Admin System - Railway Deployment

# Use official Node.js runtime as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY backend/package*.json ./

# Install dependencies
RUN npm install --production

# Copy source files
COPY backend ./

# Create necessary directories
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