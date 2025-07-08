import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import sendUserMail from "../helpers/sendUserMail.js";

// Order by COD 

const placeOrderCOD = async (req, res) => {
  try {
    const userId = req.userId;
    const { items, address, currency, deliveryFee } = req.body;

    if (!currency) {
      return res.json({ success: false, message: "currency is not defined" });
    }
    if (!userId) {
      return res.json({ success: false, message: "User not authenticated" });
    }

    let amount = 0;
    for (const item of items) {
      const basePrice = item.price || 0;
      const discount = item.discountPercent || 0;
      const wholesalePrice = item.wholesalePrice || 0;
      const quantity = item.quantity || 1;

      let finalPrice = basePrice;
      if (quantity >= 50 && wholesalePrice) {
        finalPrice = wholesalePrice;
      } else if (discount) {
        finalPrice = Math.round(basePrice - (basePrice * discount) / 100);
      }
      amount += finalPrice * quantity;
    }

    const orderdata = {
      userId,
      items,
      amount,
      address,
      currency,
      deliveryFee,
      paymentMethod: "COD",
      payment: false,
      date: Date.now()
    };

    const newOrder = new orderModel(orderdata);
    await newOrder.save();

    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    const user = await userModel.findById(userId);
    await sendUserMail(
      user.email,
      "Your Order Has Been Placed - RHR Creative",
      `<p>Dear ${user.name},</p>
   <p>Your order has been successfully placed.</p>
   <p><b>Amount:</b> ${orderdata.amount} ${currency}</p>
   <p><b>Delivery Fee:</b> ${deliveryFee}</p>
   <p><b>Payment Method:</b> Cash on Delivery</p>
   <p>We will notify you once your order is shipped.</p>
   <p>Thank you for shopping with RHR Creative!</p>`
    );

    res.json({ success: true, message: "Order Placed Successfully" });

  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// All orders data for admin panel

const AllOrders = async (req, res) => {

  try {

    const orders = await orderModel.find({});

    res.json({ success: true, orders });

  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }

}

// All orders for frontend user

const userOrders = async (req, res) => {

  try {

    const userId = req.userId;

    const orders = await orderModel.find({ userId });

    res.json({ success: true, orders });

  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });

  }

}

// Update Order Status
const orderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    if (!orderId || !status) {
      return res.status(400).json({ success: false, message: "Order ID and status are required" });
    }

    const validStatuses = ["Order Placed", "Packing", "Out for Delivery", "Delivered"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    const updatedOrder = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    const user = await userModel.findById(updatedOrder.userId);
    await sendUserMail(
      user.email,
      "Order Status Updated - RHR Creative",
      `<p>Dear ${user.name},</p>
   <p>The status of your order has been updated to: <b>${status}</b>.</p>
   <p>We’ll keep you posted on further updates.</p>
   <p>Thank you for your patience!</p>`
    );


    res.json({ success: true, message: "Status updated successfully", order: updatedOrder });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Cancel Order Controller
const cancelOrder = async (req, res) => {
  try {
    const { orderId, reason } = req.body;
    const userId = req.userId;

    if (!orderId || !reason) {
      return res.status(400).json({ success: false, message: "Order ID and reason required" });
    }

    const order = await orderModel.findById(orderId);

    if (!order || order.userId.toString() !== userId) {
      return res.status(404).json({ success: false, message: "Order not found or unauthorized" });
    }

    const updatedOrder = await orderModel.findByIdAndUpdate(
      orderId,
      {
        status: "Cancelled",
        cancellationReason: reason
      },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    const user = await userModel.findById(userId);
    await sendUserMail(
      user.email,
      "Order Cancelled - RHR Creative",
      `<p>Dear ${user.name},</p>
   <p>Your order has been successfully <b>cancelled</b>.</p>
   <p><b>Reason:</b> ${reason}</p>
   <p>If this was a mistake, feel free to place a new order.</p>
   <p>We hope to serve you again!</p>`
    );


    res.json({ success: true, message: "Order cancelled successfully", order: updatedOrder });

  } catch (error) {
    console.log("Cancel error:", error.message);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};



export { placeOrderCOD, AllOrders, userOrders, orderStatus, cancelOrder }

