import React, { useState, useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Countries from './Countries'
import { Images } from '../assets/assets'
import { shopContext } from '../context/ShopContext'

const allCountries = [
  'India', 'United States', 'Pakistan', 'Canada', 'Brazil', 'Guatemala', 'Mexico', 'Austria', 'Belgium', 'Czech Republic', 'Denmark', 'Estonia', 'Finland', 'France', 'Germany', 'Greece', 'Hungary', 'Ireland', 'Italy', 'Luxembourg', 'Netherlands', 'Norway', 'Poland', 'Portugal', 'Romania', 'Slovakia', 'Slovenia', 'Spain', 'Sweden', 'Switzerland', 'United Kingdom', 'Ukraine', 'Serbia', 'Croatia', 'China', 'Japan', 'South Korea', 'Indonesia', 'Thailand', 'Philippines', 'Malaysia', 'Vietnam', 'Singapore', 'Bangladesh', 'Sri Lanka', 'Nepal', 'Myanmar', 'Kazakhstan', 'Saudi Arabia', 'United Arab Emirates', 'Qatar', 'Kuwait', 'Oman', 'Bahrain', 'Jordan', 'Lebanon', 'Iraq', 'Syria', 'Yemen', 'Palestine', 'Egypt', 'Morocco', 'Algeria', 'Tunisia', 'Libya', 'South Africa', 'Nigeria', 'Kenya', 'Ghana', 'Ethiopia', 'Australia', 'New Zealand', 'Fiji', 'Rest of the World', 'Middle East'
];

const flagMap = {
  'India': '🇮🇳', 'United States': '🇺🇸', 'Pakistan': '🇵🇰', 'Canada': '🇨🇦', 'Brazil': '🇧🇷', 'Guatemala': '🇬🇹', 'Mexico': '🇲🇽', 'Austria': '🇦🇹', 'Belgium': '🇧🇪', 'Czech Republic': '🇨🇿', 'Denmark': '🇩🇰', 'Estonia': '🇪🇪', 'Finland': '🇫🇮', 'France': '🇫🇷', 'Germany': '🇩🇪', 'Greece': '🇬🇷', 'Hungary': '🇭🇺', 'Ireland': '🇮🇪', 'Italy': '🇮🇹', 'Luxembourg': '🇱🇺', 'Netherlands': '🇳🇱', 'Norway': '🇳🇴', 'Poland': '🇵🇱', 'Portugal': '🇵🇹', 'Romania': '🇷🇴', 'Slovakia': '🇸🇰', 'Slovenia': '🇸🇮', 'Spain': '🇪🇸', 'Sweden': '🇸🇪', 'Switzerland': '🇨🇭', 'United Kingdom': '🇬🇧', 'Ukraine': '🇺🇦', 'Serbia': '🇷🇸', 'Croatia': '🇭🇷', 'China': '🇨🇳', 'Japan': '🇯🇵', 'South Korea': '🇰🇷', 'Indonesia': '🇮🇩', 'Thailand': '🇹🇭', 'Philippines': '🇵🇭', 'Malaysia': '🇲🇾', 'Vietnam': '🇻🇳', 'Singapore': '🇸🇬', 'Bangladesh': '🇧🇩', 'Sri Lanka': '🇱🇰', 'Nepal': '🇳🇵', 'Myanmar': '🇲🇲', 'Kazakhstan': '🇰🇿', 'Saudi Arabia': '🇸🇦', 'United Arab Emirates': '🇦🇪', 'Qatar': '🇶🇦', 'Kuwait': '🇰🇼', 'Oman': '🇴🇲', 'Bahrain': '🇧🇭', 'Jordan': '🇯🇴', 'Lebanon': '🇱🇧', 'Iraq': '🇮🇶', 'Syria': '🇸🇾', 'Yemen': '🇾🇪', 'Palestine': '🇵🇸', 'Egypt': '🇪🇬', 'Morocco': '🇲🇦', 'Algeria': '🇩🇿', 'Tunisia': '🇹🇳', 'Libya': '🇱🇾', 'South Africa': '🇿🇦', 'Nigeria': '🇳🇬', 'Kenya': '🇰🇪', 'Ghana': '🇬🇭', 'Ethiopia': '🇪🇹', 'Australia': '🇦🇺', 'New Zealand': '🇳🇿', 'Fiji': '🇫🇯', 'Rest of the World': '🌐', 'Middle East': '🌍'
};

const currencyMap = {
  'India': 'INR ₹', 'United States': 'USD $', 'Pakistan': 'PKR ₨', 'Canada': 'CAD $', 'Brazil': 'BRL R$', 'Guatemala': 'GTQ Q', 'Mexico': 'MXN $', 'Austria': 'EUR €', 'Belgium': 'EUR €', 'Czech Republic': 'CZK Kč', 'Denmark': 'DKK kr', 'Estonia': 'EUR €', 'Finland': 'EUR €', 'France': 'EUR €', 'Germany': 'EUR €', 'Greece': 'EUR €', 'Hungary': 'HUF Ft', 'Ireland': 'EUR €', 'Italy': 'EUR €', 'Luxembourg': 'EUR €', 'Netherlands': 'EUR €', 'Norway': 'NOK kr', 'Poland': 'PLN zł', 'Portugal': 'EUR €', 'Romania': 'RON lei', 'Slovakia': 'EUR €', 'Slovenia': 'EUR €', 'Spain': 'EUR €', 'Sweden': 'SEK kr', 'Switzerland': 'CHF Fr', 'United Kingdom': 'GBP £', 'Ukraine': 'UAH ₴', 'Serbia': 'RSD дин', 'Croatia': 'HRK kn', 'China': 'CNY ¥', 'Japan': 'JPY ¥', 'South Korea': 'KRW ₩', 'Indonesia': 'IDR Rp', 'Thailand': 'THB ฿', 'Philippines': 'PHP ₱', 'Malaysia': 'MYR RM', 'Vietnam': 'VND ₫', 'Singapore': 'SGD S$', 'Bangladesh': 'BDT ৳', 'Sri Lanka': 'LKR ₨', 'Nepal': 'NPR ₨', 'Myanmar': 'MMK K', 'Kazakhstan': 'KZT ₸', 'Saudi Arabia': 'SAR ر.س', 'United Arab Emirates': 'AED د.إ', 'Qatar': 'QAR ر.ق', 'Kuwait': 'KWD د.ك', 'Oman': 'OMR ر.ع.', 'Bahrain': 'BHD ب.د', 'Jordan': 'JOD د.ا', 'Lebanon': 'LBP ل.ل', 'Iraq': 'IQD ع.د', 'Syria': 'SYP £S', 'Yemen': 'YER ﷼', 'Palestine': 'ILS ₪', 'Egypt': 'EGP £', 'Morocco': 'MAD د.م.', 'Algeria': 'DZD دج', 'Tunisia': 'TND د.ت', 'Libya': 'LYD ل.د', 'South Africa': 'ZAR R', 'Nigeria': 'NGN ₦', 'Kenya': 'KES KSh', 'Ghana': 'GHS ₵', 'Ethiopia': 'ETB Br', 'Australia': 'AUD A$', 'New Zealand': 'NZD NZ$', 'Fiji': 'FJD FJ$', 'Rest of the World': 'USD $', 'Middle East': 'AED د.إ'
};

const Footer = () => {
  const location = useLocation()
  const isCheckout = location.pathname === "/Checkout"
  const { updateCurrency } = useContext(shopContext);

  const [selectedCountry, setSelectedCountry] = useState(localStorage.getItem("selectedCountry") || "India")

  const handleCountryChange = async (e) => {
    const country = e.target.value;
    setSelectedCountry(country);
    localStorage.setItem("selectedCountry", country);

    const currencyCode = Object.keys(currencyMap).includes(country)
      ? currencyMap[country].split(' ')[0]
      : 'USD';

    try {
      const response = await fetch(`https://open.er-api.com/v6/latest/PKR`);
      const data = await response.json();
      if (data.result === 'success') {
        const rate = data.rates[currencyCode];
        if (rate) {
          updateCurrency(currencyCode, rate);
        } else {
          updateCurrency(currencyCode, 1);
        }
      } else {
        updateCurrency(currencyCode, 1);
      }
    } catch {
      updateCurrency(currencyCode, 1);
    }
  };

  return !isCheckout && (
    <footer className="bg-black text-white pt-12 pb-6 px-4 md:px-10">
      {/* Main Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {/* SHOP */}
        <div>
          <h4 className="font-bold mb-4 text-xs tracking-widest">SHOP</h4>
          <ul className="flex flex-col gap-5">
            <Link to={"/BestSellers"} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
              <li className="hover:underline text-xs">Best Sellers</li>
            </Link>
            <Link to={"/Collections"} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
              <li className="hover:underline text-xs">All Collections</li>
            </Link>
            <Link to={"/Handbags"} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
              <li className="hover:underline text-xs">Laptop Handbags</li>
            </Link>
            <Link to={"/Bagpacks"} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
              <li className="hover:underline text-xs">Laptop bagpacks</li>
            </Link>
            <Link to={"/Sleeves"} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
              <li className="hover:underline text-xs">Laptop Sleeves</li>
            </Link>
          </ul>
        </div>

        {/* CUSTOMER CARE */}
        <div>
          <h4 className="font-bold mb-4 text-xs tracking-widest">CUSTOMER CARE</h4>
          <ul className="flex flex-col gap-5">
            <li className="text-xs">
              <Link
                to="/yourOrders"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  localStorage.setItem("highlightAllTrackOrder", "1");
                }}
                className="hover:underline"
              >
                Track My Order
              </Link>
            </li>
            <li className="text-xs">
              <Link to="/faq/returns" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="hover:underline">Return & Exchange</Link>
            </li>
            <li className="text-xs">
              <Link to="/privacy-policy" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="hover:underline">Privacy Policy</Link>
            </li>
            <li className="text-xs">
              <Link to="/terms-of-service" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="hover:underline">Terms Of Service</Link>
            </li>
            <li className="text-xs">
              <Link to="/faq/Products" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="hover:underline">FAQs</Link>
            </li>
          </ul>
        </div>


        {/* NEWSLETTER */}
        <div>
          <h4 className="font-bold mb-4 text-xs tracking-widest">NEWSLETTER</h4>
          <p className="text-xs mb-4 text-gray-300">
            Subscribe to get notified about product launches, special offers and company news.
          </p>
          <form className="flex flex-col gap-2">
            <input
              type="email"
              placeholder="E-mail"
              className="px-3 py-2 rounded border border-white bg-transparent text-white placeholder-gray-400 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-white text-black px-4 py-2 rounded font-semibold text-xs hover:bg-gray-200 transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-700 my-6"></div>

      {/* Bottom Row */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Country Select */}
        <div className="flex items-center gap-2">
          <select
            value={selectedCountry}
            onChange={handleCountryChange}
            className="bg-black border border-gray-600 text-white text-xs rounded px-2 py-1"
          >
            {allCountries.map((country) => (
              <option key={country} value={country}>
                {flagMap[country] ? `${flagMap[country]} ` : ''}{country} {currencyMap[country] ? `(${currencyMap[country]})` : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Copyright */}
        <div className="text-xs text-gray-400 text-center">
          © 2025 RHR Creative All rights reserved.
        </div>
        
        {/* Payment Icons */}
        <div className="flex gap-2">
          <img src="https://img.icons8.com/color/32/visa.png" alt="Visa" className="h-6" />
          <img src="https://img.icons8.com/color/32/mastercard.png" alt="Mastercard" className="h-6" />
          <img src={Images.jazzcashImg} alt="JazzCash" className="h-6" />
          <img src={Images.easypaisaImg} alt="Easypaisa" className="h-6" />
        </div>
      </div>
    </footer>
  )
}
export default Footer