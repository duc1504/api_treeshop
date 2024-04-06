const express = require("express");
const router = express.Router();
const User = require("../Models/User.model");
const controller = require("../Controller/User.controller");

// Lấy thông tin người dùng dựa trên ID
// GET: http://localhost:5000/user/infor/:userId
router.get("/infor/:userId", controller.infor);

// Chỉnh sửa thông tin người dùng
// PATCH: http://localhost:5000/user/edit/:userId
router.patch("/edit/:userId", controller.edit);

// đăng kí
//   http://localhost:5000/user/signup
router.post("/signup", controller.signup);

// Đăng nhập
//   http://localhost:5000/user/login
router.post("/login", controller.login);

module.exports = router;
