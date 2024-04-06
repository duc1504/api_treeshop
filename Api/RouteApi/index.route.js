const userRoutes = require("./user.route");
const productRoutes = require("./product.route");
const cateRoutes = require("./category.route");
const cartRoutes = require("./cart.route");
const orderRoutes = require("./order.route");

module.exports = (app) => {
    app.use('/category', cateRoutes);
      app.use('/user', userRoutes);
     app.use('/product', productRoutes);
     app.use('/cart', cartRoutes);
     app.use('/order', orderRoutes);
 
};
