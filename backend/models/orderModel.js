import mongoose from "mongoose"

const orderSchema = mongoose.Schema({
    userId: { type: String, required: true },
    items: { type: Array, required: true },
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    currency: { type: String, required: true },  
    deliveryFee: { type: Number, required: true },
    status: { type: String, required: true, default: "Order Placed" },
    cancellationReason: { type: String, default: null },
    originalOrderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", default: null },
    paymentMethod: { type: String, required: true },
    payment: { type: Boolean, required: true, default: false },
    date: { type: Number, required: true },
})

const orderModel = mongoose.models.order || mongoose.model("Order", orderSchema)

export default orderModel