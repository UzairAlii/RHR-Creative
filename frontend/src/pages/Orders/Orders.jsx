import React, { useContext, useEffect, useState } from 'react';
import { shopContext } from '../../context/ShopContext';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

const statusMessages = {
  "Order Placed": "Your order was placed. It will take 2-3 business days for delivery.",
  "Packing": "Your order is being packed. It will be shipped soon.",
  "Out for Delivery": "Your order is out for delivery. Please keep your phone available.",
  "Delivered": "Your order has been delivered. Thank you for shopping with us!",
  "Cancelled": "Your order was cancelled. If this is a mistake, please contact support."
};

const Orders = () => {
  const { backendUrl, token, currency, APIproducts, showNotification } = useContext(shopContext);
  const [orderData, setOrderData] = useState([]);
  const [showReasonPopup, setShowReasonPopup] = useState(false);
  const [cancelOrderId, setCancelOrderId] = useState(null);
  const [selectedReason, setSelectedReason] = useState('');
  const [highlightAllTrack, setHighlightAllTrack] = useState(false);

  const reasons = [
    "I changed my mind",
    "Ordered by mistake",
    "Found a better price elsewhere",
    "Expected delivery is too late",
    "Other"
  ];

  const loadOrderData = async () => {
    try {
      if (!token) return;

      const response = await axios.post(`${backendUrl}/api/order/userorders`, {}, { headers: { token } });
      if (response.data.success) {
        const removedCancelledOrders = JSON.parse(localStorage.getItem('removedCancelledOrders')) || [];

        const allOrders = response.data.orders.map(order =>
          order.items.map(item => ({
            ...item,
            status: order.status,
            orderId: order._id,
            payment: order.payment,
            paymentMethod: order.paymentMethod,
            orderDate: new Date(order.date).toDateString(),
          }))
        ).flat();

        const filteredOrders = allOrders.filter(item =>
          !(item.status === "Cancelled" && removedCancelledOrders.includes(item.orderId))
        );

        setOrderData(filteredOrders.reverse());
      }
    } catch (error) {
      console.error('Error fetching order data:', error.message);
    }
  };

  const handleTrackOrder = async (orderId) => {
    try {
      const res = await axios.post(
        `${backendUrl}/api/order/userorders`,
        {},
        { headers: { token } }
      );
      if (res.data.success) {
        const allOrders = res.data.orders.map(order =>
          order.items.map(item => ({
            ...item,
            status: order.status,
            orderId: order._id,
            payment: order.payment,
            paymentMethod: order.paymentMethod,
            orderDate: new Date(order.date).toDateString(),
          }))
        ).flat();
        const trackedOrder = allOrders.find(item => item.orderId === orderId);
        if (trackedOrder) {
          showNotification(statusMessages[trackedOrder.status] || "Order status: " + trackedOrder.status);
          setOrderData(prev =>
            prev.map(item =>
              item.orderId === orderId ? { ...item, status: trackedOrder.status } : item
            )
          );
        } else {
          showNotification("Order not found.");
        }
      }
    } catch (err) {
      showNotification("Unable to track order at the moment.");
    }
  };


  useEffect(() => {
    loadOrderData();
  }, [token]);

  useEffect(() => {
    if (localStorage.getItem("highlightAllTrackOrder") === "1") {
      setHighlightAllTrack(true);
      setTimeout(() => {
        setHighlightAllTrack(false);
        localStorage.removeItem("highlightAllTrackOrder");
      }, 5000);
    }
  }, []);

  const getProductDetails = (productId) => {
    return APIproducts.find(p => p._id === productId);
  };

  const initiateCancel = (orderId) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      setCancelOrderId(orderId);
      setShowReasonPopup(true);
    }
  };

  const confirmCancelOrder = async () => {
    if (!selectedReason) {
      showNotification("Please select a cancellation reason");
      return;
    }

    try {
      const res = await axios.post(`${backendUrl}/api/order/cancel`, {
        orderId: cancelOrderId,
        reason: selectedReason
      }, {
        headers: { token }
      });

      if (res.data.success) {
        showNotification("Order cancelled successfully");
        setShowReasonPopup(false);
        setCancelOrderId(null);
        setSelectedReason("");
        loadOrderData();
      } else {
        showNotification(res.data.message || "Error cancelling order");
      }
    } catch (error) {
      showNotification(error.response?.data?.message || "Error cancelling order");
    }
  };

  if (orderData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center gap-6">
        <h1 className="text-3xl font-semibold">You have not ordered anything</h1>
        <p className="text-gray-600">Browse our collection and treat yourself!</p>
        <NavLink to="/collections">
          <button className="bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-900 transition-all">
            Return to Collections <FontAwesomeIcon className="ml-2 rotate-[-45deg]" icon={faArrowRight} />
          </button>
        </NavLink>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-10 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Your Orders</h1>
      <div className="space-y-6">
        {orderData.map((item, index) => {
          const product = getProductDetails(item.productId);
          const colorObj = product?.colorImages?.find(c => c.color.toLowerCase() === item.selectedColor?.toLowerCase());
          const imageSrc = colorObj?.images?.[0] || '/no-image.jpg';

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

          const convertedPrice = Math.round(finalPrice * (currency?.rate || 1));
          const totalPrice = convertedPrice * quantity;

          return (
            <div
              key={index}
              className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-5 hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-5 w-full md:w-auto">
                <img src={imageSrc} alt={product?.productName} className="w-24 object-cover rounded-lg" />
                <div className="flex flex-col gap-1">
                  <h2 className="text-lg font-semibold text-gray-800">{product?.productName || 'Product not found'}</h2>
                  <p className="text-sm text-gray-500">Color: <span className="capitalize">{item.selectedColor}</span></p>
                  <p className="text-sm text-gray-500">Quantity: {quantity}</p>
                  <p className="text-sm text-gray-500">Unit Price: {currency?.symbol || "₨"} {convertedPrice}</p>
                  <p className="text-sm text-gray-500">Order Date: {item.orderDate}</p>
                  <p className="text-sm text-gray-500">Payment Method: {item.paymentMethod}</p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2 w-full md:w-auto">
                <p className="text-sm text-gray-500 break-all">Order ID: <span className="font-mono">{item.orderId}</span></p>

                <span className={`text-sm font-medium ${item.status === 'Cancelled' ? 'text-red-500' : 'text-green-600'}`}>
                  {item.status}
                </span>
                <span className="text-sm text-gray-600">Total: <strong>{currency?.symbol || "₨"} {totalPrice.toLocaleString()}</strong></span>

                <div className="flex flex-col sm:flex-row gap-2 mt-2">
                  {item.status !== 'Cancelled' && (
                    <button
                      onClick={() => handleTrackOrder(item.orderId)}
                      className={`text-sm border border-gray-700 px-4 py-2 rounded-lg bg-white hover:bg-gray-100
      transition-all duration-700 ease-in-out
      ${highlightAllTrack ? 'bg-yellow-200 border-yellow-500 ring-2 ring-yellow-400' : ''}
    `}
                    >
                      Track Order
                    </button>
                  )}

                  {(item.status === 'Order Placed' || item.status === 'Packing') && (
                    <button
                      onClick={() => initiateCancel(item.orderId)}
                      className="text-sm border border-red-600 px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-all"
                    >
                      Cancel Order
                    </button>
                  )}

                  {item.status === 'Cancelled' && (
                    <button
                      onClick={() => {
                        const filteredOrders = orderData.filter((_, i) => i !== index);
                        setOrderData(filteredOrders.reverse());

                        const removed = JSON.parse(localStorage.getItem('removedCancelledOrders')) || [];
                        if (!removed.includes(item.orderId)) {
                          removed.push(item.orderId);
                          localStorage.setItem('removedCancelledOrders', JSON.stringify(removed));
                        }

                        showNotification("Order removed from your list");
                      }}
                      className="text-sm border border-gray-400 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-all"
                    >
                      Remove Order
                    </button>
                  )}

                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* 🔴 Reason Popup */}
      {showReasonPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl transform transition-transform scale-90 animate-popup w-[95%] max-w-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Cancel Order</h2>
            <p className="text-sm text-gray-600 mb-3">Please select a reason for cancelling this order:</p>

            <div className="space-y-3">
              {reasons.map((reason, idx) => (
                <label key={idx} className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg border border-gray-200">
                  <input
                    type="radio"
                    name="cancelReason"
                    value={reason}
                    checked={selectedReason === reason}
                    onChange={() => setSelectedReason(reason)}
                    className="accent-red-500"
                  />
                  <span className="text-gray-700 text-sm">{reason}</span>
                </label>
              ))}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowReasonPopup(false);
                  setSelectedReason('');
                  setCancelOrderId(null);
                }}
                className="px-4 py-2 text-sm text-gray-600 hover:underline"
              >
                Cancel
              </button>
              <button
                onClick={confirmCancelOrder}
                className="px-5 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Orders;
