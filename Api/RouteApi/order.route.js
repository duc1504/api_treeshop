const express = require("express");
const router = express.Router();
const Order = require("../Models/Oder.model");

// http://localhost:5000/order/purchase-history/:userId
router.get("/purchase-history/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
        // chuyển user_id sang ObjectId
        
      // Truy vấn cơ sở dữ liệu để lấy danh sách các đơn hàng của người dùng
      const purchaseHistory = await Order.find({ user_id: userId }).populate('products');
        console.log(purchaseHistory)
      // Trả về kết quả dưới dạng JSON
      res.status(200).json({ status: true, purchaseHistory });
    } catch (error) {
      // Trả về lỗi nếu có lỗi xảy ra trong quá trình xử lý
      res.status(500).json({ status: false, message: "Đã xảy ra lỗi khi lấy lịch sử mua hàng", error });
    }
  });
  
  module.exports = router;