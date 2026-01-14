# BuySmart Admin System - Railway Deployment Guide

## Overview
This is the BuySmart Product Management System admin dashboard, ready for deployment on Railway.app.

## Features
- **Product Management**: Full CRUD operations for products
- **Authentication**: JWT-based admin authentication
- **File Uploads**: Product image management with Multer
- **Dashboard**: Analytics and product overview
- **Responsive Design**: Mobile-friendly admin interface

## Deployment to Railway

### Prerequisites
- Railway account (https://railway.app)
- MongoDB database (can be provisioned through Railway)
- Node.js 18.x

### Deployment Steps

1. **Create a new project on Railway**
   - Click "New Project" 
   - Select "Deploy from GitHub repo"
   - Connect your GitHub account and select this repository

2. **Set up environment variables**
   - Go to project settings > Variables
   - Add the following variables:
     ```
     NODE_ENV=production
     PORT=3000
     MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/buysmart
     JWT_SECRET=your_secure_jwt_secret_with_32+_characters
     ```

3. **Provision MongoDB**
   - In Railway, go to "Plugins" 
   - Add MongoDB plugin
   - Copy the connection URI to your MONGODB_URI variable

4. **Deploy**
   - Railway will automatically detect the Dockerfile
   - Click "Deploy" to start the deployment process
   - Wait for the build to complete (2-5 minutes)

5. **Access your admin system**
   - Once deployed, Railway will provide a URL
   - Access the admin panel at: `https://your-project.railway.app/login`

## Local Development

### Setup
```bash
cd backend
npm install
cp .env.production .env
# Edit .env with your local MongoDB URI and JWT secret
```

### Run the application
```bash
# Development mode with hot reload
npm run dev

# Production mode
npm start
```

### Access locally
- Admin panel: http://localhost:3000/login
- API endpoints: http://localhost:3000/api/
- Health check: http://localhost:3000/api/health

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new admin user
- `POST /api/auth/login` - Login and get JWT token

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create new product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

### Health
- `GET /api/health` - Health check endpoint

## Project Structure

```
backend/
├── config/              # Configuration files
├── controllers/         # Route controllers
├── middleware/          # Authentication middleware
├── models/              # MongoDB models
├── public/              # Static assets
├── routes/              # API and view routes
├── uploads/             # File uploads storage
├── views/               # EJS templates
├── .dockerignore        # Docker ignore file
├── .env.production      # Production environment template
├── Dockerfile           # Container configuration
├── railway.json         # Railway deployment config
├── server.js            # Main application server
└── package.json         # Node.js dependencies
```

## Security Notes

1. **JWT Secret**: Use a strong, random secret with at least 32 characters
2. **MongoDB**: Ensure your database has proper authentication
3. **Environment**: Never commit your production `.env` file
4. **HTTPS**: Railway provides HTTPS by default
5. **CORS**: Configure CORS settings in production

## Troubleshooting

### Common Issues

1. **MongoDB connection failed**:
   - Verify your MONGODB_URI is correct
   - Check that your IP is whitelisted in MongoDB
   - Ensure the database user has proper permissions

2. **JWT authentication failed**:
   - Verify JWT_SECRET matches between client and server
   - Check token expiration times
   - Ensure tokens are sent in the `x-auth-token` header

3. **File uploads not working**:
   - Check that the `uploads` directory exists and is writable
   - Verify file size limits in Multer configuration
   - Ensure proper file permissions

## Support

For issues with Railway deployment:
- Check Railway documentation: https://docs.railway.app
- Railway community: https://community.railway.app
- Railway status: https://status.railway.app

For application-specific issues:
- Review server logs in Railway dashboard
- Check MongoDB connection logs
- Verify environment variables are set correctly

## License

This project is licensed under the ISC license.