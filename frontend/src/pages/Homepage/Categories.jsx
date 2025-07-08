import React, { useState } from 'react';
import { Images } from '../../assets/assets';
import { NavLink } from 'react-router-dom';
import Collection from '../Collection/Collection';

const CategoriesImages = [
  {
    src: Images.bagpackCtgImg,
    tag: "Laptop Bagpacks",
    to: "/Bagpacks"
  },
  {
    src: Images.handbagsCtgImg,
    tag: "Laptop Handbags",
    to: "/Handbags"
  },
  {
    src: Images.SleevesCtgImg,
    tag: "Laptop Sleeves",
    to: "/Sleeves"
  },
  {
    src: Images.laptopCtgImg,
  },
];

const Categories = () => {
  const [activeTab, setActiveTab] = useState('categories');

  return (
    <div className='h-fit w-full flex flex-col items-center py-10 px-2'>
      <div className="categories-headings flex items-center justify-center gap-10 border-b border-[#00000033] w-full max-w-xl relative">
        <button
          className={`relative w-1/2 text-md font-normal px-4 pb-3 transition-colors duration-200 ${activeTab === 'categories' ? 'text-black' : 'text-gray-400'}`}
          onClick={() => setActiveTab('categories')}
        >
          Categories
        </button>
        <button
          className={`relative w-1/2 text-md font-normal px-4 pb-3 transition-colors duration-200 ${activeTab === 'collections' ? 'text-black' : 'text-gray-400'}`}
          onClick={() => setActiveTab('collections')}
        >
          Collections
        </button>
        {/* Sliding underline */}
        <span
          className={`
            absolute bottom-0 h-[2px] bg-black rounded transition-all duration-300
            ${activeTab === 'categories' ? 'left-0 w-1/2' : 'left-1/2 w-1/2'}
          `}
        />
      </div>

      <div className="h-full w-full mt-10 flex justify-center">
        {activeTab === 'categories' ? (
          <div key="categories" className="w-full animate-fade-up">
            {/* Large Screens */}
            <div className="hidden lg:flex w-full justify-center items-center gap-5">
              {CategoriesImages.map((item, index) => (
                <NavLink to={item.to} key={index}>
                  <div className="relative h-[60vh] w-72 rounded-md flex flex-col items-center overflow-hidden">
                    <img className="h-full w-full object-cover object-center" src={item.src} alt="" />
                    {index === 3 && (
                      <div className="absolute top-0 left-0 w-full h-full bg-black/40 flex items-center justify-center">
                        <span className="text-white text-xl font-semibold">Coming Soon</span>
                      </div>
                    )}
                  </div>
                    <p className="mt-3 text-base text-center self-start font-bold hover:underline">{item.tag}</p>
                </NavLink>
              ))}
            </div>

            {/* Medium Screens */}
            <div className="sm:flex lg:hidden w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300">
              <div className="flex gap-4 w-max px-2 py-2 scroll-snap-x">
                {CategoriesImages.map((item, index) => (
                  <NavLink to={item.to} key={index} className="scroll-snap-center">
                    <div className="relative  h-[50vh] w-60 rounded-md flex flex-col items-center overflow-hidden">
                      <img className="h-full w-full object-cover object-center" src={item.src} alt="" />
                      {index === 3 && (
                        <div className="absolute top-0 left-0 w-full h-full bg-black/40 flex items-center justify-center">
                          <span className="text-white text-xl font-semibold">Coming Soon</span>
                        </div>
                      )}
                      <div className="absolute w-full h-full flex items-center justify-center">
                        <p className="font-medium text-center text-white w-[80%] bg-black/40 py-5 text-xs rounded-full">{item.tag}</p>
                      </div>
                    </div>
                  </NavLink>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div key="collections" className="w-full animate-fade-up flex justify-center h-fit">
            <div className="text-lg text-gray-600 w-full h-full">
              <Collection />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
