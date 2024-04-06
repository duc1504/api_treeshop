const express = require("express");
const router = express.Router();
const Cart = require("../Models/Cart.model");
const CartDetail = require("../Models/CartDetail.model");
const Order = require("../Models/Oder.model");

// Lấy các sản phẩm đã thêm vào giỏ hàng của người dùng
// GET: http://localhost:5000/cart/:userId
router.get("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId; // Lấy userId từ tham số trong URL
    // Tìm giỏ hàng của người dùng
    const cart = await Cart.findOne({ user_id: userId });

    // Nếu không tìm thấy giỏ hàng, trả về một mảng rỗng
    if (!cart) {
      return res.status(200).json({
        status: true,
        message: "Giỏ hàng của người dùng này hiện đang trống",
        products: [],
        totalPrice: 0 // Trả về tổng tiền là 0 nếu giỏ hàng trống
      });
    }

    // Lấy danh sách các sản phẩm đã thêm vào giỏ hàng của người dùng
    const cartDetails = await CartDetail.find({ cart_id: cart._id }).populate("product_id");

    // Tính tổng tiền của giỏ hàng
    let totalPrice = 0;
    cartDetails.forEach((item) => {
      totalPrice += item.product_id.price * item.quantity;
    });

    // Trả về danh sách các sản phẩm đã thêm vào giỏ hàng của người dùng và tổng tiền
    res.status(200).json({
      status: true,
      products: cartDetails,
      totalPrice: totalPrice.toFixed(2) // Làm tròn tổng tiền đến 2 chữ số sau dấu thập phân
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Đã xảy ra lỗi khi lấy thông tin giỏ hàng",
      error,
    });
  }
});

// Mua hàng
// POST: http://localhost:5000/cart/purchase/:userId
router.post("/purchase/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const shippingFee = req.body.shippingFee; 
    const selectedProducts = req.body.selectedProducts; 

    // Tìm giỏ hàng của người dùng
    const cart = await Cart.findOne({ user_id: userId });

    // Kiểm tra xem giỏ hàng có tồn tại không
    if (!cart) {
      return res.status(404).json({
        status: false,
        message: "Không tìm thấy giỏ hàng của người dùng",
      });
    }

    // Lấy danh sách sản phẩm trong giỏ hàng
    const cartDetails = await CartDetail.find({ cart_id: cart._id }).populate("product_id");

    // Kiểm tra xem có sản phẩm nào trong giỏ hàng không
    if (cartDetails.length === 0) {
      return res.status(400).json({
        status: false,
        message: "Không có sản phẩm nào trong giỏ hàng",
      });
    }

    // Tính tổng số tiền cần thanh toán
    let totalAmount = 0;
    cartDetails.forEach((item) => {
      totalAmount += item.product_id.price * item.quantity;
    });

    // Thêm phí vận chuyển vào tổng số tiền cần thanh toán
    totalAmount += shippingFee;

    // Xóa các sản phẩm đã chọn khỏi giỏ hàng (nếu cần)
    if (selectedProducts && selectedProducts.length > 0) {
      await CartDetail.deleteMany({ cart_id: cart._id, product_id: { $in: selectedProducts } });
    }

    // Tạo một đơn hàng mới
    const newOrder = new Order({
      user_id: userId,
      products: cartDetails.map(item => item.product_id),
      totalAmount: totalAmount,
      // Các trường thông tin khác về đơn hàng
    });
    await newOrder.save();

    // Cập nhật trạng thái giỏ hàng thành đã mua hàng
    cart.status = "completed";
    await cart.save();

    res.status(200).json({ status: true, message: "Đặt toán thành công", totalAmount, order: newOrder });
  } catch (error) {
    res.status(500).json({ status: false, message: "Đã xảy ra lỗi khi thanh toán", error });
  }
});


