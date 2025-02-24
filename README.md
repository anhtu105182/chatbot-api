### **Module Chatbot Tuyển Sinh**  

Đây là module chatbot hỗ trợ tuyển sinh, cho phép học sinh và sinh viên đăng nhập, trò chuyện với các phòng ban/khoa để được hỗ trợ thông tin tuyển sinh.  

---

## **1. Yêu cầu hệ thống**  
- **Node.js**: Phiên bản 16 trở lên.  
- **MySQL**: Phiên bản 5.7 trở lên.  
- **Postman** hoặc công cụ tương tự để test API.  

---

## **2. Cài đặt**  

```sh
cd chatbot-api
npm install
```

### **Cấu hình CSDL**  
```sh
mysql -u your_username -p chatbot_db < chatbot_db.sql
```

### **Mở file `db.js` và cập nhật thông tin kết nối MySQL:**  
```js
const pool = mysql.createPool({
  host: 'localhost',      // Địa chỉ host
  user: 'root',           // Tên người dùng MySQL
  password: '',           // Mật khẩu MySQL
  database: 'chatbot_db', // Tên database
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
```

### **Chạy chương trình**  
```sh
node server.js
```

---

## **3. Test API trong Postman**  

### **API Đăng nhập**  
**Phương thức:** `POST`  
**Endpoint:** `http://localhost:5000/api/auth/login`  
**Body:**  
```json
{
  "username": "tuna5",
  "password": "password4321"
}
```

### **API Đăng ký**  
**Phương thức:** `POST`  
**Endpoint:** `http://localhost:5000/api/auth/register`  
**Body:**  
```json
{
  "username": "tuna13",
  "password": "password4321",
  "role": "teacher"
}
```

### **API Tạo cuộc trò chuyện**  
**Phương thức:** `POST`  
**Endpoint:** `/api/chat/create`  
**Body:**  
```json
{
  "user_id": 1,
  "dept_id": 1
}
```

### **API Gửi tin nhắn**  
**Phương thức:** `POST`  
**Endpoint:** `/api/chat/send`  
**Body:**  
```json
{
  "chat_id": 1,
  "sender_id": 1,
  "content": "Xin chào, tôi cần hỗ trợ tuyển sinh."
}
```

### **API Lấy tin nhắn**  
**Phương thức:** `GET`  
**Endpoint:** `/api/chat/messages/:chat_id`  
**Ví dụ:**  
```
GET /api/chat/messages/1
```

### **API Xóa tin nhắn**  
**Phương thức:** `DELETE`  
**Endpoint:** `/api/chat/messages/:message_id`  
**Ví dụ:**  
```
DELETE /api/chat/messages/1
```

---

## **4. Cấu trúc thư mục**  

```
chatbot-api/
├── README.md                 # Hướng dẫn cài đặt
├── db_chatbot.sql            # File CSDL
├── package.json              # Danh sách dependencies
├── server.js                 # File khởi tạo server
├── db.js                     # Kết nối CSDL
├── routes/                   # Thư mục chứa các route
│   ├── auth.js               # Route đăng ký và đăng nhập
│   └── chat.js               # Route chat
├── controllers/              # Thư mục chứa logic xử lý
│   ├── authController.js     # Controller đăng ký và đăng nhập
│   └── chatController.js     # Controller chat
`
