const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config({ path: './config/.env' });
const ConnectDB = require('./database/dbConnection');

// const authRoutes = require('./routers/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const app = express();
app.use(express.json());
app.use(cors())

app.use(cors({
    origin: 'http://localhost:5173', // replace with your frontend URL
    credentials: true,
  }));
// Connect to MongoDB
ConnectDB();

// Mount auth routes under /api
app.use('/api', adminRoutes);
// app.use('/api/admin', adminRoutes);
app.use(cookieParser());
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));