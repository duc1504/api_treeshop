const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  // image: { type: String },
  description: { type: String },
  deleted: { type: Boolean, default: false },
  gallery: { type: [String] },
  category_id: { type: String },
  // thời gian
  // category_id: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
}, { timestamps: true }); // Thêm timestamps vào schema

const Product = mongoose.model("Product", productSchema, "products");

module.exports = Product;
