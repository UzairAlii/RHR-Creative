import React, { useContext, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { shopContext } from '../context/ShopContext';
import { Link, NavLink } from 'react-router-dom';
import { Images } from '../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';

const CartViewer = ({ isCartViewerOpen, toggleCartViewer }) => {
  const { cartItems, setCartItems, APIproducts, currency, getCartAmount, backendUrl, token } = useContext(shopContext);

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

  // Quantity change handler
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


  if (!isCartViewerOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/30 z-[1001 ] transition-opacity duration-300 ${isCartViewerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={toggleCartViewer}
      ></div>
      {/* CartViewer Slide-in */}
      <div
        className={`fixed top-0 right-0 h-full z-[9999] bg-white shadow-2xl transition-transform duration-500 ease-in-out
                ${isCartViewerOpen ? 'translate-x-0' : 'translate-x-full'}
                w-[90%] lg:w-[40%] flex flex-col`}
        style={{ maxWidth: 480 }}
      >

        <div className="flex items-center justify-between p-6 border-b-[1px] border-[#0000006a]">
          <h2 className="text-xl font-normal">Just Added to Cart</h2>
          <button onClick={toggleCartViewer}>
            <img className='w-5' src={Images.cancel} alt="" />
          </button>
        </div>

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

        <div className="flex flex-col gap-3 px-6 pb-8 mt-auto">
          <div className='flex items-center justify-between py-3'>
            <p>
              Subtotal:&nbsp;
            </p>
            <p className='font-semibold'>{currency?.symbol || "₨"} {getCartAmount().toLocaleString()}</p>
          </div>
          <Link to={"/Checkout"}>
            <button disabled={cartData.length === 0} className={`w-full bg-black text-white py-2 sm:py-3 rounded mt-4 sm:mt-6 text-base font-semibold cursor-pointer ${cartData.length === 0 ? "opacity-60 cursor-not-allowed" : 'hover:bg-white hover:text-black hover:border-[1px]'}`}>
              Checkout Now
            </button>
          </Link>
          <NavLink to="/cart">
            <button className="w-full border border-black py-3 rounded text-base font-normal bg-white cursor-pointer">
              View My Cart {`(${cartData.length})`}
            </button>
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default CartViewer;