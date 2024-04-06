const mongoose = require('mongoose');
const cartSchema = new mongoose.Schema({
    // user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    user_id: { type: String },
    date: { type: Date, default: Date.now },
    total: { type: Number, default: 0 },
    status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'pending' }
});

const Cart = mongoose.model('Cart', cartSchema,'carts');

module.exports = Cart;
