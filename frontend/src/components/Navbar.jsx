import React, { useContext, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faClose, faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import { shopContext } from '../context/ShopContext';
import { Images } from '../assets/assets';
import SearchOverlay from './SearchOverlay';
import ProfileDrawer from './ProfileDrawer';

const Navbar = ({ onFavouritesClick }) => {
  const location = useLocation();
  const isCheckout = location.pathname === "/Checkout";

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [searchOpen, setSearchOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showProfileDrawer, setShowProfileDrawer] = useState(false);
  const { getCartCount, token } = useContext(shopContext)
  const [scrolled, setScrolled] = useState(false);
  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const ToggleNav = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const closeMenu = () => setIsMenuOpen(false);

  const handleOpenSearch = () => {
    setShowSearch(true);
    setTimeout(() => setSearchOpen(true), 10); 
  };

  const handleCloseSearch = () => {
    setSearchOpen(false);
    setTimeout(() => setShowSearch(false), 500); 
  };

  return (
    <div className='flex flex-col w-full'>

      {/* PRENAVBAR */}
      {!isCheckout && (
        <div className="preNavbar bg-[#ececec] h-[30%] w-full flex items-center px-5 py-2 md:px-10 ">
          <NavLink to={"/selectCountry"}>
            <p className='font-normal text-[10px] md:text-[15px]'>Please select a country outside of Pakistan <a className='underline' href="#">Select Country</a></p>
          </NavLink>
        </div>
      )}

      {/* MAIN NAVBAR  */}

      <div
  className={`
    Navbar bg-black
    transition-colors duration-500
    z-[1000]
    h-[70%] flex items-center justify-between gap-20 px-5 py-3 sm:py-5 lg:px-10 leading-none w-full
  `}
  style={{
    backdropFilter: isHome && !scrolled ? 'none' : undefined,
  }}
>

        <NavLink to={"/"}>
          <div className="logo flex flex-col items-center text-center cursor-pointer">
            <h1 id='rhr' className='text-4xl text-white'>RHR</h1>
            <h1 id='creative' className='text-2xl text-[#a5a5a5]'>Creative</h1>
          </div>
        </NavLink>

        {/* Sections */}
        {!isCheckout && (
          <ul className='hidden items-center gap-5 md:flex'>
            <NavLink to={"/"}><li className={`text-[15px] text-white`}>Home</li></NavLink>
            <NavLink to={"/BestSellers"}><li className={`text-[15px] text-white`}>Best Sellers</li></NavLink>
            <NavLink to={"/Collections"}><li className={`text-[15px] text-white`}>Collections</li></NavLink>
            <NavLink to={"/handbags"}><li className={`text-[15px] text-white`}>Handbags</li></NavLink>
            <NavLink to={"/Bagpacks"}><li className={`text-[15px] text-white`}>Bagpacks</li></NavLink>
            <NavLink to={"/Sleeves"}><li className={`text-[15px] text-white`}>Sleeves</li></NavLink>
            <NavLink to={"/under999"}><li className={`text-[15px] text-white`}>Under 999</li></NavLink>
          </ul>
        )}

        {/* RIGHT NAVBAR ICONS  */}

        <div className="icons flex items-center gap-5">

          {!isCheckout && (
            <div id='search' className='cursor-pointer' onClick={handleOpenSearch}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.8487 16.65L12.2387 11.21C13.2087 10.07 13.7987 8.59999 13.7987 6.98999C13.7987 3.40999 10.8787 0.48999 7.29871 0.48999C3.71871 0.48999 0.798706 3.40999 0.798706 6.98999C0.798706 10.57 3.71871 13.49 7.29871 13.49C8.91871 13.49 10.3887 12.89 11.5287 11.92L17.1487 17.37C17.2487 17.46 17.3687 17.51 17.4987 17.51C17.6287 17.51 17.7587 17.46 17.8587 17.36C18.0487 17.16 18.0487 16.84 17.8487 16.65ZM1.79871 6.98999C1.79871 3.95999 4.26871 1.48999 7.29871 1.48999C10.3287 1.48999 12.7987 3.95999 12.7987 6.98999C12.7987 10.02 10.3287 12.49 7.29871 12.49C4.26871 12.49 1.79871 10.02 1.79871 6.98999Z" fill='white'></path>
              </svg>
            </div>
          )}
          {showSearch && (
            <SearchOverlay open={searchOpen} onClose={handleCloseSearch} />
          )}

            <div id="profile" className='cursor-pointer' onClick={() => setShowProfileDrawer(true)}>
              {token ? (
                <div>
                  <svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.5 0.5C3.81 0.5 0 4.31 0 9C0 13.69 3.81 17.5 8.5 17.5C13.19 17.5 17 13.69 17 9C17 4.31 13.19 0.5 8.5 0.5ZM8.5 1.5C12.64 1.5 16 4.86 16 9C16 10.44 15.58 11.78 14.88 12.93C13.79 11.45 12.26 10.42 10.51 9.97C11.21 9.39 11.66 8.53 11.66 7.55C11.66 5.81 10.24 4.39 8.5 4.39C6.76 4.39 5.34 5.81 5.34 7.55C5.34 8.52 5.79 9.39 6.49 9.97C4.75 10.42 3.22 11.46 2.12 12.93C1.42 11.78 1 10.44 1 9C1 4.86 4.36 1.5 8.5 1.5Z" fill='white'></path>
                  </svg>
                </div>
              ) : (
                <div onClick={() => setShowProfileDrawer(true)}>
                  <svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.49997 0.5C3.80997 0.5 -3.05176e-05 4.31 -3.05176e-05 9C-3.05176e-05 13.69 3.80997 17.5 8.49997 17.5C13.19 17.5 17 13.69 17 9C17 4.31 13.19 0.5 8.49997 0.5ZM8.49997 1.5C12.64 1.5 16 4.86 16 9C16 10.44 15.58 11.78 14.88 12.93C13.79 11.45 12.26 10.42 10.51 9.97C11.21 9.39 11.66 8.53 11.66 7.55C11.66 5.81 10.24 4.39 8.49997 4.39C6.75997 4.39 5.33997 5.81 5.33997 7.55C5.33997 8.52 5.78997 9.39 6.48997 9.97C4.74997 10.42 3.21997 11.46 2.11997 12.93C1.41997 11.78 0.999969 10.44 0.999969 9C0.999969 4.86 4.35997 1.5 8.49997 1.5ZM6.33997 7.55C6.33997 6.36 7.30997 5.39 8.49997 5.39C9.68997 5.39 10.66 6.36 10.66 7.55C10.66 8.74 9.68997 9.71 8.49997 9.71C7.30997 9.71 6.33997 8.74 6.33997 7.55ZM8.49997 16.5C6.17997 16.5 4.10997 15.44 2.73997 13.79C4.03997 11.86 6.16997 10.7 8.49997 10.7C10.84 10.7 12.96 11.85 14.26 13.78C12.89 15.44 10.82 16.5 8.49997 16.5Z" fill='white'></path>
                  </svg>
                </div>
              )}
            </div>


          <ProfileDrawer isOpen={showProfileDrawer} onClose={() => setShowProfileDrawer(false)} />

          {!isCheckout && (
            <div onClick={onFavouritesClick} style={{ cursor: 'pointer' }}>
              <svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" width="24" class="header__wishlist-icon icon icon-icon-wishlist" viewBox="0 0 21 20" fill="none">
                <path d="M14.4062 2.5C12.793 2.5 11.3805 3.19375 10.5 4.36641C9.61953 3.19375 8.20703 2.5 6.59375 2.5C5.30955 2.50145 4.07837 3.01223 3.1703 3.9203C2.26223 4.82837 1.75145 6.05955 1.75 7.34375C1.75 12.8125 9.85859 17.2391 10.2039 17.4219C10.2949 17.4708 10.3967 17.4965 10.5 17.4965C10.6033 17.4965 10.7051 17.4708 10.7961 17.4219C11.1414 17.2391 19.25 12.8125 19.25 7.34375C19.2486 6.05955 18.7378 4.82837 17.8297 3.9203C16.9216 3.01223 15.6904 2.50145 14.4062 2.5ZM10.5 16.1562C9.07344 15.325 3 11.5383 3 7.34375C3.00124 6.39101 3.38026 5.47765 4.05396 4.80396C4.72765 4.13026 5.64101 3.75124 6.59375 3.75C8.11328 3.75 9.38906 4.55938 9.92188 5.85938C9.96896 5.97401 10.0491 6.07205 10.152 6.14105C10.2549 6.21005 10.3761 6.2469 10.5 6.2469C10.6239 6.2469 10.7451 6.21005 10.848 6.14105C10.9509 6.07205 11.031 5.97401 11.0781 5.85938C11.6109 4.55703 12.8867 3.75 14.4062 3.75C15.359 3.75124 16.2724 4.13026 16.946 4.80396C17.6197 5.47765 17.9988 6.39101 18 7.34375C18 11.532 11.925 15.3242 10.5 16.1562Z" fill='white' stroke-width="2" stroke-linecap="round"></path>
              </svg>
            </div>
          )}

          <Link to={"/Cart"}>
            <div id="cartIcon" className='cursor-pointer relative'>
              <svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M0.799316 0H4.29932H4.71232L4.79032 0.405576L5.48155 4H17.2993H18.0003L17.7721 4.66279L15.7061 10.6628L15.59 11H15.2333H6.82771L7.21232 13H14.7993C15.9039 13 16.7993 13.8954 16.7993 15C16.7993 16.1046 15.9039 17 14.7993 17C13.6947 17 12.7993 16.1046 12.7993 15C12.7993 14.6357 12.8967 14.2942 13.0669 14H8.53175C8.70192 14.2942 8.79932 14.6357 8.79932 15C8.79932 16.1046 7.90389 17 6.79932 17C5.69475 17 4.79932 16.1046 4.79932 15C4.79932 14.1002 5.39351 13.3392 6.21092 13.088L3.88631 1H0.799316V0ZM6.6354 10H14.8767L16.5983 5H5.67386L6.6354 10ZM13.7993 15C13.7993 14.4477 14.247 14 14.7993 14C15.3516 14 15.7993 14.4477 15.7993 15C15.7993 15.5523 15.3516 16 14.7993 16C14.247 16 13.7993 15.5523 13.7993 15ZM5.79932 15C5.79932 14.4477 6.24703 14 6.79932 14C7.3516 14 7.79932 14.4477 7.79932 15C7.79932 15.5523 7.3516 16 6.79932 16C6.24703 16 5.79932 15.5523 5.79932 15Z" fill='white'></path>
              </svg>
              <span>{getCartCount && typeof getCartCount === "function" ? getCartCount() : "?"}</span>
            </div>
          </Link>



          {/* BARS ICON YA CLOSE ICON  */}

          {!isCheckout && (
            <div id="bars" onClick={ToggleNav} className='cursor-pointer md:hidden block'>
              {isMenuOpen ? <svg class="close-icon" width="20" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M0 1.20833L0.708333 0.5L8.50715 8.29881L16.0937 0.71224L16.8021 1.42057L9.21548 9.00715L17 16.7917L16.2917 17.5L8.50715 9.71548L0.921224 17.3014L0.212891 16.5931L7.79881 9.00715L0 1.20833Z" fill='white'></path>
              </svg> : <svg class="open-icon" width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="20" height="1" transform="matrix(-1 0 0 1 20 0.5)" fill='white'></rect>
                <rect width="17" height="1" transform="matrix(-1 0 0 1 20 8.5)" fill='white'></rect>
                <rect width="13" height="1" transform="matrix(-1 0 0 1 20 16.5)" fill='white'></rect>
              </svg>}
            </div>
          )}
        </div>
      </div>


      {/* RESPONSIVE NAVBAR MENU  */}

      {!isCheckout && isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-[9998]"
          onClick={closeMenu}
        ></div>
      )}
      <ul
        className={`lg:hidden bg-black text-white w-screen flex flex-col fixed top-31 sm:top-35 left-0 z-[9999] items-start px-6 py-5 border-t-1 border-white transition-all duration-500 ease-in-out
    ${isMenuOpen ? 'max-h-[500px] opacity-100 pointer-events-auto' : 'max-h-0 overflow-hidden opacity-0 pointer-events-none'}`}
      >
        <NavLink className='w-full py-4 border-b-[1px] border-b-[white]' to="/" onClick={closeMenu}>
          <div className='flex items-center justify-between'>
            <li className='text-sm'>Home</li>
            <img className='w-5' src={Images.chevron} alt="" />
          </div>
        </NavLink>

        <NavLink className='w-full py-4 border-b-[1px] border-b-[white]' to="/BestSellers" onClick={closeMenu}>
          <div className='flex items-center justify-between'>
            <li className='text-sm'>Best Sellers</li>
            <img className='w-5' src={Images.chevron} alt="" />
          </div>
        </NavLink>

        <NavLink className='w-full py-4 border-b-[1px] border-b-[white]' to="/Collections" onClick={closeMenu}>
          <div className='flex items-center justify-between'>
            <li className='text-sm'>Collections</li>
            <img className='w-5' src={Images.chevron} alt="" />
          </div>
        </NavLink>

        <NavLink className='w-full py-4 border-b-[1px] border-b-[white]' to="/Handbags" onClick={closeMenu}>
          <div className='flex items-center justify-between'>
            <li className='text-sm'>Laptop Handbags</li>
            <img className='w-5' src={Images.chevron} alt="" />
          </div>
        </NavLink>

        <NavLink className='w-full py-4 border-b-[1px] border-b-[white]' to="/Bagpacks" onClick={closeMenu}>
          <div className='flex items-center justify-between'>
            <li className='text-sm'>Laptop bagpacks</li>
            <img className='w-5' src={Images.chevron} alt="" />
          </div>
        </NavLink>

        <NavLink className='w-full py-4 border-b-[1px] border-b-[white]' to="/Sleeves" onClick={closeMenu}>
          <div className='flex items-center justify-between'>
            <li className='text-sm'>Laptop Sleeves</li>
            <img className='w-5' src={Images.chevron} alt="" />
          </div>
        </NavLink>
        
        <NavLink className='w-full py-4 border-b-[1px] border-b-[white]' to="/under999" onClick={closeMenu}>
          <div className='flex items-center justify-between'>
            <li className='text-sm'>Under 999</li>
            <img className='w-5' src={Images.chevron} alt="" />
          </div>
        </NavLink>

      </ul>




    </div>
  )
}

export default Navbar