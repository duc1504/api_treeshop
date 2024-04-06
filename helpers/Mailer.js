const nodemailer = require("nodemailer");
const Mailcontent = require("./Mailcontent");

// gmail: thuylinh.210705@gmail.com
// password: ovoi aryi udjk yewj

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: "thuylinh.210705@gmail.com",
      pass: "ovoiaryiudjkyewj",
    },
  });

  const sendEmail = async (data) => {
    const { name, email, subject, content } = data;
    const options = {
      from: '"Tree Shop" <thuylinh.210705@gmail.com>',
      to: email, 
      subject: subject,
      html: Mailcontent(name, email),
    };
  
    try {
      await transporter.sendMail(options);
      console.log("Email sent successfully");
      return true;
    } catch (error) {
      console.error("Error sending email:", error);
      return false;
    }
  };
  
  module.exports = { sendEmail }