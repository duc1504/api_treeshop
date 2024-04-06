const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Tham chiếu tới mô hình User nếu bạn có mô hình User
    required: true
  },
//   user_id: {
//     type: String,
//     required: true
//   },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product', // Tham chiếu tới mô hình Product nếu bạn có mô hình Product
    required: true
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  // Các trường thông tin khác về đơn hàng
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema, 'orders');

module.exports = Order;
