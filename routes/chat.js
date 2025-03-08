const express = require('express');
const db = require('../db');
const { chatWithGemini, getChatMessages, getChatList, createChat, deleteMessage } = require('../controllers/chatController'); 
const { verifyToken } = require('../middleware/auth'); // Import middleware

const router = express.Router();
// router tạo cuộc trò chuyện
router.post('/create-chat', verifyToken, createChat);

// router lấy danh sách tin nhắn
router.get('/list', verifyToken, getChatList);

// Lấy tin nhắn
router.get('/messages/:chat_id', verifyToken, getChatMessages);

// Xóa tin nhắn
router.delete('/messages/:message_id', verifyToken, deleteMessage);

// Gửi tin nhắn & lưu vào CSDL
router.post('/chatgemini',verifyToken , chatWithGemini);



module.exports = router;
