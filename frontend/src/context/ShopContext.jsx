import React, { createContext, useEffect, useState } from 'react'
import SlideNotification from '../components/SlideNotification';
import axios from "axios";
export const shopContext = createContext()


const defaultCurrency = {
  code: 'PKR',
  symbol: '₨',
  rate: 1,
}

const deliveryFeeMap = {
  'PKR': 250,    // Pakistan
  'INR': 600,    // India
  'USD': 25,     // United States, Rest of the World
  'CAD': 28,     // Canada
  'BRL': 80,     // Brazil
  'GTQ': 200,    // Guatemala
  'MXN': 400,    // Mexico
  'EUR': 20,     // Europe
  'CZK': 400,    // Czech Republic
  'DKK': 350,    // Denmark
  'HUF': 400,    // Hungary
  'NOK': 350,    // Norway
  'PLN': 350,    // Poland
  'RON': 350,    // Romania
  'SEK': 350,    // Sweden
  'CHF': 25,     // Switzerland
  'GBP': 18,     // United Kingdom
  'UAH': 800,    // Ukraine
  'RSD': 800,    // Serbia
  'HRK': 800,    // Croatia (added)
  'CNY': 300,    // China
  'JPY': 3500,   // Japan
  'KRW': 3500,   // South Korea
  'IDR': 400000, // Indonesia
  'THB': 600,    // Thailand
  'PHP': 800,    // Philippines
  'MYR': 70,     // Malaysia
  'VND': 800000, // Vietnam
  'SGD': 25,     // Singapore
  'BDT': 2000,   // Bangladesh
  'LKR': 2500,   // Sri Lanka
  'NPR': 2000,   // Nepal
  'MMK': 20000,  // Myanmar
  'KZT': 8000,   // Kazakhstan
  'SAR': 30,     // Saudi Arabia
  'AED': 35,     // UAE/Middle East
  'QAR': 30,     // Qatar
  'KWD': 30,     // Kuwait
  'OMR': 30,     // Oman
  'BHD': 30,     // Bahrain
  'JOD': 30,     // Jordan
  'LBP': 30000,  // Lebanon
  'IQD': 30000,  // Iraq
  'SYP': 30000,  // Syria
  'YER': 30000,  // Yemen
  'ILS': 100,    // Palestine
  'EGP': 1000,   // Egypt
  'MAD': 800,    // Morocco
  'DZD': 800,    // Algeria
  'TND': 800,    // Tunisia
  'LYD': 800,    // Libya (added)
  'ZAR': 40,     // South Africa
  'NGN': 12000,  // Nigeria
  'KES': 4000,   // Kenya
  'GHS': 800,    // Ghana
  'ETB': 2000,   // Ethiopia
  'AUD': 30,     // Australia
  'NZD': 35,     // New Zealand
  'FJD': 40,     // Fiji
  'USD_INTL': 40,
};
const currencyMap = {
  'United States': 'USD',
  'Canada': 'CAD',
  'Brazil': 'BRL',
  'Guatemala': 'GTQ',
  'Mexico': 'MXN',
  'Austria': 'EUR',
  'Belgium': 'EUR',
  'Czech Republic': 'CZK',
  'Denmark': 'DKK',
  'Estonia': 'EUR',
  'Finland': 'EUR',
  'France': 'EUR',
  'Germany': 'EUR',
  'Greece': 'EUR',
  'Hungary': 'HUF',
  'Ireland': 'EUR',
  'Italy': 'EUR',
  'Luxembourg': 'EUR',
  'Netherlands': 'EUR',
  'Norway': 'NOK',
  'Poland': 'PLN',
  'Portugal': 'EUR',
  'Romania': 'RON',
  'Slovakia': 'EUR',
  'Slovenia': 'EUR',
  'Spain': 'EUR',
  'Sweden': 'SEK',
  'Switzerland': 'CHF',
  'United Kingdom': 'GBP',
  'Ukraine': 'UAH',
  'Serbia': 'RSD',
  'Croatia': 'HRK',
  'India': 'INR',
  'China': 'CNY',
  'Japan': 'JPY',
  'South Korea': 'KRW',
  'Indonesia': 'IDR',
  'Thailand': 'THB',
  'Philippines': 'PHP',
  'Malaysia': 'MYR',
  'Vietnam': 'VND',
  'Singapore': 'SGD',
  'Bangladesh': 'BDT',
  'Pakistan': 'PKR',
  'Sri Lanka': 'LKR',
  'Nepal': 'NPR',
  'Myanmar': 'MMK',
  'Kazakhstan': 'KZT',
  'Saudi Arabia': 'SAR',
  'United Arab Emirates': 'AED',
  'Qatar': 'QAR',
  'Kuwait': 'KWD',
  'Oman': 'OMR',
  'Bahrain': 'BHD',
  'Jordan': 'JOD',
  'Lebanon': 'LBP',
  'Iraq': 'IQD',
  'Syria': 'SYP',
  'Yemen': 'YER',
  'Palestine': 'ILS',
  'Egypt': 'EGP',
  'Morocco': 'MAD',
  'Algeria': 'DZD',
  'Tunisia': 'TND',
  'Libya': 'LYD',
  'South Africa': 'ZAR',
  'Nigeria': 'NGN',
  'Kenya': 'KES',
  'Ghana': 'GHS',
  'Ethiopia': 'ETB',
  'Australia': 'AUD',
  'New Zealand': 'NZD',
  'Fiji': 'FJD',
  'Rest of the World': 'USD',
  'Middle East': 'AED'
};


