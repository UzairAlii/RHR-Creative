import React from 'react';
import { Images } from '../assets/assets';

const Navbar = ({ setToken, toggleSidebar }) => {
  return (
    <div className='flex w-full h-fit'>
      <div className="admin-nav flex items-center justify-between px-5 py-3 md:py-5 md:px-10 w-full z-40">
        <div className=''>
          {/* Bars Icon */}
          <img 
            src={Images.bars} 
            alt="Menu" 
            onClick={toggleSidebar} 
            className="cursor-pointer"
          />
        </div>
        <div className='logo flex items-center justify-center flex-col'>
          <p className='text-lg lg:text-4xl font-semibold'>RHR <span className='text-gray-400 '>Creative</span></p>
          <p className='text-[3vw] lg:text-xl font-semibold'>Admin Panel</p>
        </div>
        <div>
          <button 
            onClick={() => setToken('')} 
            className='px-3 md:px-5 py-2 bg-black rounded-lg text-white text-xs md:text-sm cursor-pointer'>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
