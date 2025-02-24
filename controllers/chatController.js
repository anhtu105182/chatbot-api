// const axios = require('axios');
// const db = require('../db'); // Import kết nối MySQL
// require('dotenv').config({ path: './api.env' });

// const BOT_ID = 22; // ⚠ Cập nhật ID của bot từ CSDL

// exports.chatWithGemini = async (req, res) => {
//     try {
//         const { chat_id, sender_id, message } = req.body;

//         if (!GEMINI_API_KEY) {
//             return res.status(500).json({ error: "API Key của Gemini không được tìm thấy" });
//         }

//         // Kiểm tra chat_id hợp lệ
//         const [chatExists] = await db.query("SELECT * FROM Chats WHERE chat_id = ?", [chat_id]);
//         if (chatExists.length === 0) {
//             return res.status(404).json({ error: "Chat ID không tồn tại" });
//         }

//         // Lưu tin nhắn của user vào MySQL
//         await db.query(
//             "INSERT INTO Messages (chat_id, sender_id, content) VALUES (?, ?, ?)",
//             [chat_id, sender_id, message]
//         );

//         // Gọi API Gemini để nhận phản hồi
//         const response = await axios.post(
//             `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
//             {
//                 contents: [{ role: "user", parts: [{ text: message }] }]
//             },
//             {
//                 headers: { "Content-Type": "application/json" }
//             }
//         );

//         // Kiểm tra phản hồi từ API
//         if (!response.data || !response.data.candidates || response.data.candidates.length === 0) {
//             return res.status(500).json({ error: "Không nhận được phản hồi hợp lệ từ Gemini" });
//         }

//         // Lấy phản hồi từ Gemini
//         const botReply = response.data.candidates[0].content.parts[0].text;

//         // Lưu phản hồi của bot với sender_id là BOT_ID
//         await db.query(
//             "INSERT INTO Messages (chat_id, sender_id, content) VALUES (?, ?, ?)",
//             [chat_id, BOT_ID, botReply]
//         );

//         res.json({ reply: botReply });
//     } catch (error) {
//         console.error("Lỗi gọi API Gemini:", error);
//         res.status(500).json({
//             error: error.response ? error.response.data : "Lỗi khi gọi API Gemini"
//         });
//     }
// };




const axios = require('axios');
require('dotenv').config({ path: './api.env' });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY; // Lấy API Key từ file môi trường

exports.chatWithGemini = async (req, res) => {
    try {
        const { message } = req.body;

        if (!GEMINI_API_KEY) {
            return res.status(500).json({ error: "API Key của Gemini không được tìm thấy" });
        }

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
            {
                contents: [{ role: "user", parts: [{ text: message }] }]
            },
            {
                headers: { "Content-Type": "application/json" }
            }
        );

        // Kiểm tra phản hồi từ API
        if (!response.data || !response.data.candidates || response.data.candidates.length === 0) {
            return res.status(500).json({ error: "Không nhận được phản hồi hợp lệ từ Gemini" });
        }

        res.json({ reply: response.data.candidates[0].content });
    } catch (error) {
        console.error("Lỗi gọi API Gemini:", error);

        res.status(500).json({
            error: error.response ? error.response.data : "Lỗi khi gọi API Gemini"
        });
    }
};
