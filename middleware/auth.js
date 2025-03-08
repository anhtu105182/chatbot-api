const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
    const token = req.headers.authorization; // Lấy token từ header

    if (!token) {
        return res.status(403).json({ error: "Bạn chưa đăng nhập!" });
    }

    try {
        const tokenValue = token.startsWith("Bearer ") ? token.split(" ")[1] : token;
        const decoded = jwt.verify(tokenValue, process.env.JWT_SECRET); // ✅ Dùng env
        req.user_id = decoded.user_id; // Lưu user_id vào request
        next();
    } catch (error) {
        return res.status(401).json({ error: "Token không hợp lệ hoặc đã hết hạn!" });
    }
};