// Thêm sản phẩm vào giỏ hàng của người dùng
// POST: http://localhost:5000/cart/add
router.post("/add", async (req, res) => {
  const { userId, productId, quantity } = req.body;

  try {

    // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng của người dùng chưa
    let cart = await Cart.findOne({ user_id: userId });
    if (!cart) {
      // Nếu giỏ hàng chưa tồn tại, tạo mới giỏ hàng
      cart = new Cart({
        user_id: userId,
        date: new Date(),
        total: 0,
        status: "pending",
      });
      await cart.save();
      console.log(cart);
    }

    // Kiểm tra xem sản phẩm đã tồn tại trong chi tiết giỏ hàng chưa
    let cartDetail = await CartDetail.findOne({
      cart_id: cart._id,
      product_id: productId,
    });
    if (cartDetail) {
      // Nếu sản phẩm đã tồn tại trong chi tiết giỏ hàng, cập nhật số lượng
      cartDetail.quantity += quantity;
      await cartDetail.save();
    } else {
      // Nếu sản phẩm chưa tồn tại trong chi tiết giỏ hàng, thêm mới sản phẩm vào chi tiết giỏ hàng
      cartDetail = new CartDetail({
        cart_id: cart._id,
        product_id: productId,
        // price: 0,
        quantity,
      });
      await cartDetail.save();
    }
    // Trả về thông báo thành công
    res
      .status(200)
      .json({ status: true, message: "Sản phẩm đã được thêm vào giỏ hàng" });
  } catch (error) {
    res
      .status(500)
      .json({
        status: false,
        message: "Đã xảy ra lỗi khi thêm sản phẩm vào giỏ hàng",
        error,
      });
  }
});

// Xóa toàn bộ sản phẩm trong giỏ hàng của người dùng
// DELETE: http://localhost:5000/cart/delete/:userId
router.delete("/delete/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Tìm giỏ hàng của người dùng
    const cart = await Cart.findOne({ user_id: userId });
    
    // Kiểm tra xem giỏ hàng có tồn tại không
    if (!cart) {
      return res.status(404).json({
        status: false,
        message: "Không tìm thấy giỏ hàng của người dùng",
      });
    }
    
    // Xóa toàn bộ chi tiết giỏ hàng
    await CartDetail.deleteMany({ cart_id: cart._id });

    // Cập nhật trạng thái giỏ hàng thành trống
    cart.status = "empty";
    await cart.save();

    res.status(200).json({
      status: true,
      message: "Đã xóa toàn bộ sản phẩm trong giỏ hàng",
      
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Đã xảy ra lỗi khi xóa giỏ hàng",
      error,
    });
  }
});

// cập nhật sô lượng sản phẩm trong giỏ hàng
// PUT: http://localhost:5000/cart/update/:userId
router.put("/update/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const { productId, quantity } = req.body;

    // Tìm giỏ hàng của người dùng
    const cart = await Cart.findOne({ user_id: userId });
    if (!cart) {
      return res.status(404).json({
        status: false,
        message: "Không tìm thấy giỏ hàng của người dùng",
      });
    }

    // Tìm chi tiết giỏ hàng của người dùng
    const cartDetail = await CartDetail.findOne({
      cart_id: cart._id,
      product_id: productId,
    });
    if (!cartDetail) {
      return res.status(404).json({
        status: false,
        message: "Không tìm thấy chi tiết giỏ hàng của người dùng",
      });
    }

    // Kiểm tra nếu số lượng mới là 0, thì xóa sản phẩm khỏi giỏ hàng
    if (quantity === 0) {
      await CartDetail.deleteOne({ _id: cartDetail._id });
      return res.status(200).json({
        status: true,
        message: "Sản phẩm đã được xóa khỏi giỏ hàng",
      });
    }

    // Cập nhật số lượng sản phẩm trong giỏ hàng
    cartDetail.quantity = quantity;
    await cartDetail.save();
    
    res.status(200).json({
      status: true,
      message: "Đã cập nhật số lượng mua hàng",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Đã xảy ra lỗi khi cập nhật số lượng mua hàng",
      error,
    });
  }
});

// xóa một sản phẩm trong giỏ hàng
// DELETE: http://localhost:5000/cart/deleteone/:userId
// body { productId }
router.delete("/deleteone/:userId", async (req, res) => {

  try {
    const userId = req.params.userId;
    const { productId } = req.body;
    console.log('productid',productId)
    console.log('userId',userId)
    const cart = await Cart.findOne({ user_id: userId });
    if (!cart) {
      return res.status(404).json({
        status: false,
        message: "Không tìm thấy giỏ hãng của người dùng",
      });
    }
    const cartDetail = await CartDetail.findOne({
      cart_id: cart._id,
      product_id: productId,
    });
    if (!cartDetail) {
      return res.status(404).json({
        status: false,
        message: "Không tìm thấy chi tiết giỏ hãng của người dùng",
      });
    }
    await CartDetail.deleteOne({ _id: cartDetail._id });
    res.status(200).json({
      status: true,
      message: "Đã xóa sản phẩm trong giờ hãng",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Đã xảy ra lỗi khi xóa sản phẩm trong giờ hãng",
      error,
    });
  }
});


module.exports = router;
