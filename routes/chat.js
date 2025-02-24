const express = require('express');
const db = require('../db');
const { chatWithGemini } = require('../controllers/chatController');

const router = express.Router();

// Tạo cuộc trò chuyện
router.post('/create', async (req, res) => {
    const { user_id, dept_id } = req.body;

    if (!user_id || !dept_id) {
        return res.status(400).json({ message: 'user_id and dept_id are required' });
    }

    try {
        // Kiểm tra xem user_id và dept_id có tồn tại không
        const [users] = await db.query('SELECT * FROM Users WHERE user_id = ?', [user_id]);
        const [departments] = await db.query('SELECT * FROM Departments WHERE dept_id = ?', [dept_id]);

        if (users.length === 0 || departments.length === 0) {
            return res.status(404).json({ message: 'User or department not found' });
        }

        // Tạo cuộc trò chuyện mới
        const [result] = await db.query(
            'INSERT INTO Chats (user_id, dept_id) VALUES (?, ?)',
            [user_id, dept_id]
        );

        res.status(201).json({ message: 'Chat created successfully', chat_id: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Gửi tin nhắn
router.post('/send', async (req, res) => {
    const { chat_id, sender_id, content } = req.body;

    if (!chat_id || !sender_id || !content) {
        return res.status(400).json({ message: 'chat_id, sender_id, and content are required' });
    }

    try {
        await db.query(
            'INSERT INTO Messages (chat_id, sender_id, content) VALUES (?, ?, ?)',
            [chat_id, sender_id, content]
        );
        res.json({ message: 'Message sent' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Lấy tin nhắn
router.get('/messages/:chat_id', async (req, res) => {
    const { chat_id } = req.params;

    try {
        const [messages] = await db.query('SELECT * FROM Messages WHERE chat_id = ?', [chat_id]);

        if (messages.length === 0) {
            return res.status(404).json({ message: 'No messages found for this chat' });
        }

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Xóa tin nhắn
router.delete('/messages/:message_id', async (req, res) => {
    const { message_id } = req.params;

    try {
        const [result] = await db.query('DELETE FROM Messages WHERE message_id = ?', [message_id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Message not found' });
        }

        res.json({ message: 'Message deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// API ChatGPT
// Gửi tin nhắn & lưu vào CSDL
router.post('/chat', chatWithGemini);

// Lấy lịch sử tin nhắn theo chat_id
    // router.get('/messages/:chat_id', async (req, res) => {
    //     const { chat_id } = req.params;

    //     try {
    //         const [messages] = await db.query(
    //             "SELECT sender_id, content, created_at FROM Messages WHERE chat_id = ? ORDER BY created_at ASC",
    //             [chat_id]
    //         );

    //         res.json({ chat_id, messages });
    //     } catch (error) {
    //         res.status(500).json({ message: 'Lỗi server', error: error.message });
    //     }
    // });

module.exports = router;
