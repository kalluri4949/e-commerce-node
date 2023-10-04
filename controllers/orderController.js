const Product = require('../models/Product');
const Order = require('../models/Order');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { checkUserHasPermissions } = require('../utils');

const fakeStripeApi = async ({ amount, currency }) => {
  const client_secret = 'somerandom';
  return {
    amount,
    client_secret,
  };
};

const createOrder = async (req, res) => {
  const { items: cartItems, tax, shippingFee } = req.body;

  if (!cartItems || cartItems.length < 1) {
    throw new CustomError.BadRequestError(`No cart items provided`);
  }

  if (!shippingFee || !tax) {
    throw new CustomError.BadRequestError(
      `Please provide tax and shipping fee`
    );
  }

  let orderItems = [];
  let subtotal = 0;

  for (const item of cartItems) {
    const dbProduct = await Product.findOne({ _id: item.product });
    if (!dbProduct) {
      throw new CustomError.NotFoundError(
        `No product found with id: ${item.product}`
      );
    }
    const { name, price, image, _id } = dbProduct;
    // console.log(name, price, image, _id);

    const singleOrderItem = {
      name,
      price,
      amount: item.amount,
      product: _id,
      image,
    };

    orderItems = [...orderItems, singleOrderItem];
    subtotal += item.amount * price;

    console.log(orderItems, subtotal);
  }

  // cal total
  const total = tax + shippingFee + subtotal;

  // get client secret
  const paymentIntent = await fakeStripeApi({
    amount: total,
    currency: 'usd',
  });

  //create order
  const order = await Order.create({
    orderItems,
    total,
    subtotal,
    tax,
    shippingFee,
    clientSecret: paymentIntent.client_secret,
    user: req.user.userId,
  });
  res.status(StatusCodes.CREATED).json({
    order,
    clientSecret: order.clientSecret,
  });
};

const getAllOrders = async (req, res) => {
  const orders = await Order.find({});
  res.status(StatusCodes.OK).json({ orders, count: orders.length });
};

const getSingleOrder = async (req, res) => {
  const { id: orderId } = req.params;

  const order = await Order.findOne({ _id: orderId });

  if (!order) {
    throw new CustomError.NotFoundError(`No order with id: ${orderId}`);
  }

  checkUserHasPermissions(req.user, order.user);
  res.status(StatusCodes.OK).json({ order });
};

const getCurrentUserOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user.userId });
  res.status(StatusCodes.OK).json({ orders, count: orders.length });
};

const updateOrder = async (req, res) => {
  const { id: orderId } = req.params;
  const { paymentIntentId } = req.body;

  const order = await Order.findOne({ _id: orderId });

  if (!order) {
    throw new CustomError.NotFoundError(`No order with id: ${orderId}`);
  }

  checkUserHasPermissions(req.user, order.user);

  order.paymentIntentId = paymentIntentId;
  order.status = 'paid';
  await order.save();

  res.status(StatusCodes.OK).json({ order });
};

module.exports = {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
};
