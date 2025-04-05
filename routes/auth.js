const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
require('dotenv').config(); // Load biến môi trường từ .env


const router = express.Router();

// Đăng ký
router.post('/register', async (req, res) => {
    const { username, password, role } = req.body;

    try {
        // Kiểm tra username đã tồn tại chưa
        const [user] = await db.query('SELECT * FROM Users WHERE username = ?', [username]);
        if (user.length > 0) return res.status(400).json({ message: 'Username already exists' });

        // Mã hóa mật khẩu
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Lưu người dùng mới vào CSDL
        await db.query(
            'INSERT INTO Users (username, password, role) VALUES (?, ?, ?)',
            [username, hashedPassword, role]
        );

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Đăng nhập
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Kiểm tra username
        const [user] = await db.query('SELECT * FROM Users WHERE username = ?', [username]);
        if (user.length === 0) return res.status(400).json({ message: 'User not found' });

        // Kiểm tra mật khẩu
        const validPassword = await bcrypt.compare(password, user[0].password);
        if (!validPassword) return res.status(400).json({ message: 'Invalid password' });

        // 🔹 Kiểm tra nếu JWT_SECRET chưa được cấu hình
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ error: "JWT_SECRET chưa được cấu hình trong .env" });
        }

        // ✅ Tạo token bảo mật từ JWT_SECRET
        const token = jwt.sign(
            { user_id: user[0].user_id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        // Trả về thông tin người dùng và vai trò
        const userInfo = {
            message: 'Login successful',
            role: user[0].role
        };
        res.json({ token, ...userInfo });


    } catch (error) {
        console.error("Lỗi đăng nhập:", error);
        res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = router;