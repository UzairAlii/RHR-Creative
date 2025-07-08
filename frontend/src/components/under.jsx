import React, { useContext } from 'react'
import { shopContext } from '../context/ShopContext'
import ProductItem from './ProductItem'

const Under1999 = () => {
  const { APIproducts } = useContext(shopContext)

  const filteredProducts = (APIproducts || []).filter(p => {
    let finalPrice = p.price;
    if (p.discountPercent && !isNaN(p.discountPercent)) {
      finalPrice = Math.round(p.price - (p.price * p.discountPercent) / 100);
    }
    return finalPrice <= 999;
  });

  return (
    <div className="w-full min-h-screen bg-white py-8 px-4 text-center">
      <h2 className="text-3xl mb-6">Bags Under 999</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 text-start">
        {filteredProducts.length === 0 ? (
          <p>No products found under 1999.</p>
        ) : (
          filteredProducts.map(product => (
            <ProductItem
              key={product._id}
              id={product._id}
              name={product.productName}
              price={product.price}
              discountPercent={product.discountPercent}
              colorImages={product.colorImages}
              colors={product.colors}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default Under1999