const currencySymbols = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  PKR: '₨',
  INR: '₹',
  CAD: 'C$',
  AUD: 'A$',
  AED: 'د.إ',
  BRL: 'R$',
  GTQ: 'Q',
  MXN: '$',
  CZK: 'Kč',
  DKK: 'kr',
  HUF: 'Ft',
  NOK: 'kr',
  PLN: 'zł',
  RON: 'lei',
  SEK: 'kr',
  CHF: 'Fr',
  UAH: '₴',
  RSD: 'дин',
  HRK: 'kn',
  CNY: '¥',
  JPY: '¥',
  KRW: '₩',
  IDR: 'Rp',
  THB: '฿',
  PHP: '₱',
  MYR: 'RM',
  VND: '₫',
  SGD: 'S$',
  BDT: '৳',
  LKR: '₨',
  NPR: '₨',
  MMK: 'K',
  KZT: '₸',
  SAR: 'ر.س',
  QAR: 'ر.ق',
  KWD: 'د.ك',
  OMR: 'ر.ع.',
  BHD: 'ب.د',
  JOD: 'د.ا',
  LBP: 'ل.ل',
  IQD: 'ع.د',
  SYP: '£S',
  YER: '﷼',
  ILS: '₪',
  EGP: '£',
  MAD: 'د.م.',
  DZD: 'دج',
  TND: 'د.ت',
  LYD: 'ل.د',
  ZAR: 'R',
  NGN: '₦',
  KES: 'KSh',
  GHS: '₵',
  ETB: 'Br',
  NZD: 'NZ$',
  FJD: 'FJ$',
  USD_INTL: '$'
};

const ShopContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
  const [APIproducts, setAPIProducts] = useState([]);
  const [currency, setCurrency] = useState(defaultCurrency)
  const [notif, setNotif] = useState({ show: false, message: '' });
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [email, setEmail] = useState(localStorage.getItem("email") || "");
  const [userName, setUserName] = useState(localStorage.getItem("name") || "");

  const [cartItems, setCartItems] = useState(() => {
    const email = localStorage.getItem('email');
    const key = email ? `cartItems_${email}` : 'cartItems_guest';
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : {};
  });

  const [favourites, setFavourites] = useState(() => {
    const email = localStorage.getItem('email');
    const key = email ? `favourites_${email}` : 'favourites_guest';
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : [];
  });

  const logout = () => {
    setToken('');
    setEmail('');
    setUserName('');
    setCartItems({});
    setFavourites([]);
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('name');
  };

  const showNotification = (msg) => {
    setNotif({ show: true, message: msg });
    setTimeout(() => setNotif({ show: false, message: '' }), 7000);
  };


const updateCurrency = (code, rate) => {
  code = (code || 'USD').trim();
  setCurrency({
    code,
    symbol: currencySymbols[code] || code,
    rate: rate && rate > 0 ? rate : 1,
  });
};

