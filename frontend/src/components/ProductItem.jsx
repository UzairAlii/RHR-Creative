import React, { useState, useRef, useContext } from 'react';
import { Link } from 'react-router-dom';
import { shopContext } from '../context/ShopContext';
import { Images } from '../assets/assets';

const ProductItem = ({
  id,
  name,
  price,
  discountPercent,
  colorImages = [],
  colors = [],
  customClass,
  customClassThree
}) => {
  const { currency, favourites, addToFavourites, removeFromFavourites, showNotification } = useContext(shopContext);

  const isFavourite = favourites.includes(id);

  let finalDiscountedPrice = price;
  if (discountPercent && !isNaN(discountPercent)) {
    finalDiscountedPrice = Math.round(price - (price * discountPercent / 100));
  }

  const convertedPrice = Math.round(price * (currency?.rate || 1));
  const convertedDiscountedPrice = Math.round(finalDiscountedPrice * (currency?.rate || 1));

  const allFirstImages = colorImages
    .map(c => Array.isArray(c.images) && c.images.length > 0 ? c.images[0] : null)
    .filter(Boolean);

  const [activeIndex, setActiveIndex] = useState(0);
  const imageBoxRef = useRef(null);

  const handleMouseMove = (e) => {
    const box = imageBoxRef.current;
    if (!box) return;
    const boxRect = box.getBoundingClientRect();
    const mouseX = e.clientX - boxRect.left;
    const sectionWidth = boxRect.width / allFirstImages.length;
    const index = Math.min(allFirstImages.length - 1, Math.floor(mouseX / sectionWidth));
    setActiveIndex(index);
  };

  const handleMouseLeave = () => {
    setActiveIndex(0);
  };

  return (
    <Link
      className="block bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 h-full"
      to={`/product/${id}`}
    >
      {/* Image Box */}
      <div
        className="overflow-hidden w-full aspect-[4/5] rounded-t-lg flex items-center justify-center bg-gray-50"
        ref={imageBoxRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <img
          className={`object-center w-full h-full transition-all duration-200 ${customClass}`}
          src={allFirstImages[activeIndex] || allFirstImages[0]}
          alt={name}
        />
      </div>

      {/* Title */}
      <div className="pt-3 px-2 w-full min-w-0">
  <p className="text-[10px] font-medium uppercase text-gray-500">RHR Creative</p>
  <p
    className={`text-[15px] font-normal text-black truncate overflow-hidden whitespace-nowrap w-full min-w-0 ${customClassThree}`}
    title={name}
    style={{ maxWidth: "100%" }}
  >
    {name}
  </p>
</div>

      {/* Price */}
      <div className="flex items-center justify-between gap-2 px-2 pt-2">
        <div className='flex flex-col md:flex-row gap-2'>
          {discountPercent ? (
            <>
              <p className="text-gray-400 text-sm line-through">
                {currency?.symbol || "₨"} {convertedPrice.toLocaleString()}
              </p>
              <p className="text-black text-sm font-semibold">
                {currency?.symbol || "₨"} {convertedDiscountedPrice.toLocaleString()}
              </p>
            </>
          ) : (
            <p className="text-black text-base font-semibold">
              {currency?.symbol || "₨"} {convertedPrice.toLocaleString()}
            </p>
          )}
        </div>
        {discountPercent && (
          <p className="text-green-500 text-xs font-semibold">{discountPercent}% Off</p>
        )}
      </div>

      <div className="h-[1px] w-full bg-[#0000001a] my-2"></div>

      {/* Colors */}
      <div className='w-full flex items-center justify-between px-2 pb-3'>
        <div className="flex items-center gap-2">
          {colors.map((color, index) => (
            <div
              key={index}
              className="w-5 h-5 rounded-full border border-gray-300"
              style={{ backgroundColor: color }}
            ></div>
          ))}
        </div>

        <div className='save-icon'>
          <img
            title={isFavourite ? 'Remove from Favourite' : 'Add To Your Favourite'}
            className='w-5 cursor-pointer'
            src={isFavourite ? Images.saved : Images.save}
            alt=""
            onClick={e => {
              e.preventDefault();
              if (isFavourite) {
                removeFromFavourites(id);
              } else {
                addToFavourites(id);
                showNotification && showNotification("This Product Has Been Added To Your Favourites");
              }
            }}
            style={{ filter: isFavourite ? 'grayscale(0%)' : 'grayscale(100%)' }}
          />
        </div>
      </div>
    </Link>
  );
};

export default ProductItem;
