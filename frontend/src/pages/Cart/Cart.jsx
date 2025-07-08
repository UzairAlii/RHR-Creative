import React, { useContext, useEffect, useState } from 'react';
import { shopContext } from '../../context/ShopContext';
import { Images } from '../../assets/assets';
import { Link, NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const Cart = () => {
  const { cartItems, setCartItems, APIproducts, currency, getCartAmount, getDeliveryFee, getCartTotal, backendUrl, token } = useContext(shopContext);

  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    if (APIproducts.length > 0) {

      const tempData = [];
      const allProducts = [...(APIproducts || [])];
      for (const itemId in cartItems) {
        for (const color in cartItems[itemId]) {
          for (const imageIndex in cartItems[itemId][color]) {
            const quantity = cartItems[itemId][color][imageIndex];
            if (quantity > 0) {
              const productData = allProducts.find((p) => p._id === itemId);
              if (productData) {
                tempData.push({
                  _id: itemId,
                  color,
                  imageIndex,
                  quantity,
                  productData,
                });
              }
            }
          }
        }
      }
      setCartData(tempData);
    }
  }, [cartItems, APIproducts]);

  const handleQuantityChange = async (item, delta) => {
    const { _id: itemId, color, imageIndex, quantity } = item;
    const newQuantity = quantity + delta;
    if (newQuantity < 1) return;

    setCartItems((prev) => {
      const updated = { ...prev };

      if (
        updated[itemId] &&
        updated[itemId][color] &&
        typeof updated[itemId][color][imageIndex] !== "undefined"
      ) {
        updated[itemId][color][imageIndex] = newQuantity; 
      }

      return updated;
    });

    if (token) {
      try {
        await axios.post(`${backendUrl}/api/cart/update`, {
          itemId,
          selectedColor: color,
          imageIndex,
          quantity: newQuantity,
        }, {
          headers: { token }
        });
      } catch (error) {
        console.log(error);
        toast.error("Quantity update failed");
      }
    }
  };


  const handleRemoveItem = async (item) => {
    const { _id: itemId, color, imageIndex } = item;

    setCartItems((prev) => {
      const updated = { ...prev };
      if (updated[itemId] && updated[itemId][color]) {
        delete updated[itemId][color][imageIndex];

        if (Object.keys(updated[itemId][color]).length === 0) delete updated[itemId][color];
        if (Object.keys(updated[itemId]).length === 0) delete updated[itemId];
      }
      return updated;
    });

    if (token) {
      try {
        const response = await axios.post(`${backendUrl}/api/cart/remove`, {
          itemId,
          selectedColor: color,
          imageIndex
        }, {
          headers: { token }
        });

        if (!response.data.success) {
          toast.error(response.data.message || "Failed to remove item");
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to remove item from cart");
      }
    }
  };


  return (
    <div className="bg-[#fafafa] min-h-screen py-4 px-1 sm:px-2 md:px-6 flex flex-col md:flex-row gap-6 md:gap-10 max-w-[1400px] mx-auto">
      {/* Left: Cart Items */}
      <div className="flex-1 bg-white rounded-lg shadow p-2 sm:p-4 md:p-6 w-full">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-center md:text-left">Your Cart ({cartData.length})</h2>
        {cartData.length > 0 ? (
          <div className="flex flex-col gap-6 py-8 px-6 overflow-y-auto flex-1">
            {cartData.map((item) => {
              const { productData, color, imageIndex } = item;
              const matchedColorObj = productData.colorImages?.find(
                (c) => c.color.toLowerCase() === color.toLowerCase()
              );
              const imageSrc = matchedColorObj?.images?.[imageIndex] || matchedColorObj?.images?.[0] || '';

              return (
                <div key={item._id + color + imageIndex} className="relative flex items-center gap-4 border-b-[1px] border-[#0000006a] pb-4">
                  <img
                    src={imageSrc}
                    alt={productData.productName}
                    className="w-30 h-50 object-contain rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="uppercase text-xs text-gray-400 mb-1">RHR Creative</div>
                    <div className="font-md text-base">{productData.productName}</div>

                    <div className="text-base font-medium mt-1">
                      {currency?.symbol || "₨"}
                      {(() => {
                        const price = productData.price;
                        const discountPercent = productData.discountPercent;
                        const wholesalePrice = productData.wholesalePrice;
                        const qty = item.quantity;

                        let discountedPrice = price;
                        if (discountPercent && !isNaN(discountPercent)) {
                          discountedPrice = Math.round(price - (price * discountPercent / 100));
                        }

                        let finalPrice = price;
                        if (qty >= 50 && wholesalePrice) {
                          finalPrice = wholesalePrice;
                        } else if (discountPercent) {
                          finalPrice = discountedPrice;
                        }

                        const converted = Math.round(finalPrice * (currency?.rate || 1));
                        return converted.toLocaleString();
                      })()}
                    </div>

                    <div className="text-sm text-gray-500 mt-1">
                      Color: <span className="capitalize">{color}</span>
                    </div>

                    <div className="flex items-center gap-2 mt-2 w-full justify-between">
                      <button
                        className="w-8 h-8 rounded-full border-[1px] border-[#00000068] flex items-center justify-center text-lg"
                        onClick={() => handleQuantityChange(item, -1)}
                      >
                        <img className='w-3' src={Images.minus} alt="" />
                      </button>
                      <span className="text-lg font-normal">{item.quantity}</span>
                      <button
                        className="w-8 h-8 rounded-full border-[1px] border-[#00000068] flex items-center justify-center text-lg"
                        onClick={() => handleQuantityChange(item, 1)}
                      >
                        <img className='w-3' src={Images.plus} alt="" />
                      </button>
                    </div>
                  </div>

                  <button
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-600 text-xl cursor-pointer"
                    title="Remove from cart"
                    onClick={() => handleRemoveItem(item)}
                  >
                    <img className='w-5' src={Images.cancel} alt="" />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 flex-1">
            <div className="text-lg text-gray-500">No item found in cart.</div>
          </div>
        )}
      </div>

      {/* Right: Order Summary */}
      <div className="w-full md:w-[350px] lg:w-[400px] bg-white rounded-lg shadow p-3 sm:p-4 md:p-6 h-fit mt-6 md:mt-0">
        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Order Summary</h2>

        <div className="flex justify-between items-center mb-1 sm:mb-2">
          <span className="text-gray-600 text-sm sm:text-base">Subtotal</span>
          <span className="font-semibold text-sm sm:text-base">{currency?.symbol || "₨"} {getCartAmount().toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center mb-2 sm:mb-4">
          <span className="text-gray-600 text-sm sm:text-base">Shipping</span>
          <span className="font-semibold text-green-600 text-sm sm:text-base">
            {currency?.symbol || "₨"} {getDeliveryFee().toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center border-t pt-3 mt-3">
          <span className="text-base sm:text-lg font-semibold">Total</span>
          <span className="font-semibold text-base sm:text-lg">
            {currency?.symbol || "₨"} {getCartTotal().toLocaleString()}
          </span>
        </div>
        <Link to={"/Checkout"}>
          <button disabled={cartData.length === 0} className={`w-full bg-black text-white py-2 sm:py-3 rounded mt-4 sm:mt-6 text-base font-semibold cursor-pointer ${cartData.length === 0 ? "opacity-60 cursor-not-allowed" : 'hover:bg-white hover:text-black hover:border-[1px]'}`}>
            Checkout Now
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Cart;