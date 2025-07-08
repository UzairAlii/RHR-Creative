import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { currency, backendUrl } from '../App';
import axios from 'axios';

const OrderDetails = ({ token }) => {
  const { userId: orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userOrdersTotal, setUserOrdersTotal] = useState(null);
  const [productDetails, setProductDetails] = useState({});

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/order/single/${orderId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data.success) {
          setOrder(response.data.order);
          const userId = response.data.order.userId;
          if (userId) {
            const userOrdersRes = await axios.post(
              `${backendUrl}/api/order/userorders`,
              { userId },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            if (userOrdersRes.data.success) {
              const total = userOrdersRes.data.orders
                .filter(o => o.userId === userId)
                .reduce((sum, o) => sum + (o.amount || 0), 0);
              setUserOrdersTotal(total);
            }
          }

          const items = response.data.order.items || [];
          const uniqueProductIds = [...new Set(items.map(i => i.productId))];
          const details = {};
          await Promise.all(
            uniqueProductIds.map(async (pid) => {
              try {
                const res = await axios.post(
                  `${backendUrl}/api/product/single`,
                  { id: pid }
                );
                if (res.data.success && res.data.product) {
                  details[pid] = {
                    name: res.data.product.productName,
                    image: res.data.product.colorImages?.[0]?.images?.[0] || "",
                  };
                }
              } catch { }
            })
          );
          setProductDetails(details);
        } else {
          setOrder(null);
        }
      } catch (error) {
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId, token]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!order) return <div className="p-8 text-center text-red-500">No order found.</div>;

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto">
      {order.status === "Cancelled" && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded font-semibold">
          <p>This order was cancelled by {order.address?.firstName} {order.address?.lastName}</p>
          <p>{order.cancellationReason && <> Reason: {order.cancellationReason}</>}</p>
        </div>
      )}
      <h2 className="text-2xl font-bold mb-4">Order Details</h2>
      <div className="mb-6">
        <div className="font-semibold">Order ID: <span className="font-normal">{order._id}</span></div>
        <div className="font-semibold">Status: <span className={`font-normal ${order.status === "Cancelled" ? "text-red-600" : "text-green-600"}`}>{order.status}</span></div>
        <div className="font-semibold">Date: <span className="font-normal">{new Date(order.date).toLocaleString()}</span></div>
        <div className="font-semibold">Payment Method: <span className="font-normal">{order.paymentMethod}</span></div>
        <div className="font-semibold">Payment: <span className="font-normal">{order.payment ? "Paid" : "Pending"}</span></div>
      </div>

      <h3 className="text-lg font-semibold mb-2">Ordered Products</h3>
      <div className="border rounded-lg p-4 mb-6">
        {order.items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-4 border-b pb-4 last:border-b-0 mb-4 last:mb-0">
            <div className="w-16 h-16 bg-gray-100 flex items-center justify-center rounded">
              {item.image ? (
                <img src={item.image} alt={item.productName || 'Product'} className="w-full h-full object-cover rounded" />
              ) : (
                <span className="text-gray-400 text-xs">No Image</span>
              )}
            </div>
            <div className="flex-1">
              <div className="font-semibold">{item.productName || 'N/A'}</div>
              <div className="text-xs text-gray-600">Color: {item.selectedColor || 'N/A'}</div>
              <div className="text-xs text-gray-600">Quantity: {item.quantity}</div>
              <div className="text-xs text-gray-600">
                Total: {currency}
                {(() => {
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
                  const totalPrice = finalPrice * quantity;
                  return totalPrice.toLocaleString();
                })()}
              </div>
            </div>
          </div>
        ))}
      </div>

      <h3 className="text-lg font-semibold mb-2">Customer Details</h3>
      <div className="border rounded-lg p-4 mb-6">
        <div><b>Name:</b> {order.address?.firstName} {order.address?.lastName}</div>
        <div><b>Email:</b> {order.address?.email}</div>
        <div><b>Phone:</b> {order.address?.mobile}</div>
        <div><b>Country:</b> {order.address?.country}</div>        
        <div><b>State:</b> {order.address?.state}</div>             
        <div><b>City:</b> {order.address?.city}</div>
        <div><b>Zip Code:</b> {order.address?.zip}</div>
        <div><b>Address:</b> {order.address?.address1} {order.address?.address2}</div>
      </div>

      <div className="text-right font-semibold text-base mb-1">
        Products Total: {order.currency || currency}{order.amount?.toLocaleString()}
      </div>
      <div className="text-right font-semibold text-base mb-1">
        Delivery Fee: {order.currency || currency}{order.deliveryFee?.toLocaleString()}
      </div>
      <div className="text-right font-semibold text-lg mb-2">
        Grand Total: {order.currency || currency}
        {(Number(order.amount || 0) + Number(order.deliveryFee || 0)).toLocaleString()}
      </div>
      {userOrdersTotal !== null && (
        <div className="text-right font-semibold text-base text-blue-700">
          This user's all orders total: {order.currency || currency}{userOrdersTotal}
        </div>
      )}
    </div>
  );
};

export default OrderDetails;