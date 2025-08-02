import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { shopContext } from '../../context/ShopContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import ProductItem from '../../components/ProductItem';
import CartViewer from '../../components/CartViewer';
import { Images } from '../../assets/assets';

let shippingPolicyOne = `All orders are dispatched within 24-48 hours after the order is confirmed.`
let shippingPolicyTwo = `standard delivery time is between 2-7 business days from the date of placing the order`

let returnPolicyOne = `Products can only be replaced if there are any manufacturing defects within 7 days.`
let returnPolicyTwo = `We gladly accept returns, exchanges, or replacements of ONLY unused merchandise within 7 days from the date of delivery.`
let returnPolicyThree = `Please note that all products must have their original tags, dust bags, and packaging boxes intact. All items should be unused and in brand-new condition.`
let returnPolicyFour = `If the product received is either damaged or has a manufacturing defect, contact Customer Service at rehmanshahid000@gmail.com or simply message us on  WhatsApp +923 24 2934332 within 48 hours of delivery.`
let returnPolicyFive = `The pick-up and delivery of the products will be taken care of by RHR Creative.`
let returnPolicySix = `For returns of Cash on Delivery (COD) orders, a link will be sent to the registered mobile number..`

let moreInfoPara1 = "RHR Creative PVT LTD, Office # 406, Forth Floor, Ilahi Center, Regal Chowk, Sadar, Karchi, Pakistan, PK"
let costumerCare = "Reach out to us at rehmanshahid000@gmail.com  or simply message us on WhatsApp +923 24 2934332"
let countryOfOrigin = "Pakistan"


