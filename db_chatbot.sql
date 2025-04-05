CREATE DATABASE IF NOT EXISTS chatbot_db;
USE chatbot_db;

-- Bảng Users
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'admin') NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Bảng Departments
CREATE TABLE Departments (
    dept_id INT AUTO_INCREMENT PRIMARY KEY,
    dept_name VARCHAR(100) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Bảng Chats
CREATE TABLE Chats (
    chat_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    dept_id INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (dept_id) REFERENCES Departments(dept_id)
);

-- Bảng Messages
CREATE TABLE Messages (
    message_id INT AUTO_INCREMENT PRIMARY KEY,
    chat_id INT NOT NULL,
    sender_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (chat_id) REFERENCES Chats(chat_id),
    FOREIGN KEY (sender_id) REFERENCES Users(user_id)
);

-- 🔹 Tạo user chatbot (Admin)
INSERT INTO Users (user_id, username, password, role)  
VALUES (1, 'chatbot', '$2b$10$xxxxxxxxxxxxxxxxxxxx', 'admin') 
ON DUPLICATE KEY UPDATE username = 'chatbot';

-- 🔹 Tạo tài khoản mẫu cho Student
INSERT INTO Users (username, password, role) 
VALUES ('student1', '$2b$10$yyyyyyyyyyyyyyyyyyyy', 'student')

-- 🔹 Thêm phòng ban (Departments)
INSERT INTO Departments (dept_id, dept_name) 
VALUES (1, 'Phòng Tuyển Sinh')
ON DUPLICATE KEY UPDATE dept_name = VALUES(dept_name);
