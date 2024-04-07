const express = require("express");
const router = express.Router();
const Category = require("../Models/Category.model");
var cors = require('cors');
// Lấy danh sách các danh mục
//   http://localhost:5000/category
router.get("/",cors(), async (req, res) => {
    try {
        // Lấy tất cả các danh mục từ cơ sở dữ liệu
        const categories = await Category.find({}, { _id: 1, name: 1 });
        console.log(categories);
    
        // Trả về danh sách các danh mục
        res.status(200).json({status: true, categories});
    } catch (error) {
        res.status(500).json({status:false, message: "Đã xảy ra lỗi khi lấy danh sách danh mục", error });
    }
});

// suat thong tin 1 category
// PATCH: http://localhost:5000/category/edit/:categoryId
router.patch("/edit/:categoryId", async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        const updates = req.body;
       
        if (!categoryId || !Object.values(updates).every((value) => value !== "")) {
            res.status(404).json({
                status: false,
                message: "chưa thay đổi thong tin",
            });
        } else {
            // Cập nhật thong tin category trong cơ sở dữ liệu
            const result = await Category.updateOne({ _id: categoryId }, { $set: updates });
            // Kiểm tra xem có bản ghi nào được cap nhap khong
            if (result.nModified === 0) {
                return res.status(404).json({
                    status: false,
                    message: "Không tìm thấy category hoặc không có thong tin nào là thay đổi",
                });
            }
            // Trả về thong tin category da cap nhap thanh cong
            const updatedCategory = await Category.findById(categoryId);
            res.status(200).json({ status: true, category: updatedCategory });
        }
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Đã xảy ra lỗi khi thay đổi thong tin category",
            error,
        });
    } 

});

// them 1 category
// POST: http://localhost:5000/category
router.post("/", async (req, res) => {
    try {
        const newCategory = new Category(req.body);
        const result = await newCategory.save();
        res.status(200).json({ status: true, category: result });
    } catch (error) {
        res.status(500).json({ status: false, message: "Đã xảy ra lỗi khi them category", error });
    }
});


// xoa 1 category
// DELETE: http://localhost:5000/category/delete/:categoryId
router.delete("/delete/:categoryId", async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        if (!categoryId) {
            return res
                .status(404)
                .json({ status: false, message: "Không là này ID category" });
        }
        const result = await Category.deleteOne({ _id: categoryId });
        if (result.deletedCount === 0) {
            return res
                .status(404)
                .json({ status: false, message: "Không tìm thấy category" });
        }
        res.status(200).json({ status: true, message: "Đã xoá category" });
    } catch (error) {
        res
            .status(500)
            .json({
                status: false,
                message: "Đã xảy ra lỗi khi xoa category",
                error,
            });
    }
});




module.exports = router;
