import React, { useContext, useEffect, useState } from 'react'
import { shopContext } from '../context/ShopContext'
import ProductItem from './ProductItem'
import { Images } from '../assets/assets'

const Favourites = ({ isOpen = true, onClose = () => {}, isPopup = true }) => {
  const { favourites, APIproducts } = useContext(shopContext)
  const allProducts = [...(APIproducts || [])]
  const favProducts = allProducts.filter(item => favourites.includes(item._id))

  const [show, setShow] = useState(false)

  useEffect(() => {
    if (isPopup) {
      if (isOpen) {
        setShow(true)
      } else {
        setTimeout(() => setShow(false), 350)
      }
    }
  }, [isOpen, isPopup])

  if (isPopup && !isOpen && !show) return null

  const popupClass = isPopup
    ? `
      fixed left-1/2 top-1/2 z-[9999] bg-white rounded-xl shadow-2xl p-6 overflow-auto
      w-[95vw] h-[90vh] sm:w-[70vw] sm:h-[80vh]
      transition-all duration-350
      ${isOpen ? 'popup-in' : 'popup-out'}
    `
    : `p-6 max-w-6xl mx-auto mt-8`

  return (
    <>
      {isPopup && (
        <div
          className="fixed inset-0 bg-black/40 transition-opacity duration-300 z-[9999]"
          onClick={onClose}
          style={{ animation: `${isOpen ? 'fadeIn' : 'fadeOut'} 0.35s` }}
        />
      )}

      <div
        className={popupClass}
        style={isPopup ? { transform: 'translate(-50%, -50%)' } : {}}
      >
        {isPopup && (
          <img
            className="absolute top-4 right-6 w-5 cursor-pointer"
            onClick={onClose}
            src={Images.cancel}
          />
        )}
        <h1 className="text-2xl font-normal text-[grey] mb-6">Your Favourite Bags</h1>
        {favProducts.length === 0 ? (
          <div className="p-10 text-center text-gray-500 flex items-center justify-center">
            Oops, You Have No Favourites yet
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-3 z-[9999]">
            {favProducts.map((item, index) => (
              <div
                key={item._id}
                onClick={() => isPopup && onClose()}
                className="cursor-pointer"
              >
                <ProductItem
                  id={item._id}
                  name={item.productName}
                  colorImages={item.colorImages}
                  colors={item.colors}
                  price={item.price}
                  discountPercent={item.discountPercent}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {isPopup && (
        <style>
          {`
          .popup-in {
            animation: popupIn 0.35s cubic-bezier(.4,2,.6,1) forwards;
          }
          .popup-out {
            animation: popupOut 0.35s cubic-bezier(.4,2,.6,1) forwards;
          }
          @keyframes popupIn {
            from { opacity: 0; transform: translate(-50%, -50%) scale(0.85);}
            to   { opacity: 1; transform: translate(-50%, -50%) scale(1);}
          }
          @keyframes popupOut {
            from { opacity: 1; transform: translate(-50%, -50%) scale(1);}
            to   { opacity: 0; transform: translate(-50%, -50%) scale(0.85);}
          }
          @keyframes fadeIn {
            from { opacity: 0;}
            to { opacity: 1;}
          }
          @keyframes fadeOut {
            from { opacity: 1;}
            to { opacity: 0;}
          }
        `}
        </style>
      )}
    </>
  )
}

export default Favourites