const getDeliveryFee = () => {
  let code = (currency.code || 'USD').trim();
  let rate = currency?.rate;
  if (!rate || rate <= 0) rate = 1;
  if (deliveryFeeMap[code]) {
    return Math.round(deliveryFeeMap[code] * rate);
  }
  return Math.round(deliveryFeeMap['USD_INTL'] * rate);
};

  const addToCart = async (itemId, selectedColor, quantity = 1, imageIndex = 0) => {

    let cartData = { ...cartItems };

    if (!cartData[itemId]) cartData[itemId] = {};
    if (!cartData[itemId][selectedColor]) cartData[itemId][selectedColor] = {};
    const imgIdx = String(imageIndex);
    if (typeof cartData[itemId][selectedColor][imgIdx] !== "number") {
      cartData[itemId][selectedColor][imgIdx] = 0;
    }

    cartData[itemId][selectedColor][imgIdx] += quantity;

    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(`${backendUrl}/api/cart/add`, {
          itemId,
          selectedColor,
          imageIndex,
          quantity
        }, {
          headers: { token }
        });

      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }




  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const itemId in cartItems) {
      for (const color in cartItems[itemId]) {
        for (const imageIndex in cartItems[itemId][color]) {
          const val = cartItems[itemId][color][imageIndex];
          if (typeof val === "number") {
            totalCount += val;
          }
        }
      }
    }
    return totalCount;
  };

  const getCartAmount = () => {
    let total = 0;
    const allProducts = [...(APIproducts || []),];
    Object.entries(cartItems).forEach(([itemId, colorObj]) => {
      const product = allProducts.find(p => p._id === itemId);
      if (!product) return;
      Object.values(colorObj).forEach(imageObj =>
        Object.values(imageObj).forEach(qty => {
          if (typeof qty !== "number") return;

          let price = product.price;
          let discountPercent = product.discountPercent;
          let wholesalePrice = product.wholesalePrice;

          let discountedPrice = price;
          if (discountPercent && !isNaN(discountPercent)) {
            discountedPrice = Math.round(price - (price * discountPercent / 100));
          }

          let finalPrice = price;
          if (qty >= 50 && wholesalePrice) {
            finalPrice = wholesalePrice;
          } else if (discountPercent) {
            finalPrice = discountedPrice;
          }

          total += Math.round(finalPrice * (currency?.rate || 1)) * qty;
        })
      );
    });
    return total;
  };

  const getCartTotal = () => {
    return getCartAmount() + getDeliveryFee();
  };


  const addToFavourites = (itemId) => {
    if (!favourites.includes(itemId)) {
      const updated = [...favourites, itemId];
      setFavourites(updated);
      localStorage.setItem('favourites', JSON.stringify(updated));
    }
  };

  const removeFromFavourites = (itemId) => {
    const updated = favourites.filter(id => id !== itemId);
    setFavourites(updated);
    localStorage.setItem('favourites', JSON.stringify(updated));
  };

  const getProductData = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`);
      if (response.data.success) {
        setAPIProducts(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred. Please try again later.");
    }
  };

  const getUserCart = async ( token ) => {
    try{
      const response = await axios.post(`${backendUrl}/api/cart/get`, {}, {headers : {token}})
      if(response.data.success){
        setCartItems(response.data.cartData)
      }
    } catch (error) {
        console.log(error);
        toast.error(error.message)
    }
    
  }
  useEffect(() => {
    getProductData();
  }, []);

  useEffect(()=>{
    if(!token && localStorage.getItem('token')) {
      setToken(localStorage.getItem('token'))
      getUserCart(localStorage.getItem('token'))
    }

  }, [])

  useEffect(() => {
    const key = email ? `cartItems_${email}` : 'cartItems_guest';
    localStorage.setItem(key, JSON.stringify(cartItems));
  }, [cartItems, email]);

  useEffect(() => {
    const key = email ? `favourites_${email}` : 'favourites_guest';
    localStorage.setItem(key, JSON.stringify(favourites));
  }, [favourites, email]);

  useEffect(() => {
    localStorage.setItem('token', token);
    localStorage.setItem('email', email);
    localStorage.setItem('name', userName);
  }, [token, email, userName]);

  useEffect(() => {
    if (email) {
      const guestCart = JSON.parse(localStorage.getItem('cartItems_guest')) || {};
      const guestFavs = JSON.parse(localStorage.getItem('favourites_guest')) || [];
      const userCart = JSON.parse(localStorage.getItem(`cartItems_${email}`)) || {};
      const userFavs = JSON.parse(localStorage.getItem(`favourites_${email}`)) || [];

      const mergedCart = { ...userCart };
      for (const itemId in guestCart) {
        mergedCart[itemId] = {
          ...(userCart[itemId] || {}),
          ...(guestCart[itemId] || {})
        };
      }

      const mergedFavs = [...new Set([...userFavs, ...guestFavs])];

      setCartItems(mergedCart);
      setFavourites(mergedFavs);

      localStorage.removeItem('cartItems_guest');
      localStorage.removeItem('favourites_guest');
    }
  }, [email]);

  useEffect(() => {
  const savedCountry = localStorage.getItem("selectedCountry");

  if (savedCountry) {
    const savedCurrency = currencyMap[savedCountry] || 'USD';
fetch(`https://open.er-api.com/v6/latest/PKR`)
  .then(res => res.json())
  .then(data => {
    if (data.result === 'success') {
      const rate = data.rates[savedCurrency];
      if (rate) {
        updateCurrency(savedCurrency, rate);
      } else {
        updateCurrency(savedCurrency, 1);
      }
    } else {
      updateCurrency(savedCurrency, 1);
    }
  })
  .catch(err => {
    updateCurrency(savedCurrency, 1);
    console.error("Currency fetch error:", err);
  });
  }
}, []);


  const value = {
    cartItems,
    setCartItems,
    addToCart,
    getCartCount,
    getCartAmount,
    currency,
    updateCurrency,
    getDeliveryFee,
    getCartTotal,
    favourites,
    addToFavourites,
    removeFromFavourites,
    showNotification,
    backendUrl,
    APIproducts,
    setAPIProducts,
    token,
    setToken,
    email,
    setEmail,
    userName,
    setUserName,
    logout,
  }

  return (
    <shopContext.Provider value={value}>
      <SlideNotification show={notif.show} message={notif.message} />
      {props.children}
    </shopContext.Provider>
  )
}

export default ShopContextProvider