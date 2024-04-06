const mongoose = require("mongoose");

const cartDetailSchema = new mongoose.Schema({
  // cart_id: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Cart",
  //   required: true,
  // },
  cart_id: { type: String },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },

  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
});

const CartDetail = mongoose.model("CartDetail", cartDetailSchema,'cartdetail');

module.exports = CartDetail;
