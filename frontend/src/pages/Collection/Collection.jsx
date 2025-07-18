import React, { useContext, useState, useMemo, useEffect } from 'react'
import { shopContext } from '../../context/ShopContext'
import ProductItem from '../../components/ProductItem'
import { Link, useLocation } from 'react-router-dom'
import { Images } from '../../assets/assets'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import Slider from 'rc-slider'

const CATEGORIES = [
  { label: 'Handbags', value: 'handbags' },
  { label: 'Bagpacks', value: 'bagpacks' },
  { label: 'Sleeves', value: 'sleeves' },
];


const Collection = () => {
  const [selectedColors, setSelectedColors] = useState([])
  const [selectedCategories, setSelectedCategories] = useState([])
  const [priceRange, setPriceRange] = useState([0, 100000])
  const [sortBy, setSortBy] = useState('')
  const [showFilter, setShowFilter] = useState(false)
  const [inStockOnly, setInStockOnly] = useState(false)
  const [visibleProducts, setVisibleProducts] = useState(8);

  const handleLoadMore = () => {
    setVisibleProducts((prev) => prev + 8);
  };

  const location = useLocation();
  const isHome = location.pathname === "/";

  const { APIproducts, currency } = useContext(shopContext)
  const allProducts = [
    ...(APIproducts || [])
  ]

  const [openSection, setOpenSection] = useState({
    availability: true,
    color: true,
    category: true,
    price: true,
  })

  const colorCounts = useMemo(() => {
    const counts = {};
    APIproducts?.forEach(item => {
      if (
        ['bagpacks', 'handbags', 'sleeves'].includes(item.category) &&
        Array.isArray(item.colors)
      ) {
        item.colors.forEach(c => {
          counts[c] = (counts[c] || 0) + 1;
        });
      }
    });
    return counts;
  }, [APIproducts]);



  const minPrice = useMemo(() => Math.min(...(allProducts?.map(p => p.price) || [0])), [allProducts])
  const maxPrice = useMemo(() => Math.max(...(allProducts?.map(p => p.price) || [100000])), [allProducts])

  const filteredProducts = useMemo(() => {
    let filtered = allProducts || []

    if (inStockOnly) {
      filtered = filtered.filter(item => item.stock)
    }
    if (selectedColors.length > 0) {
      filtered = filtered.filter(item =>
        Array.isArray(item.colors) && item.colors.some(c => selectedColors.includes(c))
      )
    }

   if (selectedCategories.length > 0) {
  filtered = filtered.filter(item =>
    selectedCategories.map(c => c.toLowerCase()).includes(item.category?.toLowerCase())
  );
}


    filtered = filtered.filter(item => item.price >= priceRange[0] && item.price <= priceRange[1])

    const getDiscountedPrice = (item) =>
      item.price - (item.price * (item.discountPercent || 0) / 100)

    if (sortBy === 'priceLowHigh') {
      filtered = filtered.slice().sort((a, b) => getDiscountedPrice(a) - getDiscountedPrice(b))
    } else if (sortBy === 'priceHighLow') {
      filtered = filtered.slice().sort((a, b) => getDiscountedPrice(b) - getDiscountedPrice(a))
    } else if (sortBy === 'aToZ') {
      filtered = filtered.slice().sort((a, b) => (a.productName || '').localeCompare(b.productName || ''))
    } else if (sortBy === 'zToA') {
      filtered = filtered.slice().sort((a, b) => (b.productName || '').localeCompare(a.productName || ''))
    }
    return filtered
  }, [allProducts, inStockOnly, selectedColors, selectedCategories, priceRange, sortBy])

  useEffect(() => {
    setPriceRange([minPrice, maxPrice])
  }, [minPrice, maxPrice])

  const handleCloseFilter = () => setShowFilter(false)

  const getColorStyle = color => ({
    backgroundColor: color,
    border: '1px solid #ccc',
    width: 18,
    height: 18,
    borderRadius: '50%',
    display: 'inline-block',
    marginRight: 8,
    verticalAlign: 'middle'
  })


  const toggleSection = (section) => {
    setOpenSection(prev => ({ ...prev, [section]: !prev[section] }))
  }

  return (
    <div className="w-full min-h-fit bg-[#fafafa] pb-2">

      {!isHome && (
        <>
          <div className={`bg-[#0000001d] border-b flex items-center justify-center px-2 md:px-6 ${isHome ? "py-2" : "py-6"} text-center`}>
            <h1 className="md:text-2xl text-2xl font-semibold">Collections</h1>
          </div>


          <div className="flex items-center justify-between mt-2 px-5">
            {/* FILTER */}
            <div
              className="flex items-center rounded hover:bg-gray-100 transition cursor-pointer gap-2"
              onClick={() => setShowFilter(true)}
            >
              <p className='text-xs'>{showFilter ? "Hide Filter" : "Show Filter"}</p>
              <img className='w-5' src={Images.filter} alt="" />
            </div>
            {/* SORT */}
            <div className='cursor-pointer w-30'>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="text-xs cursor-pointer border-none outline-none"
              >
                <option value="">Sort by: Featured</option>
                <option value="priceLowHigh">Price: Low to High</option>
                <option value="priceHighLow">Price: High to Low</option>
                <option value="aToZ">A to Z</option>
                <option value="zToA">Z to A</option>
              </select>
            </div>
          </div>
        </>
      )}

      {!isHome && (
        <div className='py-5 flex gap-3 items-center px-5'>
          <Link to={"/"} >
            <p className='text-sm text-[#000000a3] hover:underline'>Home</p>
          </Link>
          <span>|</span>
          <p className='text-sm text-black font-medium cursor-pointer'>Collections</p>
        </div>
      )}

      {/* Overlay */}
      {showFilter && (
        <div
          className="fixed inset-0 z-[9999] bg-black/40 bg-opacity-40 transition-opacity duration-300"
          onClick={handleCloseFilter}
        />
      )}

      {/* Slide-in Filter Sidebar */}
      <div
        className={`fixed top-0 left-0 z-[9999] h-full w-90 max-w-full bg-white shadow-lg transform transition-transform duration-300
        ${showFilter ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ willChange: 'transform' }}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h2 className="text-lg font-semibold">Filters</h2>
          <div onClick={handleCloseFilter} className="text-2xl font-bold hover:text-red-500 cursor-pointer">
            <img className='w-5' src={Images.cancel} alt="" />
          </div>
        </div>
        <div className="p-5 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 60px)' }}>


          {/* Availability */}
          <div className="mb-2 border-b-[1px] border-[grey]">
            <button
              className="w-full flex items-center justify-between py-3 text-left font-medium text-black focus:outline-none"
              onClick={() => toggleSection('availability')}
            >
              AVAILABILITY
              <FontAwesomeIcon className={`transform transition-transform duration-200 ${openSection.availability ? 'rotate-180' : 'rotate-0'}`} icon={faChevronDown} />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${openSection.availability ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}
            >
              <div className="flex items-center gap-2 mb-2 px-1 pb-3">
                <label className="inline-flex items-center cursor-pointer" onClick={e => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={e => setInStockOnly(e.target.checked)}
                    onClick={e => e.stopPropagation()}
                    className="form-checkbox accent-black w-5 h-5"
                  />
                  <span className="ml-2 text-sm">In stock only</span>
                </label>
              </div>
            </div>
          </div>

          {/* Category Filter */}
          <div className="mb-2 border-b-[1px] border-[grey] mt-5">
            <button
              className="w-full flex items-center justify-between py-3 text-left font-medium text-black focus:outline-none"
              onClick={() => toggleSection('category')}
            >
              CATEGORY
              <FontAwesomeIcon className={`transform transition-transform duration-200 ${openSection.category ? 'rotate-180' : 'rotate-0'}`} icon={faChevronDown} />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${openSection.category ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'}`}
            >
              <div className="flex flex-col gap-2 px-1 pb-3">
                {CATEGORIES.map(({ label, value }) => (
                  <label key={value} className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(value)}
                      onChange={e => {
                        if (e.target.checked) {
                          setSelectedCategories([...selectedCategories, value])
                        } else {
                          setSelectedCategories(selectedCategories.filter(cat => cat !== value))
                        }
                      }}
                      className="form-checkbox accent-black w-5 h-5 mr-3"
                    />
                    <span className="capitalize text-sm">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>



          {/* Color Filter */}
          <div className="mb-2 border-b-[1px] border-[grey] mt-5">
            <button
              className="w-full flex items-center justify-between py-3 text-left font-medium text-black focus:outline-none"
              onClick={() => toggleSection('color')}
            >
              COLOR
              <FontAwesomeIcon className={`transform transition-transform duration-200 ${openSection.color ? 'rotate-180' : 'rotate-0'}`} icon={faChevronDown} />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${openSection.color ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'}`}
            >
              <div className="flex flex-col gap-2 px-1 pb-3">
                {Object.entries(colorCounts).map(([color, count]) => (
                  <label key={color} className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedColors.includes(color)}
                      onChange={e => {
                        if (e.target.checked) {
                          setSelectedColors([...selectedColors, color])
                        } else {
                          setSelectedColors(selectedColors.filter(c => c !== color))
                        }
                      }}
                      className="form-checkbox accent-black w-5 h-5 mr-3"
                    />
                    <span style={getColorStyle(color)}></span>
                    <span className="capitalize text-sm">{color}</span>
                    <span className="ml-auto text-xs text-gray-500">({count})</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Price Filter */}
          <div className="mb-2 border-b-[1px] border-[grey] mt-5">
            <button
              className="w-full flex items-center justify-between py-3 text-left font-medium text-black focus:outline-none"
              onClick={() => toggleSection('price')}
            >
              PRICE
              <FontAwesomeIcon className={`transform transition-transform duration-200 ${openSection.price ? 'rotate-180' : 'rotate-0'}`} icon={faChevronDown} />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${openSection.price ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
            >
              <div className="flex flex-col gap-2 px-1 pb-3 items-center justify-center">
                <div className="flex flex-col items-center gap-2 w-[90%]">
                  <Slider
                    range
                    min={minPrice}
                    max={maxPrice}
                    value={priceRange}
                    onChange={val => setPriceRange(val)}
                    trackStyle={[{ backgroundColor: 'black', height: 4 }]}
                    handleStyle={[
                      { borderColor: 'black', backgroundColor: 'black' },
                      { borderColor: 'black', backgroundColor: 'black' }
                    ]}
                    railStyle={{ backgroundColor: 'black', height: 4 }}
                  />
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-800">From</span>
                    <div className='flex items-center gap-1 border px-2 rounded-lg'>
                      <p>{currency?.symbol || "₨"}</p>
                      <input
                        type="number"
                        min={minPrice}
                        max={priceRange[1]}
                        value={priceRange[0]}
                        onChange={e => setPriceRange([Number(e.target.value), priceRange[1]])}
                        className="w-20 rounded px-2 py-1 text-sm border-none outline-none"
                      />
                    </div>
                  </div>
                  <span className="mx-1">-</span>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-800">To</span>
                    <div className='flex items-center gap-1 border px-2 rounded-lg'>
                      <p>{currency?.symbol || "₨"}</p>
                      <input
                        type="number"
                        min={priceRange[0]}
                        max={maxPrice}
                        value={priceRange[1]}
                        onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
                        className="w-20 rounded px-2 py-1 text-sm border-none outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Reset Filters Button */}
          <button
            className="w-full bg-gray-200 hover:bg-gray-300 rounded py-2 mt-4"
            onClick={() => {
              setSelectedColors([])
              setSelectedCategories([])
              setInStockOnly(false)
              setPriceRange([minPrice, maxPrice])
              setSelectedCategories([])
            }}
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="px-2 md:px-5 pb-5">

        <div className="py-5 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 w-full max-w-7xl">
          {filteredProducts.length === 0 ? (
            <div className="col-span-full text-center text-gray-500">No products found.</div>
          ) : (
            filteredProducts.slice(0, visibleProducts).map((item, index) => (
              <div key={item._id}>
                <ProductItem
                  key={index}
                  id={item._id}
                  name={item.productName}
                  colorImages={item.colorImages}
                  colors={item.colors}
                  price={item.price}
                  discountPercent={item.discountPercent}
                />
              </div>
            ))
          )}
        </div>
        {/* Load More Button */}
        {visibleProducts < filteredProducts.length && (
          <div className="mt-2 flex items-center justify-center flex-col">
            {/* Viewing X of Y products */}
            <div className="text-center text-sm text-gray-700 mb-2">
              Viewing {Math.min(visibleProducts, filteredProducts.length)} of {filteredProducts.length} products
            </div>
            <button
              onClick={handleLoadMore}
              className="border border-black px-6 py-2 w-full md:w-[30%] font-semibold text-sm text-black bg-transparent rounded cursor-pointer"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Collection