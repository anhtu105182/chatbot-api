const axios = require('axios');
const db = require('../db');
require('dotenv').config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const BOT_ID = 1; //  ID của chatbot trong bảng Users


// chat với gemini
exports.chatWithGemini = async (req, res) => {
    try {
        const { chat_id, message } = req.body;
        const sender_id = req.user_id; // 🆕 Lấy user_id từ token

        console.log("🔍 Debug: sender_id nhận được:", sender_id);

        if (!sender_id) {
            return res.status(400).json({ error: "Không tìm thấy sender_id! Bạn đã đăng nhập chưa?" });
        }

        // 🔹 Kiểm tra chat_id có tồn tại không
        const [chatExists] = await db.query("SELECT * FROM Chats WHERE chat_id = ?", [chat_id]);
        if (chatExists.length === 0) {
            return res.status(400).json({ error: "Bạn chưa tạo cuộc trò chuyện" });
        }

        // 🔹 Lưu tin nhắn user vào database
        await db.query(
            "INSERT INTO Messages (chat_id, sender_id, content) VALUES (?, ?, ?)",
            [chat_id, sender_id, message]
        );

        // 🔹 Gửi tin nhắn đến Gemini API
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`,
            {
                contents: [{ role: "user", parts: [{ text: message }] }]
            },
            { headers: { "Content-Type": "application/json" } }
        );

        if (!response.data || !response.data.candidates || response.data.candidates.length === 0) {
            return res.status(500).json({ error: "Không nhận được phản hồi hợp lệ từ Gemini" });
        }

        // 🔹 Lưu phản hồi của chatbot vào database
        const botReply = response.data.candidates[0].content.parts.map(part => part.text).join("\n");
        await db.query(
            "INSERT INTO Messages (chat_id, sender_id, content) VALUES (?, ?, ?)",
            [chat_id, BOT_ID, botReply]
        );

        // 🔹 Trả về phản hồi chatbot cho user
        res.json({ reply: botReply });

    } catch (error) {
        console.error("❌ Lỗi khi gọi API Gemini:", error);
        res.status(500).json({
            error: error.response ? error.response.data : "Lỗi khi gọi API Gemini"
        });
    }
};


exports.getChatMessages = async (req, res) => {
    try {
        const user_id = req.user_id; // 🆕 Lấy user_id từ token
        const { chat_id } = req.params;

        console.log("🔍 Debug: user_id nhận được:", user_id);
        console.log("🔍 Debug: chat_id nhận được:", chat_id);

        // 🔹 Kiểm tra xem chat_id có thuộc về user không
        const [chatExists] = await db.query(
            "SELECT * FROM Chats WHERE chat_id = ? AND user_id = ?",
            [chat_id, user_id]
        );

        if (chatExists.length === 0) {
            return res.status(400).json({ error: "Cuộc trò chuyện không tồn tại hoặc bạn không có quyền truy cập" });
        }

        // 🔹 Lấy tin nhắn nhưng chỉ lấy những tin chưa bị xóa
        const [messages] = await db.query(
            `SELECT 
                m.message_id,
                m.sender_id, 
                u.username AS sender_name, 
                m.content, 
                m.created_at 
            FROM Messages m
            JOIN Users u ON m.sender_id = u.user_id
            WHERE chat_id = ? AND m.is_deleted = FALSE  -- 🔥 Chỉ lấy tin chưa xóa
            ORDER BY m.created_at ASC`,
            [chat_id]
        );

        res.json({ chat_id, messages });

    } catch (error) {
        console.error("❌ Lỗi khi lấy lịch sử tin nhắn:", error);
        res.status(500).json({ error: "Lỗi server", details: error.message });
    }
};


// lấy danh sách cuộc trò chuyện
exports.getChatList = async (req, res) => {
    try {
        const user_id = req.user_id; // 🆕 Lấy user_id từ token

        // 🔹 Lấy danh sách cuộc trò chuyện của user
        const [chats] = await db.query(
            `SELECT 
                c.chat_id, 
                c.created_at, 
                d.dept_name AS chat_with 
            FROM Chats c
            JOIN Departments d ON c.dept_id = d.dept_id
            WHERE c.user_id = ? 
            ORDER BY c.created_at DESC`,
            [user_id]
        );

        res.json({ user_id, chats });

    } catch (error) {
        console.error("❌ Lỗi khi lấy danh sách cuộc trò chuyện:", error);
        res.status(500).json({ error: "Lỗi server", details: error.message });
    }
};



// tạo cuoc tro chuyen
exports.createChat = async (req, res) => {
    try {
        const user_id = req.user_id; // 🆕 Lấy user_id từ token
        const { dept_id } = req.body;

        if (!dept_id) {
            return res.status(400).json({ error: "Thiếu dept_id" });
        }

        // 🔹 Kiểm tra xem user đã có cuộc trò chuyện với chatbot chưa
        const [existingChat] = await db.query(
            "SELECT chat_id FROM Chats WHERE user_id = ? AND dept_id = ? LIMIT 1",
            [user_id, dept_id]
        );

        if (existingChat.length > 0) {
            return res.json({ message: "Đã có cuộc trò chuyện", chat_id: existingChat[0].chat_id });
        }

        // 🔹 Nếu chưa có cuộc trò chuyện, tạo mới
        const [result] = await db.query(
            "INSERT INTO Chats (user_id, dept_id) VALUES (?, ?)",
            [user_id, dept_id]
        );

        res.status(201).json({ message: "Cuộc trò chuyện mới đã được tạo", chat_id: result.insertId });

    } catch (error) {
        console.error("❌ Lỗi khi tạo cuộc trò chuyện:", error);
        res.status(500).json({ error: "Lỗi server", details: error.message });
    }
};


// xóa tin nhắn
exports.deleteMessage = async (req, res) => {
    try {
        const user_id = req.user_id; // 🆕 Lấy user_id từ token
        const { message_id } = req.params;

        // 🔹 Kiểm tra tin nhắn có tồn tại không
        const [message] = await db.query(
            "SELECT * FROM Messages WHERE message_id = ?",
            [message_id]
        );

        if (message.length === 0) {
            return res.status(404).json({ error: "Tin nhắn không tồn tại!" });
        }

        const sender_id = message[0].sender_id;

        // 🔹 Kiểm tra user có quyền xóa tin nhắn không (chỉ admin hoặc chính chủ)
        const [user] = await db.query("SELECT role FROM Users WHERE user_id = ?", [user_id]);

        if (user[0].role !== "admin" && sender_id !== user_id) {
            return res.status(403).json({ error: "Bạn không có quyền xóa tin nhắn này!" });
        }

        // 🔹 Thực hiện xóa tin nhắn (có thể là xóa mềm bằng `is_deleted = TRUE`)
        await db.query("UPDATE Messages SET is_deleted = TRUE WHERE message_id = ?", [message_id]);

        res.json({ message: "Tin nhắn đã được xóa thành công!" });

    } catch (error) {
        console.error("❌ Lỗi khi xóa tin nhắn:", error);
        res.status(500).json({ error: "Lỗi server", details: error.message });
    }
};
