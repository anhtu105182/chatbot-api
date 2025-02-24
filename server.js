const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config({ path: './api.env' }); // Đặt dotenv.config() lên đầu tiên
// console.log("API Key:", process.env.OPENAI_API_KEY);


const db = require('./db'); // Import kết nối CSDL
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

// Khởi động server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
