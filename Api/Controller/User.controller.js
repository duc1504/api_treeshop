const User = require("../Models/User.model");
var bcryptjs = require('bcryptjs');
const { sendEmail } = require("../../helpers/Mailer");


// Lấy thông tin người dùng dựa trên ID
// GET: http://localhost:6000/user/infor/:userId
module.exports.infor = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Tìm người dùng trong cơ sở dữ liệu
    const user = await User.findById(userId);

    // Kiểm tra xem người dùng có tồn tại không
    if (!user) {
      return res
        .status(404)
        .json({ status: false, message: "Không tìm thấy người dùng" });
    }
    // Trả về thông tin của người dùng
    res.status(200).json({ status: true, user: user });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Đã xảy ra lỗi khi lấy thông tin người dùng",
      error,
    });
  }
};

// Chỉnh sửa thông tin người dùng
// PATCH: http://localhost:6000/user/edit/:userId

module.exports.edit = async (req, res) => {
  try {
    const userId = req.params.userId;
    const updates = req.body;

    // Kiểm tra xem numberMobile hoặc email đã tồn tại trong cơ sở dữ liệu chưa
    const existingUser = await User.findOne({
      $or: [{ numberMobile: updates.numberMobile }, { email: updates.email }],
      _id: { $ne: userId } // Đảm bảo không so sánh với chính bản ghi người dùng đang chỉnh sửa
    });
  
    if (existingUser) {
      return res.status(400).json({
        status: false,
        message: 'Số điện thoại hoặc email đã tồn tại trong hệ thống'
      });
    }

    // Cập nhật thông tin người dùng trong cơ sở dữ liệu
    const result = await User.updateOne({ _id: userId }, { $set: updates });

    // Kiểm tra xem có bản ghi nào được cập nhật không
    if (result.nModified === 0) {
      return res.status(404).json({
        status: false,
        message: 'Không tìm thấy người dùng hoặc không có thông tin nào được cập nhật'
      });
    }

    // Truy vấn lại thông tin người dùng từ cơ sở dữ liệu
    const updatedUser = await User.findById(userId, '-password');

    // Trả về thông tin người dùng đã được cập nhật
    res.status(200).json({ status: true, data: updatedUser });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Đã xảy ra lỗi khi chỉnh sửa thông tin người dùng',
      error
    });
  }
};

// đăng kí
//   http://localhost:6000/user/signup
module.exports.signup = async (req, res) => {
  try {
    const { name, email, password, numberMobile } = req.body;
    // kiem tra rong
    if (!name || !email || !password || !numberMobile) {
      return res
        .status(400)
        .json({ status: false, message: "Vui long nhap day du thong tin" });
    }
    //validate email
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(String(email).toLowerCase())) {
      return res
        .status(400)
        .json({ status: false, message: "Email không hợp lệ" });
    }
    //validate password
    if (password.length < 6) {
      return res
        .status(400)
        .json({ status: false, message: "Password phải là 6 kiểu" });
    }
    // validate name
    if (name.length < 6) {
      return res
        .status(400)
        .json({ status: false, message: "Name phải là 6 kiểu" });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { numberMobile }],
    });
    if (existingUser) {
      return res.status(400).json({ status: "exisuser" });
    }
    // Tạo người dùng mới
    // sử dụng bcryptjs mã hóa password
    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(password, salt);
    const newUser = new User({ name, email, password:hashPassword, numberMobile });
    await newUser.save();
    // gửi email bằng nodemailer
    setTimeout(async () => {
      const data = {
        name: name,
        email: email,
        subject: "Cảm ơn bạn đã đăng kí",
      }
      await sendEmail(data);
    },0)
    res.status(201).json({ status: true,data:newUser });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Đã xảy ra lỗi khi đăng ký người dùng", error });
  }
};

// Đăng nhập
//   http://localhost:6000/user/login
module.exports.login = async (req, res) => {
  try {
    const { emailOrMobile, password } = req.body;
    console.log(emailOrMobile, password);
    if (!emailOrMobile || !password) {
      return res
        .status(404)
        .json({ status: false, message: "Không được để trống" });
    }
    // validate email
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(String(emailOrMobile).toLowerCase())) {
      return res
        .status(400)
        .json({ status: false, message: "Email không hợp lệ" });
    }
    // validate password
    if (password.length < 6) {
      return res
        .status(400)
        .json({ status: false, message: "Password phải là 6 kiểu" });
    }

    // Tìm người dùng theo email hoặc số điện thoại
    const user = await User.findOne({
      $or: [{ email: emailOrMobile }, { numberMobile: emailOrMobile }],
    });
    // Kiểm tra xem người dùng có tồn tại không
    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }
    // Kiểm tra mật khẩu bằng bcryptjs
    const isValidPassword = await bcryptjs.compare(password, user.password);
    if (!isValidPassword) {
      return res
        .status(401)
        .json({ status: false, message: "Password is incorrect" });
    }
    //trả về data là user nhưng không có password
    const data = {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      address: user.address,
      numberMobile: user.numberMobile,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
    // Đăng nhập thành công
    res.status(200).json({ status: true, data });
  } catch (error) {
    res.status(500).json({ status: false, message: "lỗi", error });
  }
};

// Xóa người dùng
//   http://localhost:6000/user/delete/:userId
module.exports.delete = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res
        .status(404)
        .json({ status: false, message: "Không là này ID người dùng" });
    }
    const result = await User.deleteOne({ _id: userId });
    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ status: false, message: "Không tìm thấy người dùng" });
    }
    res.status(200).json({ status: true, message: "Đã xoá người dùng" });
  } catch (error) {
    res
      .status(500)
      .json({
        status: false,
        message: "Đã xảy ra lỗi khi xoa người dùng",
        error,
      });
  }
};
