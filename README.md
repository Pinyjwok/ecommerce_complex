# E-Commerce Complex Application

## Project Overview
A full-stack e-commerce application built with React, Node.js, Express, and MongoDB, designed to provide a robust and scalable online shopping experience.

## 🚀 Features
- User Authentication (Register, Login)
- Product Browsing
- Shopping Cart Management
- Responsive Design

## 🛠 Tech Stack
### Frontend
- React
- React Router
- Axios
- State Management: React Hooks

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt for password hashing

## 📦 Prerequisites
- Node.js (v14+ recommended)
- MongoDB
- npm or yarn

## 🔧 Installation

### Clone the Repository
```bash
git clone https://github.com/Pinyjwok/ecommerce_complex.git
cd ecommerce_complex
```

### Backend Setup
1. Navigate to backend directory
```bash
cd backend
```

2. Install dependencies
```bash
npm install
```

3. Create environment file
```bash
cp .env.example .env
```

4. Configure `.env` with your MongoDB URI and JWT Secret
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

5. Start the backend server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

### Frontend Setup
1. Navigate to frontend directory
```bash
cd frontend
```

2. Install dependencies
```bash
npm install
```

3. Create environment file
```bash
cp .env.example .env
```

4. Configure `.env` with backend API URL
```
REACT_APP_API_URL=http://localhost:5000/api
```

5. Start the frontend development server
```bash
npm start
```

### Running the Full Application
1. Open two terminal windows
2. In the first terminal, start the backend
3. In the second terminal, start the frontend
4. Access the application at `http://localhost:3000`

## 🔗 Connecting Frontend and Backend
- Ensure backend is running on `http://localhost:5000`
- Frontend will run on `http://localhost:3000`
- Update API URLs in `.env` files if ports change

## 🛠 Troubleshooting
- Verify MongoDB connection
- Check that all dependencies are installed
- Ensure environment variables are correctly set
- Check console for any error messages

## 🌐 Environment Variables
Create `.env` files in both `backend` and `frontend` directories with:
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret for JWT token generation
- `PORT`: Server port

## 🧪 Testing
```bash
# Backend Tests
npm test

# Frontend Tests
npm test
```

## 🚢 Deployment
- Backend: Heroku, DigitalOcean, or AWS
- Frontend: Netlify, Vercel
- Database: MongoDB Atlas

## 📝 License
MIT License

## 🤝 Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