const Product = ({ id }) => {
  const { productId } = useParams();
  const { APIproducts, currency, addToCart, favourites, addToFavourites, removeFromFavourites, showNotification } = useContext(shopContext);

  const [productData, setProductData] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [openDescription, setOpenDescription] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isCartViewerOpen, setIsCartViewerOpen] = useState(false);

  const isFavourite = favourites.includes(productData?._id);

  const toggleSection = (section) => {
    setOpenDescription(openDescription === section ? null : section);
  };

  // Modal state
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState(null);

  useEffect(() => {
    setProductData(null);
    setSelectedColorIndex(0);

    const allProducts = [...(APIproducts || [])];
    const foundProduct = allProducts.find((item) => item._id === productId);

    if (foundProduct) {
      setProductData({
        ...foundProduct,
        colors: foundProduct.colors.map(c => c.toLowerCase()),
        colorImages: foundProduct.colorImages.map(ci => ({
          ...ci,
          color: ci.color.toLowerCase()
        }))
      });
      setSelectedColor(foundProduct.colors[0].toLowerCase());
    }

    window.scrollTo(0, 0);
  }, [productId, APIproducts]);

  const toggleCartViewer = () => {
    setIsCartViewerOpen(!isCartViewerOpen);
  };


  useEffect(() => {
    if (previewOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [previewOpen]);

  if (!productData) {
    return <div className="text-center py-20 text-gray-500">Loading...</div>;
  }

  const selectedColorImages = productData.colorImages?.[selectedColorIndex]?.images || [];


  const handleColorClick = (color) => {
    setSelectedColor(color);
  };

  // Modal handlers
  const openPreview = (idx) => {
    setPreviewIndex(idx);
    setPreviewOpen(true);
    setSlideDirection(null);
  };
  const closePreview = () => setPreviewOpen(false);

  const goLeft = () => {
    if (previewIndex > 0) {
      setSlideDirection('left');
      setTimeout(() => {
        setPreviewIndex((prev) => prev - 1);
        setSlideDirection(null);
      }, 200);
    }
  };
  const goRight = () => {
    if (previewIndex < selectedColorImages.length - 1) {
      setSlideDirection('right');
      setTimeout(() => {
        setPreviewIndex((prev) => prev + 1);
        setSlideDirection(null);
      }, 200);
    }
  };

  const price = productData.price;
  const discountPercent = productData.discountPercent;
  const wholesalePrice = productData.wholesalePrice;
  let finalDiscountedPrice = price;
  if (discountPercent && !isNaN(discountPercent)) {
    finalDiscountedPrice = Math.round(price - (price * discountPercent / 100));
  }
  const convertedPrice = Math.round(price * (currency?.rate || 1));
  const convertedDiscountedPrice = Math.round(finalDiscountedPrice * (currency?.rate || 1));
  const convertedWholesalePrice = wholesalePrice ? Math.round(wholesalePrice * (currency?.rate || 1)) : null;

  // Wholesale logic
  const isWholesale = quantity >= 50;
  const showWholesalePrice = isWholesale && convertedWholesalePrice;
  const wholesalePercentOff = showWholesalePrice
    ? Math.round(((price - wholesalePrice) / price) * 100)
    : null;



  return (
    <div className="max-w-[1200px] mx-auto px-4 py-2">

      <div className='py-5 flex gap-3 items-center'>
        <Link to={"/"} >
          <p className='text-sm text-[#000000a3] hover:underline'>Home</p>
        </Link>
        <span>|</span>
        <p className='text-sm text-black font-medium cursor-pointer'>{productData.productName}</p>
      </div>

      <div className='flex flex-col lg:flex-row gap-8 mt-5'>
        {/* LEFT - Images */}
        <div className="grid grid-cols-2 gap-4 flex-1">
          {selectedColorImages.map((img, i) => (
            <img
              key={i}
              src={img}
              alt="product"
              className="w-full h-auto object-cover rounded shadow cursor-pointer"
              onClick={() => {
                setPreviewIndex(i);
                setPreviewOpen(true);
              }}
            />
          ))}
        </div>

        {/* Modal Preview */}
        {previewOpen && (
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 bg-opacity-90"
            onClick={closePreview}
          >
            {/* Stop propagation for modal content */}
            <div
              className="relative flex flex-col items-center justify-center w-full h-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top bar */}
              <div className="absolute top-4 left-6 text-white text-sm font-normal bg-[#0000009c] bg-opacity-60 px-3 py-1 rounded-full">
                {previewIndex + 1} / {selectedColorImages.length}
              </div>

              {/* Close button */}
              <button
                className="absolute top-4 right-6 text-white text-3xl bg-[#0000009c] bg-opacity-60 rounded-full px-3 py-1 hover:bg-opacity-80 transition"
                onClick={closePreview}
                aria-label="Close"
              >
                &times;
              </button>

              {/* Left Button */}
              <div
                className={`absolute left-4 top-1/2 -translate-y-1/2 text-3xl h-16 w-16 flex items-center justify-center rounded-full bg-black bg-opacity-60 text-white transition
          ${previewIndex === 0 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-opacity-80 cursor-pointer'}`}
                onClick={goLeft}
                disabled={previewIndex === 0}
                aria-label="Previous"
                style={{ pointerEvents: previewIndex === 0 ? 'none' : 'auto' }}
              >
                <img className='w-7 rotate-180' src={Images.chevron} alt="" />
              </div>

              {/* Right Button */}
              <div
                className={`absolute right-4 top-1/2 -translate-y-1/2 text-3xl h-16 w-16 flex items-center justify-center rounded-full bg-black bg-opacity-60 text-white transition
          ${previewIndex === selectedColorImages.length - 1 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-opacity-80 cursor-pointer'}`}
                onClick={goRight}
                disabled={previewIndex === selectedColorImages.length - 1}
                aria-label="Next"
                style={{ pointerEvents: previewIndex === selectedColorImages.length - 1 ? 'none' : 'auto' }}
              >
                <img className='w-7' src={Images.chevron} alt="" />
              </div>

              {/* Image with slide animation */}
              <div className="flex items-center justify-center w-full h-full">
                <img
                  src={selectedColorImages[previewIndex]}
                  alt={`preview-${previewIndex}`}
                  className={`max-h-[80vh] max-w-[90vw] rounded shadow-lg transition-transform duration-200
            ${slideDirection === 'left' ? '-translate-x-100 opacity-0' : ''}
            ${slideDirection === 'right' ? 'translate-x-100 opacity-0' : ''}`}
                  draggable={false}
                />
              </div>
            </div>
          </div>
        )}

        {/* RIGHT - Details */}
        <div className="flex-1">
          <div className="lg:sticky lg:top-10">
            <div className="flex flex-col justify-center">
              <h2 className="text-sm font-normal text-gray-500">RHR Creative</h2>
              <div className="flex items-center justify-between pb-4 border-b-[1px] border-[#00000046] w-full">
                <h2 className="text-2xl font-normal w-[70%]">{productData.productName}</h2>
                <div className="flex items-center ml-4 w-fit">
                  <span
                    className={`inline-block w-2 h-2 rounded-full mr-2 ${productData.stock ? "bg-green-500" : "bg-red-500"}`}
                  ></span>
                  <span className={`text-[12px] font-medium ${productData.stock ? "text-green-600" : "text-red-600"}`}>
                    {productData.stock ? "In Stock" : "Out of stock"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-1 text-black py-5 border-b-[1px] border-[#00000046]">
              {showWholesalePrice ? (
                <div className="flex items-center gap-2">
                  <p className="text-gray-400 text-sm lg:text-md line-through">
                    {currency?.symbol || "₨"} {convertedPrice.toLocaleString()}
                  </p>
                  <p className="text-black text-md font-semibold">
                    {currency?.symbol || "₨"} {convertedWholesalePrice?.toLocaleString()}
                  </p>
                  <p className="text-green-500 text-md font-semibold">
                    {wholesalePercentOff}% Off
                  </p>
                </div>
              ) : discountPercent ? (
                <div className="flex items-center gap-2">
                  <p className="text-gray-400 text-sm lg:text-md line-through">
                    {currency?.symbol || "₨"} {convertedPrice.toLocaleString()}
                  </p>
                  <p className="text-black text-md font-semibold">
                    {currency?.symbol || "₨"} {convertedDiscountedPrice.toLocaleString()}
                  </p>
                  <p className="text-green-500 text-md font-semibold">
                    {discountPercent + "% Off"}
                  </p>
                </div>
              ) : (
                <p className="text-xl text-gray-700 font-normal">
                  {currency?.symbol || "₨"} {convertedPrice.toLocaleString()}
                </p>
              )}
            </div>

            {!productData.stock && (
              <div className="my-3 p-3 rounded bg-red-100 text-red-700 text-center font-semibold text-sm border border-red-300">
                This product is currently <span className="font-bold">OUT OF STOCK</span>.
              </div>
            )}

            {isWholesale && (
              <div className="my-2 p-3 rounded bg-green-100 text-green-700 text-center font-semibold text-sm">
                🎉 Congratulations! You got a special wholesale discount.
              </div>
            )}


            <div className='w-full flex items-center justify-between'>
              {/* Product Colors Section */}
              {/* Colors */}
              <div className="flex items-center gap-2 my-5">
                {productData.colorImages.map((c, i) => (
                  <button
                    key={i}
                    className={`w-7 h-7 rounded-full border-2 ${selectedColorIndex === i ? 'border-black' : 'border-gray-300'}`}
                    style={{ backgroundColor: c.color }}
                    onClick={() => {
                      setSelectedColorIndex(i);
                      setSelectedColor(c.color);
                    }}
                  />
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
                      removeFromFavourites(productData._id);
                    } else {
                      addToFavourites(productData._id);
                      showNotification && showNotification("This Product Has Been Added To Your Favourites");
                    }
                  }}
                  style={{ filter: isFavourite ? 'grayscale(0%)' : 'grayscale(100%)' }}
                />
              </div>
            </div>


            {/* Quantity Section */}
            <div className='flex flex-col gap-5 mb-10 h-fit w-full'>
              <div>
                <h1>Quantity</h1>
                <div className='flex items-center justify-between h-fit w-full md:w-fit md:h-fit gap-4 p-3 rounded-full bg-slate-100'>
                  <FontAwesomeIcon
                    icon={faMinus}
                    onClick={() => setQuantity((prevQuantity) => Math.max(1, prevQuantity - 1))}
                    className='cursor-pointer'
                  />
                  <input
                    type='number'
                    value={quantity}
                    readOnly
                    className='w-12 text-center bg-transparent outline-none border-none'
                  />
                  <FontAwesomeIcon
                    icon={faPlus}
                    onClick={() => setQuantity((prevQuantity) => Math.min(100, prevQuantity + 1))}
                    className='cursor-pointer'
                  />
                </div>

                <p className='mt-3 text-[12px]'>The more you buy, the less you pay, extra savings on 50+ units</p>
              </div>
            </div>

            {/* Add to Cart */}
            <button
              onClick={() => {
                addToCart(
                  productData._id,
                  productData.colorImages[selectedColorIndex].color,
                  quantity,
                  0
                );
                setIsCartViewerOpen(true);
              }}
              className={`w-full bg-black text-white border-[1px] py-3 rounded-full transition
    ${!productData.stock
                  ? "opacity-60 cursor-not-allowed"
                  : "hover:bg-white hover:text-black hover:border-[1px]"}
  `}
              disabled={!productData.stock}
            >
              Add To Cart
            </button>

            <CartViewer
              isCartViewerOpen={isCartViewerOpen}
              toggleCartViewer={() => setIsCartViewerOpen(false)}
            />


            {/* bottom Section */}
            <div className="mt-4 w-full h-fit">
              {/* Description */}
              <div className="border-b-[1px] border-[#0000006c]">
                <button
                  className="w-full flex items-center justify-between py-4 text-left font-medium text-black focus:outline-none"
                  onClick={() => toggleSection('desc')}
                >
                  Description
                  <FontAwesomeIcon className={`transform transition-transform duration-200 ${openDescription === 'desc' ? 'rotate-180' : 'rotate-0'}`} icon={faChevronDown} />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${openDescription === 'desc'
                    ? 'max-h-[500px] overflow-auto opacity-100'
                    : 'max-h-0 opacity-0'
                    }`}
                >
                  <p className="text-gray-600 text-sm px-2 pb-4 break-words w-full overflow-hidden">
                    {productData.para || "No description available."}
                  </p>

                  <h1 className="font-semibold text-base px-2 pb-1">Specifications</h1>
                  <ul className="text-gray-700 text-[12px] px-4 pb-4 list-disc">
                    <li>Material: {productData.specs?.material}</li>
                    <li>Laptop Compatibility : {productData.specs?.compatibility}</li>
                    <li>Texture: {productData.specs?.texture}</li>
                    <li>Closure: {productData.specs?.closure}</li>
                    <li>{productData.specs?.compartment}</li>
                    <li>{productData.specs?.zips}</li>
                    <li>{productData.specs?.strap}</li>
                    <li>Length: {productData.specs?.length}</li>
                    <li>Width: {productData.specs?.width}</li>
                    <li>Height: {productData.specs?.height}</li>
                    <li>Weight: {productData.specs?.weight}</li>
                  </ul>
                </div>
              </div>
              <div className="border-b-[1px] border-[#0000006c]">
                <button
                  className="w-full flex items-center justify-between py-4 text-left font-medium text-black focus:outline-none"
                  onClick={() => toggleSection('shipping')}
                >
                  Shipping & Returns
                  <FontAwesomeIcon className={`transform transition-transform duration-200 ${openDescription === 'shipping' ? 'rotate-180' : 'rotate-0'}`} icon={faChevronDown} />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openDescription === 'shipping' ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className='text-gray-700 text-sm px-2 pb-4'>
                    <h3 className="font-semibold mb-2">Shipping Policy</h3>
                    <ul className='list-disc pl-5'>
                      <li>{shippingPolicyOne}</li>
                      <li>{shippingPolicyTwo}</li>
                    </ul>
                    <h3 className="font-semibold mt-4 mb-2">Return Policy</h3>
                    <ul className='list-disc pl-5'>
                      <li>B2G1 are <b>NOT ELIGIBLE</b> for returns/exchanges.</li>
                      <li>{returnPolicyOne}</li>
                      <li>{returnPolicyTwo}</li>
                      <li>{returnPolicyThree}</li>
                      <li>{returnPolicyFour}</li>
                      <li>{returnPolicyFive}</li>
                      <li>{returnPolicySix}</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="border-b-[1px] border-[#0000006c]">
                <button
                  className="w-full flex items-center justify-between py-4 text-left font-medium text-black focus:outline-none"
                  onClick={() => toggleSection('moreInfo')}
                >
                  More Information
                  <FontAwesomeIcon className={`transform transition-transform duration-200 ${openDescription === 'moreInfo' ? 'rotate-180' : 'rotate-0'}`} icon={faChevronDown} />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openDescription === 'moreInfo' ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className='text-gray-700 text-sm px-2 pb-4'>
                    <p><b>Office:</b> {moreInfoPara1}</p>
                    <p><b>Customer Care:</b> {costumerCare}</p>
                    <p><b>Country of Origin:</b> {countryOfOrigin}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* YOU MIGHT ALSO LIKE */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-4">You Might Also Like</h2>
        <div
          className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300"
          style={{ WebkitOverflowScrolling: 'touch', cursor: 'grab' }}
          draggable="true"
          onDragStart={e => {
            e.dataTransfer.setDragImage(new Image(), 0, 0);
          }}
          onMouseDown={e => {
            const container = e.currentTarget;
            let startX = e.pageX - container.offsetLeft;
            let scrollLeft = container.scrollLeft;
            const onMouseMove = (ev) => {
              const x = ev.pageX - container.offsetLeft;
              container.scrollLeft = scrollLeft - (x - startX);
            };
            const onMouseUp = () => {
              window.removeEventListener('mousemove', onMouseMove);
              window.removeEventListener('mouseup', onMouseUp);
            };
            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('mouseup', onMouseUp);
          }}
        >
          {(
            [...(APIproducts || [])]
              .filter(
                item =>
                  item.category === productData.category &&
                  item._id !== productData._id
              )
              .slice(0, 10)
          ).map(item => (
            <Link to={`/product/${item._id}`} key={item._id} reloadDocument>
              <div className="min-w-[220px] max-w-[220px] flex-shrink-0 ">
                <ProductItem
                  id={item._id}
                  name={item.productName}
                  price={item.price}
                  discountPercent={item.discountPercent}
                  customClass=""
                  customClassThree=""
                  colorImages={item.colorImages}
                  colors={item.colors}
                  hideImageIndicator={true}
                />
              </div>
            </Link>
          ))}
        </div>
      </div>


    </div>
  );
};

export default Product;