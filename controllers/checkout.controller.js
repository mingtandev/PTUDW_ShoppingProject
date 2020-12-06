const User = require("./../models/user.model");
const Cart = require("./../models/cart.model");
const Checkout = require("./../models/checkout.model");

const { postSignUp } = require("./user.controller");

const { initCart } = require("./../utils/constant");

module.exports.getCheckout = async (req, res, next) => {
  const { user } = req;

  res.render("pages/checkout", {
    msg: "success",
    user: "Page checkout loaded!",
    user: user || {},
  });
};

module.exports.postCheckout = async (req, res, next) => {
  const { user, body } = req;

  try {
    if (!user) {
      await postSignUp(req, res, next);
    }

    console.log(req.body);

    const cart = await Cart.findOne({ userId: user._id, status: "waiting" });

    const { userId, _id, status, items, totalQuantity, totalCost } = cart;
    const { address, city, district, phone, firstName, lastName } = body;

    body.phone = user.phone;
    body.email = user.email;

    // check if 2 add diff

    const shippingFee = 25000;

    const checkoutObj = {
      userId,
      cartId: _id,
      status,
      items,
      totalQuantity,
      totalCost,
      address,
      city,
      district,
      phone,
      receiver: firstName + " " + lastName,
      shippingFee,
      paymentMethod: "cod",
      totalPayment: parseInt(totalCost) + shippingFee,
    };

    const checkout = new Checkout(checkoutObj);
    cart.status = "staging";
    await Promise.all([
      checkout.save(),
      cart.save(),
      User.updateOne({ _id: user._id }, { $set: body }),
    ]);

    console.log(checkout);
    req.session.checkout = checkout;
    req.session.cart = initCart;

    res.redirect("/user/account/dashboard");
    // res.render("pages/dashboard", {
    //   // render page thong tin dat hang
    //   msg: "success",
    //   user: "Cart checkout successful!",
    //   data: checkout,
    // });
  } catch (error) {
    console.log(error);
    res.render("error", {
      msg: error.message,
      error,
    });
  }
};

// AJAX
module.exports.getCheckoutHistory = async (req, res, next) => {
  const { id } = req.params;

  try {
    const checkout = await Checkout.findById(id);

    res.status(200).json({
      msg: "success",
      data: checkout,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      msg: error.message,
      error,
    });
  }
};

// AJAX
module.exports.patchUpdate = async (req, res, next) => {
  const checkoutStatus = [
    "waiting",
    "confirmed",
    "transferring",
    "delivered",
    "canceled",
  ];
  const { checkoutId } = req.params;
  const { status } = req.body;

  try {
    if (!checkoutStatus.includes(status))
      throw new Error(
        `Invalid status! Status must be 'waiting', 'confirmed', 'transferring', 'delivered' or 'canceled'! `
      );

    const checkout = await Checkout.findById(checkoutId);
    if (!checkout) throw new Error("Cart checkout not found!");
    checkout.status = status;
    await checkout.save();

    res.status(200).json({
      msg: "success",
      user: "Update status successful!",
    });
  } catch (error) {
    console.log(error);
    res.status(205).json({
      msg: "ValidatorError",
      user: error.message,
    });
  }
};
