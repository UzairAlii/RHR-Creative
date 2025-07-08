import React, { useContext, useEffect, useState } from 'react'
import { shopContext } from '../../context/ShopContext'
import ProductItem from '../../components/ProductItem'

const BestProducts = () => {
  const { APIproducts } = useContext(shopContext)
  const [bestProducts, setBestProducts] = useState([])
  const [visibleProducts, setVisibleProducts] = useState(8)

  useEffect(() => {
    const best = [
      ...(APIproducts ? APIproducts.filter(item => item.bestSeller) : []),
    ]
    setBestProducts(best)
  }, [APIproducts])

  const loadMoreProducts = () => {
    setVisibleProducts((prev) => prev + 4)
  }

  return (
    <div className="bestSeller-container w-full px-2 sm:px-6 md:px-10 py-2 flex flex-col items-center md:mt-10">
      <h1 className='text-2xl sm:text-3xl md:text-4xl text-black font-normal text-center'>Shop The Best</h1>

      <div className='py-8 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 w-full max-w-7xl'>
        {
          bestProducts.slice(0, visibleProducts).map((item, index) => (
            <ProductItem
              key={item._id}
              id={item._id}
              name={item.productName}
              colorImages={item.colorImages}
              colors={item.colors}
              price={item.price}
              discountPercent={item.discountPercent}
            />
          ))
        }
      </div>

      {/* Load More Button */}
      {
        visibleProducts < bestProducts.length && (
          <button
            onClick={loadMoreProducts}
            className="border border-black px-6 py-2 mt-6 font-semibold text-sm text-black bg-transparent rounded cursor-pointer"
          >
            Load More
          </button>
        )
      }
    </div>
  )
}

export default BestProducts