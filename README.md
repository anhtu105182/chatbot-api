### ** README.md - Chatbot Tuyển Sinh**  

```markdown
# 🎓 Chatbot Tuyển Sinh

Chatbot này giúp tư vấn và hỗ trợ sinh viên về tuyển sinh, thông tin trường học và các câu hỏi liên quan. Hệ thống bao gồm backend (Node.js + Express + MySQL) và frontend (HTML/CSS/JS).
Đây là module chatbot hỗ trợ tuyển sinh, cho phép học sinh và sinh viên đăng nhập, trò chuyện với các phòng ban/khoa để được hỗ trợ thông tin tuyển sinh.  

---

##  1. Cài đặt môi trường

### **🔹 Yêu cầu:**
- **Node.js** >= 16.x
- **MySQL** >= 8.x
- **Postman** (để test API)

### **🔹 Cài đặt backend**
```sh
git clone https://github.com/anhtu105182/chatbot-api.git
cd chatbot-api
npm install
```

---

## 📌 2. Cấu hình môi trường
Tạo file `.env` trong thư mục gốc và thêm các thông tin sau:
```ini
GEMINI_API_KEY=your_gemini_api_key # API key của Gemini AI
JWT_SECRET=sieuchuoidemmat123! # Chuỗi bí mật JWT
```

---

## 📌 3. Khởi động server
```sh
npm run dev   # Dùng nodemon (Tự động reload khi code thay đổi)
# Hoặc
node server.js   # Chạy thủ công
```
🚀 Server sẽ chạy tại **`http://localhost:5000`**

---

## 📌 4. Cấu trúc thư mục
```bash
chatbot-api/
├── README.md                 # Hướng dẫn cài đặt
├── db_chatbot.sql            # File CSDL
├── package.json              # Danh sách dependencies
├── server.js                 # File khởi tạo server
├── db.js                     # Kết nối CSDL
├── middleware/               # Thư mục xác thực JWT
│   ├── auth.js               # xác thực JWT
├── routes/                   # Thư mục chứa các route
│   ├── auth.js               # Route đăng ký và đăng nhập
│   └── chat.js               # Route chat
├── controllers/              # Thư mục chứa logic xử lý
│   ├── authController.js     # Controller đăng ký và đăng nhâp
│   └── chatController.js     # Controller chat
```

---

## 📌 5. API chính

### **🔹 Đăng ký & Đăng nhập**
| Phương thức | Endpoint            | Mô tả              |
|------------|----------------------|----------------------|
| `POST`     | `/api/auth/register` | Đăng ký tài khoản |
| `POST`     | `/api/auth/login`    | Đăng nhập & nhận token |

### **🔹 Quản lý cuộc trò chuyện**
| Phương thức| Endpoint                       | Mô tả                            |
|------------|--------------------------------|----------------------------------|
| `POST`     | `/api/chat/create-chat`        | Tạo cuộc trò chuyện mới          |
| `GET`      | `/api/chat/list`               | Lấy danh sách cuộc trò chuyện    |
| `GET`      | `/api/chat/messages/:chat_id`  | Lấy tin nhắn của cuộc trò chuyện |
| `POST`     | `/api/chat/chatgemini`         | Gửi tin nhắn đến chatbot         |
| `DELETE`   | `/api/chat/messages/:chat_id`  | Xóa tin nhắn                     |

**Đối với api xóa tin nhắn** thì chỉ có tk có vai trò admin và tk của mình mới xóa được tin nhắn của mình

📌 **Lưu ý:** API yêu cầu **Bearer Token**, dùng `Authorization: Bearer <TOKEN>` trong header.

---

## 📌 6. Test API bằng Postman 
**Lưu ý** những api ở phần quản lí tin nhắn thì mới cần gửi token -- api login và register thì không 
- Mở **Postman** và nhập URL **`http://localhost:5000/api/...`**.
- Gửi request với header:
  ```json
  {
    "Authorization": "Bearer <TOKEN>"
  }
  ```
- Xem kết quả JSON trả về.

---

## 📌 7. Tính năng đang phát triển
✅ **Đã hoàn thành:**
- Xác thực người dùng bằng JWT
- Chat với chatbot Gemini AI
- Lưu lịch sử tin nhắn vào MySQL
- API xóa tin nhắn (xóa mềm)
- Kiểm tra quyền hạn khi truy cập chat

🛠 **Sắp tới:**
- UI hiển thị lịch sử chat
- Hiệu ứng "Chatbot đang trả lời..."
- Hỗ trợ gửi ảnh/file

---

## 📌 8. Liên hệ & đóng góp
📌 **Nếu bạn có câu hỏi hoặc muốn đóng góp, hãy liên hệ:**  
📩 **Email:** your.tunguyenanh2122004@gmail.com

🚀 **Cảm ơn bạn đã sử dụng Chatbot Tuyển Sinh! Chúc bạn code vui vẻ!** 🎉
```

---
