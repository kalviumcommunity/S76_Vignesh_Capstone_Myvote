const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config({ path: './config/.env' });
const ConnectDB = require('./database/dbConnection');

// const authRoutes = require('./routers/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const adminDashRoutes = require('./routes/adminDashRoutes');
const app = express();
app.use(express.json());


app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
  }));
// Connect to MongoDB
ConnectDB();


app.use('/api', adminRoutes);
app.use('/api/dash',adminDashRoutes);

app.use(cookieParser());
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));