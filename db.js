const mysql = require('mysql2');

// Tạo pool kết nối
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',       // Thay bằng username của bạn
    password: '1234',       // Thay bằng password của bạn
    database: 'chatbot_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool.promise(); // Sử dụng promise để hỗ trợ async/await