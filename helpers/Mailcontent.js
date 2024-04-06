const inlineCss = require('inline-css');

const htmlText = (name, email) => {
    return `
    
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Đăng ký thành công</title>
      <!-- Bootstrap CSS -->
     <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
      <style>
        /* Custom CSS */
        body {
          background-color: #f8f9fa;
          font-family: Arial, sans-serif;
        }
        .card {
          border: none;
          border-radius: 10px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .card-header {
          background-color: #007bff;
          color: #fff;
          border-radius: 10px 10px 0 0;
        }
        .card-body {
          padding: 30px;
        }
        .card-text {
          font-size: 16px;
          line-height: 1.6;
        }
        .btn {
          background-color: #007bff;
          color: #fff;
          border-radius: 25px;
          padding: 10px 20px;
          text-decoration: none;
          transition: background-color 0.3s;
        }
        .btn:hover {
          background-color: #0056b3;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="row">
          <div class="col-md-8 offset-md-2">
            <div class="card mt-5">
              <div class="card-header">
                <h3 class="text-center mb-0">Đăng ký thành công</h3>
              </div>
              <div class="card-body">
                <p class="card-text">Xin chào <strong>${name}</strong>,</p>
                <p class="card-text">Chúc mừng bạn đã đăng ký thành công tài khoản tại <strong>Tree Shop</strong>. Bây giờ bạn đã có thể truy cập vào tài khoản của mình và bắt đầu sử dụng dịch vụ của chúng tôi.</p>
                <p class="card-text">Nếu bạn có bất kỳ câu hỏi hoặc cần hỗ trợ, vui lòng liên hệ với chúng tôi qua email: <strong>ngocduc2k4@gmail.com</strong>.</p>
                <p class="card-text">Trân trọng,</p>
                <p class="card-text">Công ty TNHH <b>Tree Shop</b></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
    
    
    
    `
}

module.exports = htmlText;
