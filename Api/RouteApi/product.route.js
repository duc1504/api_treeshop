const express = require("express");
const router = express.Router();
const Product = require("../Models/Product.model");

// Lấy chi tiết sản phẩm dựa trên ID
// GET: http://localhost:5000/product/detail/:productId
router.get("/detail/:productId", async (req, res) => {
  try {
    const productId = req.params.productId;
    // Tìm sản phẩm trong database
    const product = await Product.findById(productId);

    // Nếu không tìm thấy sản phẩm, trả về một thông báo lỗi
    if (!product) {
      return res
        .status(404)
        .json({ status: false, message: "Không tìm thấy sản phẩm" });
    }
    // Trả về thông tin chi tiết của sản phẩm
    res.status(200).json({ status: true, product });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Đã xảy ra lỗi khi lấy thông tin chi tiết sản phẩm",
      error,
    });
  }
});

// Tìm kiếm sản phẩm theo tên
// GET: http://localhost:5000/product/search?name=:productName
router.get("/search", async (req, res) => {
  try {
    const productName = req.query.name;
    // Kiểm tra nếu không có query.name được cung cấp
    if (!productName) {
      // Trả về một mảng rỗng
      return res.status(200).json({ status: true, products: [] });
    }
    // Tìm kiếm sản phẩm trong cơ sở dữ liệu
    const products = await Product.find({
      name: { $regex: new RegExp(productName, "i") },
    });

    // Trả về danh sách sản phẩm (có thể là mảng rỗng)
    res.status(200).json({ status: true, products });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Đã xảy ra lỗi khi tìm kiếm sản phẩm",
      error,
    });
  }
});

// Lấy tất cả các sản phẩm
// GET: http://localhost:5000/product
router.get("/", async (req, res) => {
  try {
    // lấy tất cả sản phẩm có deteted = false và sort theo createdAt
    const products = await Product.find({ deleted: false });
    // const products = await Product.find({ deleted: false });
    // Trả về danh sách các sản phẩm
    res.status(200).json({ status: true, products });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Đã xảy ra lỗi khi lấy danh sách sản phẩm",
      error,
    });
  }
});

// Lấy tất cả các sản phẩm dựa trên category_id
// GET  http://localhost:5000/product/category/:categoryId
router.get("/category/:categoryId", async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    // nếu không có category_id trả về toàn bộ sản phẩm
    if (!categoryId) {
      const products = await Product.find({});
      res.status(200).json({ status: true, products });
    }
    // Tìm kiếm này trong database
    const products = await Product.find({ category_id: categoryId });
    // Kiểm tra nếu không có sản phẩm, trả về status: false
    if (products.length === 0) {
      return res.status(200).json({ status: false });
    }
    // Trả về danh sách các sản phẩm dựa trên category_id
    res.status(200).json({ status: true, products });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Đã xảy ra lỗi khi lấy danh sách sản phẩm theo danh mục",
      error,
    });
  }
});

// Thêm sản phẩm mới
// POST: http://localhost:5000/product/add
router.post("/add", async (req, res) => {
  try {
    const { name, price, quantity, description, gallery, category_id } =
      req.body;
    // Kiểm tra thông tin đầu vào
    if (
      !name ||
      !price ||
      !quantity ||
      !description ||
      !gallery ||
      !category_id
    ) {
      return res.status(400).json({
        status: false,
        message: "Thiếu thông tin sản phẩm",
      });
    }
    // kiểm tra price và quantity phải là số và lớn hơn 0
    if (isNaN(price) || isNaN(quantity) || price <= 0 || quantity <= 0) {
      return res.status(400).json({
        status: false,
        message: "Giá và số lượng phải là số và lớn hơn 0",
      });
    }

    // Tạo sản phẩm mới
    const newProduct = new Product({
      name,
      price,
      quantity,
      description,
      gallery,
      category_id,
    });
    await newProduct.save();

    res.status(201).json({ status: true, message: "Thêm sản phẩm thành công" });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Đã xảy ra lỗi khi thêm sản phẩm",
      error,
    });
  }
});

// Sửa thông tin sản phẩm
// PATCH: http://localhost:5000/product/edit/:productId
router.patch("/edit/:productId", async (req, res) => {
  try {
    const productId = req.params.productId;
    const updates = req.body;
    console.log(updates.quantity);
    // Kiểm tra xem ID này không hợp lệ hay không
    if (!productId) {
      return res.status(400).json({
        status: false,
        message: "Id không hợp lệ, vui lòng nhập lại",
      });
    }
    // validate nếu updates có trường quantity hoặc price thì phải là số và lớn hơn 0
    if (isNaN(updates.price) || updates.price <= 0 || isNaN(updates.quantity) || updates.quantity <= 0) {
      console.log('looi nè');
      return res.status(400).json({
        status: false,
        message: "Giá và số lưới phải là số và lớn hơn 0",
        
      });
    }
    // Cập nhật thông tin sản phẩm trong cơ sở dữ liệu
    const result = await Product.updateOne(
      { _id: productId },
      { $set: updates }
    );
    // Kiểm tra xem có bản ghi nào được cập nhật không
    if (result.nModified === 0) {
      return res.status(404).json({
        status: false,
        message:
          "Không tìm thấy sản phẩm hoặc không có thông tin nào được cập nhật",
      });
    }
    // Trả về thông báo thành công
    res.status(200).json({
      status: true,
      message: "Cập nhật thông tin sản phẩm thành công",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Đã xảy ra lỗi khi cập nhật thông tin sản phẩm",
      error,
    });
  }
});

// Xóa sản phẩm
// DELETE: http://localhost:5000/product/delete/:productId
router.delete("/delete/:productId", async (req, res) => {
  try {
    const productId = req.params.productId;
    // Kiểm tra xem ID sản phẩm hợp lệ hay không
    if (!productId) {
      return res
        .status(400)
        .json({ status: false, message: "ID sản phẩm không hợp lệ" });
    }
    await Product.deleteOne({ _id: productId });
    // Trả về thông báo thành công
    res.status(200).json({
      status: true,
      message: "Sản phẩm đã được xóa khỏi cơ sở dữ liệu",
    });
  } catch (error) {
    // Đã xảy ra lỗi khi xóa sản phẩm
    res.status(500).json({
      status: false,
      message: "Đã xảy ra lỗi khi xóa sản phẩm",
      error,
    });
  }
});

module.exports = router;
