const axios = require('axios');
const db = require('../db');
require('dotenv').config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const BOT_ID = 1; // ID của chatbot

exports.chatWithGemini = async (req, res) => {
    try {
        const { chat_id, message } = req.body;
        const sender_id = req.user_id; // 🆕 Lấy user_id từ token

        if (!GEMINI_API_KEY) {
            return res.status(500).json({ error: "API Key của Gemini không được tìm thấy" });
        }

        // 🔹 1. Kiểm tra chat_id có tồn tại không
        const [chatExists] = await db.query("SELECT * FROM Chats WHERE chat_id = ?", [chat_id]);
        if (chatExists.length === 0) {
            return res.status(400).json({ error: "Bạn chưa tạo cuộc trò chuyện" });
        }

        // 🔹 2. Lưu tin nhắn user vào database
        await db.query(
            "INSERT INTO Messages (chat_id, sender_id, content) VALUES (?, ?, ?)",
            [chat_id, sender_id, message]
        );

        // 🔹 3. Gọi API Gemini để lấy phản hồi
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`,
            {
                contents: [{ role: "user", parts: [{ text: message }] }]
            },
            { headers: { "Content-Type": "application/json" } }
        );

        // Kiểm tra phản hồi từ API
        if (!response.data || !response.data.candidates || response.data.candidates.length === 0) {
            return res.status(500).json({ error: "Không nhận được phản hồi hợp lệ từ Gemini" });
        }

        // 🔹 4. Lấy phản hồi từ Gemini
        const botReply = response.data.candidates[0].content.parts.map(part => part.text).join("\n");

        // 🔹 5. Lưu phản hồi của bot vào database
        await db.query(
            "INSERT INTO Messages (chat_id, sender_id, content) VALUES (?, ?, ?)",
            [chat_id, BOT_ID, botReply]
        );

        res.json({ reply: botReply });

    } catch (error) {
        console.error("Lỗi gọi API Gemini:", error);
        res.status(500).json({
            error: error.response ? error.response.data : "Lỗi khi gọi API Gemini"
        });
    }
};
