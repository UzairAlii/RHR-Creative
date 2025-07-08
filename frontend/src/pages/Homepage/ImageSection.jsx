import React from 'react'
import { Link } from 'react-router-dom'
import { Images } from '../../assets/assets'

const ImageSection = () => {
  return (
    <div className="w-full flex flex-col lg:flex-row min-h-[500px] bg-[#faf6f2]">
      {/* Left Side */}
      <div className="flex-1 flex flex-col justify-center px-8 py-12 lg:py-0">
        <span className="text-sm font-semibold mb-4 tracking-widest">LAPTOP BAGS COLLECTION</span>
        <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
          Carry Your World <br /> With Style
        </h2>
        <p className="text-base md:text-lg mb-8 text-gray-700 max-w-xl">
          Discover our premium range of laptop bags designed for professionals and students. 
          Stay organized, protected, and stylish wherever you go. Perfect for travel, work, and everyday use.
        </p>
        <Link to="/Collections">
          <button className="bg-black text-white px-8 py-3 rounded-full font-semibold text-base hover:bg-gray-900 transition">
            EXPLORE COLLECTIONS
          </button>
        </Link>
      </div>
      {/* Right Side */}
      <div className="flex-1 flex items-center justify-center bg-[#e7eaee]">
        <img
          src={Images.chiballi}
          // src={bagImage}
          alt="Laptop Bag"
          className="w-full h-full object-cover max-h-[500px] rounded-lg shadow-lg"
        />
      </div>
    </div>
  )
}

export default ImageSection