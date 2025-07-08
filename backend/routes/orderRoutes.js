import express from "express";

import { placeOrderCOD, AllOrders, userOrders, orderStatus, cancelOrder } from "../controllers/orderController.js";
import adminAuth from "../middleware/adminAuth.js";
import Authuser from "../middleware/Auth.js";
import orderModel from "../models/orderModel.js";

const orderRouter = express.Router();

//ADMIN FEATURES

orderRouter.post("/list", adminAuth, AllOrders);
orderRouter.post("/status", adminAuth, orderStatus);
orderRouter.post("/cancel", Authuser, cancelOrder);

orderRouter.get("/single/:orderId", adminAuth, async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});



//PAYMENT ROUTES

orderRouter.post("/COD", Authuser, placeOrderCOD);

//USER FEATURES

orderRouter.post("/userorders", Authuser, userOrders);

export default orderRouter;

