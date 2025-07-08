import React, { useContext, useEffect, useState } from 'react';
import { shopContext } from '../../context/ShopContext';
import { useProfileDrawer } from '../../context/ProfileDrawerContext';
import { Navigate, NavLink, useNavigate } from 'react-router-dom';
import { Images } from '../../assets/assets';
import axios from 'axios';

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  address1: "",
  address2: "",
  country: "",
  state: "",
  city: "",
  zip: "",
  mobile: "",
  paymentMethod: "COD",
};

const validate = (form) => {
  const errors = {};
  if (!form.firstName) errors.firstName = 'First Name is required';
  if (!form.lastName) errors.lastName = 'Last Name is required';
  if (!form.email) errors.email = 'Email is required';
  else if (!/\S+@\S+\.\S+/.test(form.email)) errors.email = 'Invalid email';
  if (!form.address1) errors.address1 = 'Address 1 is required';
  if (!form.country) errors.country = 'Country is required';
  if (!form.city) errors.city = 'City is required';
  if (!form.state) errors.state = 'State is required';
  if (!form.zip) errors.zip = 'Zip code is required';
  if (!form.mobile) errors.mobile = 'Mobile number is required';
  if (!form.paymentMethod) {
    errors.paymentMethod = "Please select a payment method";
  }

  else if (!/^[0-9+\-\s]{7,}$/.test(form.mobile)) errors.mobile = 'Invalid mobile number';
  return errors;
};

const countriesList = [
  'Pakistan', 'India', 'United States', 'Canada', 'Brazil', 'Guatemala', 'Mexico', 'Austria', 'Belgium', 'Czech Republic', 'Denmark', 'Estonia', 'Finland', 'France', 'Germany', 'Greece', 'Hungary', 'Ireland', 'Italy', 'Luxembourg', 'Netherlands', 'Norway', 'Poland', 'Portugal', 'Romania', 'Slovakia', 'Slovenia', 'Spain', 'Sweden', 'Switzerland', 'United Kingdom', 'Ukraine', 'Serbia', 'Croatia', 'China', 'Japan', 'South Korea', 'Indonesia', 'Thailand', 'Philippines', 'Malaysia', 'Vietnam', 'Singapore', 'Bangladesh', 'Sri Lanka', 'Nepal', 'Myanmar', 'Kazakhstan', 'Saudi Arabia', 'United Arab Emirates', 'Qatar', 'Kuwait', 'Oman', 'Bahrain', 'Jordan', 'Lebanon', 'Iraq', 'Syria', 'Yemen', 'Palestine', 'Egypt', 'Morocco', 'Algeria', 'Tunisia', 'Libya', 'South Africa', 'Nigeria', 'Kenya', 'Ghana', 'Ethiopia', 'Australia', 'New Zealand', 'Fiji'
];

const statesList = {
  Pakistan: ['Punjab', 'Sindh', 'KPK', 'Balochistan', 'Islamabad'],
  India: ['Punjab', 'Delhi', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Gujarat', 'Uttar Pradesh'],
  'United States': ['California', 'Texas', 'New York', 'Florida', 'Illinois', 'Washington', 'Georgia'],
  Canada: ['Ontario', 'Quebec', 'British Columbia', 'Alberta', 'Manitoba'],
  Brazil: ['São Paulo', 'Rio de Janeiro', 'Bahia', 'Paraná'],
  Guatemala: ['Guatemala', 'Huehuetenango', 'Quetzaltenango'],
  Mexico: ['Mexico City', 'Jalisco', 'Nuevo León', 'Puebla'],
  Austria: ['Vienna', 'Salzburg', 'Tyrol'],
  Belgium: ['Brussels', 'Flanders', 'Wallonia'],
  'Czech Republic': ['Prague', 'South Moravian', 'Central Bohemian'],
  Denmark: ['Copenhagen', 'Aarhus', 'Odense'],
  Estonia: ['Harju', 'Tartu', 'Ida-Viru'],
  Finland: ['Uusimaa', 'Pirkanmaa', 'Varsinais-Suomi'],
  France: ['Île-de-France', 'Provence', 'Normandy'],
  Germany: ['Bavaria', 'Berlin', 'Hamburg', 'Hesse'],
  Greece: ['Attica', 'Central Macedonia', 'Crete'],
  Hungary: ['Budapest', 'Pest', 'Bács-Kiskun'],
  Ireland: ['Dublin', 'Cork', 'Galway'],
  Italy: ['Lombardy', 'Lazio', 'Sicily'],
  Luxembourg: ['Luxembourg'],
  Netherlands: ['North Holland', 'South Holland', 'Utrecht'],
  Norway: ['Oslo', 'Bergen', 'Trondheim'],
  Poland: ['Masovian', 'Lesser Poland', 'Greater Poland'],
  Portugal: ['Lisbon', 'Porto', 'Coimbra'],
  Romania: ['Bucharest', 'Cluj', 'Timiș'],
  Slovakia: ['Bratislava', 'Košice', 'Prešov'],
  Slovenia: ['Ljubljana', 'Maribor', 'Celje'],
  Spain: ['Madrid', 'Catalonia', 'Andalusia'],
  Sweden: ['Stockholm', 'Gothenburg', 'Skåne'],
  Switzerland: ['Zurich', 'Geneva', 'Bern'],
  'United Kingdom': ['England', 'Scotland', 'Wales', 'Northern Ireland'],
  Ukraine: ['Kyiv', 'Lviv', 'Odessa'],
  Serbia: ['Belgrade', 'Novi Sad', 'Niš'],
  Croatia: ['Zagreb', 'Split', 'Rijeka'],
  China: ['Beijing', 'Shanghai', 'Guangdong'],
  Japan: ['Tokyo', 'Osaka', 'Kyoto'],
  'South Korea': ['Seoul', 'Busan', 'Incheon'],
  Indonesia: ['Jakarta', 'Bali', 'West Java'],
  Thailand: ['Bangkok', 'Chiang Mai', 'Phuket'],
  Philippines: ['Manila', 'Cebu', 'Davao'],
  Malaysia: ['Kuala Lumpur', 'Penang', 'Johor'],
  Vietnam: ['Hanoi', 'Ho Chi Minh City', 'Da Nang'],
  Singapore: ['Singapore'],
  Bangladesh: ['Dhaka', 'Chittagong', 'Khulna'],
  'Sri Lanka': ['Colombo', 'Kandy', 'Galle'],
  Nepal: ['Kathmandu', 'Pokhara', 'Lalitpur'],
  Myanmar: ['Yangon', 'Mandalay', 'Naypyidaw'],
  Kazakhstan: ['Almaty', 'Nur-Sultan', 'Shymkent'],
  'Saudi Arabia': ['Riyadh', 'Jeddah', 'Mecca'],
  'United Arab Emirates': ['Dubai', 'Abu Dhabi', 'Sharjah'],
  Qatar: ['Doha', 'Al Rayyan', 'Umm Salal'],
  Kuwait: ['Kuwait City', 'Hawalli', 'Salmiya'],
  Oman: ['Muscat', 'Salalah', 'Sohar'],
  Bahrain: ['Manama', 'Muharraq', 'Riffa'],
  Jordan: ['Amman', 'Zarqa', 'Irbid'],
  Lebanon: ['Beirut', 'Tripoli', 'Sidon'],
  Iraq: ['Baghdad', 'Basra', 'Mosul'],
  Syria: ['Damascus', 'Aleppo', 'Homs'],
  Yemen: ['Sana\'a', 'Aden', 'Taiz'],
  Palestine: ['Gaza', 'Ramallah', 'Hebron'],
  Egypt: ['Cairo', 'Alexandria', 'Giza'],
  Morocco: ['Casablanca', 'Rabat', 'Marrakesh'],
  Algeria: ['Algiers', 'Oran', 'Constantine'],
  Tunisia: ['Tunis', 'Sfax', 'Sousse'],
  Libya: ['Tripoli', 'Benghazi', 'Misrata'],
  'South Africa': ['Johannesburg', 'Cape Town', 'Durban'],
  Nigeria: ['Lagos', 'Abuja', 'Kano'],
  Kenya: ['Nairobi', 'Mombasa', 'Kisumu'],
  Ghana: ['Accra', 'Kumasi', 'Tamale'],
  Ethiopia: ['Addis Ababa', 'Gondar', 'Mekelle'],
  Australia: ['New South Wales', 'Victoria', 'Queensland'],
  'New Zealand': ['Auckland', 'Wellington', 'Christchurch'],
  Fiji: ['Central', 'Western', 'Northern'],
};

const Checkout = ({setShowDrawer}) => {
  const { cartItems, APIproducts, currency, getCartAmount, getDeliveryFee, getCartTotal, token, backendUrl, showNotification, setCartItems } = useContext(shopContext);
  
  const isPakistan = currency.code === "PKR";
  const navigate = useNavigate();
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const paymentMethods = isPakistan
    ? ["Bank Transfer", "JazzCash", "EasyPaisa", "COD"]
    : ["Bank Transfer"];


  const [cartData, setCartData] = useState([]);

  const paymentIcons = {
    "Bank Transfer": Images.bank,
    "JazzCash": Images.jazzcashImg,
    "EasyPaisa": Images.easypaisaImg,
  };

  useEffect(() => {
    if (!APIproducts || Object.keys(cartItems).length === 0) {
      setCartData([]);
      return;
    }

    const tempData = [];
    const allProducts = [...APIproducts];

    for (const itemId in cartItems) {
      for (const color in cartItems[itemId]) {
        for (const imageIndex in cartItems[itemId][color]) {
          const quantity = cartItems[itemId][color][imageIndex];
          if (quantity > 0) {
            const productData = allProducts.find((p) => p._id === itemId);
            if (productData) {
              tempData.push({
                _id: itemId,
                color,
                imageIndex,
                quantity,
                productData,
              });
            }
          }
        }
      }
    }

    setCartData(tempData);
  }, [APIproducts, cartItems]);


  useEffect(() => {
    window.scrollTo(0, 0);
  }, [cartItems, APIproducts])

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
    setErrors(validate({ ...form, [e.target.name]: e.target.value }));
  };

  const { openProfileDrawer } = useProfileDrawer();

  const handleSubmit = async (e) => {
    e.preventDefault();

const token = localStorage.getItem("token");
  if (!token) {
    showNotification("Please login to place your order.");
    openProfileDrawer();
    return;
  }

    const errs = validate(form);
    setErrors(errs);
    setTouched({
      firstName: true, lastName: true, email: true, address1: true, country: true,
      city: true, state: true, zip: true, mobile: true
    });

    if (Object.keys(errs).length !== 0) return;

    const address = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      address1: form.address1,
      address2: form.address2 || '',
      country: form.country,
      city: form.city,
      state: form.state,
      zip: form.zip,
      mobile: form.mobile,
    };

    const items = [];

    for (const itemId in cartItems) {
  const product = APIproducts.find(p => p._id === itemId);
  if (!product) continue;

  const colorObj = cartItems[itemId];
  for (const color in colorObj) {
    const imageObj = colorObj[color];
    const colorIndex = product.colorImages?.findIndex(
      (c) => c.color.toLowerCase() === color.toLowerCase()
    );
    for (const imageIndex in imageObj) {
      const qty = imageObj[imageIndex];
      if (qty <= 0) continue;

      const imageArray = product.colorImages?.[colorIndex]?.images || [];
      const imageSrc = imageArray?.[imageIndex] || imageArray?.[0] || '';

      items.push({
        productId: itemId,
        productName: product.productName, 
        selectedColor: color,
        image: imageSrc, 
        price: product.price,
        discountPercent: product.discountPercent || 0,
        wholesalePrice: product.wholesalePrice || 0,
        quantity: qty
      });
    }
  }
}

const orderData = {
  userId: localStorage.getItem("userId"),
  items,
  amount: getCartTotal(),
  address,
  currency: (currency && currency.code) ? currency.code : "PKR",
  deliveryFee: getDeliveryFee(),
};

    try {
      const response = await axios.post(
        `${backendUrl}/api/order/COD`,
        orderData,
        {
          headers: {
            token: localStorage.getItem('token')
          }
        }
      );


      if (response.data.success) {
        showNotification("Order Placed Successfully!");
        setCartItems({})
        setForm(initialForm);
        setIsPopupVisible(true);
      } else {
        alert("❌ Order failed: " + response.data.message);
      }
    } catch (err) {
      console.error(err);
      alert("❌ Server Error");
    }
    console.log("currency:", currency);
console.log("orderData:", orderData);
  };

  return (
    <div className="bg-[#fafafa] min-h-screen py-6 px-2 sm:px-4 md:px-8 flex flex-col md:flex-row gap-8 max-w-[1400px] mx-auto">
      {/* Left: Shipping Form */}
      <form
        className="flex flex-col w-full gap-10 bg-white rounded-lg shadow p-4 sm:p-6 md:p-8 mb-8 md:mb-0"
        onSubmit={handleSubmit}
      >
        <h2 className="text-xl sm:text-2xl font-normal">Shipping Details</h2>
        <div className='flex justify-start flex-col gap-10'>
          <div className="flex flex-col md:flex-row gap-10 w-full">
            {/* First Name */}
            <div className="relative w-full">
              <input
                type="text"
                name="firstName"
                id="firstName"
                className={`block w-full px-2 py-2 text-sm border-b-[1px] bg-transparent appearance-none focus:outline-none focus:ring-0 peer focus:border-b-black transition-all duration-200 
      ${errors.firstName && touched.firstName ? "border-red-500" : "border-gray-300"}`}
                value={form.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder=" "
              />

              <label
                htmlFor="firstName"
                className={`
                absolute left-2 transition-all duration-200 text-sm pointer-events-none 
               text-gray-400
                peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm 
                peer-focus:-top-4 peer-focus:text-xs peer-focus:text-black
                ${form.firstName ? "-top-4 text-xs text-black" : ""}
    `}
              >
                First Name *
              </label>

              {errors.firstName && touched.firstName && (
                <div className="text-xs text-red-500 mt-1">{errors.firstName}</div>
              )}
            </div>

            {/* Last Name */}
            <div className="relative w-full">
              <input
                type="text"
                name="lastName"
                id="lastName"
                className={`block w-full px-2 py-2 text-sm border-b-[1px] bg-transparent appearance-none focus:outline-none focus:ring-0 peer focus:border-b-black transition-all duration-200 ${errors.lastName && touched.lastName ? "border-red-500" : "border-gray-300"}`}
                value={form.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder=" "
              />
              <label
                htmlFor="lastName"
                className={`
                absolute left-2 transition-all duration-200 text-sm pointer-events-none 
               text-gray-400
                peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm 
                peer-focus:-top-4 peer-focus:text-xs peer-focus:text-black
                ${form.lastName ? "-top-4 text-xs text-black" : ""}
    `}
              >
                Last Name *
              </label>
              {errors.lastName && touched.lastName && <div className="text-xs text-red-500 mt-1">{errors.lastName}</div>}
            </div>
          </div>

          {/* Email */}
          <div className="relative">
            <input
              type="email"
              name="email"
              id="email"
              className={`block w-full px-2 py-2 text-sm border-b-[1px] bg-transparent appearance-none focus:outline-none focus:ring-0 peer focus:border-b-black transition-all duration-200 ${errors.email && touched.email ? "border-red-500" : "border-gray-300"}`}
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder=" "
            />
            <label
              htmlFor="email"
              className={`
                absolute left-2 transition-all duration-200 text-sm pointer-events-none 
               text-gray-400
                peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm 
                peer-focus:-top-4 peer-focus:text-xs peer-focus:text-black
                ${form.email ? "-top-4 text-xs text-black" : ""}
    `}
            >
              Email *
            </label>
            {errors.email && touched.email && <div className="text-xs text-red-500 mt-1">{errors.email}</div>}
          </div>

          {/* Address 1 */}
          <div className="relative">
            <input
              type="text"
              name="address1"
              id="address1"
              className={`block w-full px-2 py-2 text-sm border-b-[1px] bg-transparent appearance-none focus:outline-none focus:ring-0 peer focus:border-b-black transition-all duration-200 ${errors.address1 && touched.address1 ? "border-red-500" : "border-gray-300"}`}
              value={form.address1}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder=" "
            />
            <label
              htmlFor="address1"
              className={`
                absolute left-2 transition-all duration-200 text-sm pointer-events-none 
               text-gray-400
                peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm 
                peer-focus:-top-4 peer-focus:text-xs peer-focus:text-black
                ${form.address1 ? "-top-4 text-xs text-black" : ""}
    `}
            >
              Address Line 1 *
            </label>
            {errors.address1 && touched.address1 && <div className="text-xs text-red-500 mt-1">{errors.address1}</div>}
          </div>

          {/* Address 2 */}
          <div className="relative">
            <input
              type="text"
              name="address2"
              id="address2"
              className="block w-full px-2 py-2 text-sm border-b-[1px] bg-transparent appearance-none focus:outline-none focus:ring-0 peer focus:border-b-black transition-all duration-200 border-gray-300"
              value={form.address2}
              onChange={handleChange}
              placeholder=" "
            />
            <label
              htmlFor="address2"
              className={`
                absolute left-2 transition-all duration-200 text-sm pointer-events-none 
               text-gray-400
                peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm 
                peer-focus:-top-4 peer-focus:text-xs peer-focus:text-black
                ${form.address2 ? "-top-4 text-xs text-black" : ""}
    `}
            >
              Address Line 2 (Optional)
            </label>
          </div>

          {/* Country, City */}
          <div className="flex flex-col md:flex-row gap-10 w-full">
            {/* Country */}
            <div className="relative w-full">
              <select
                name="country"
                id="country"
                className={`block w-full px-2 py-2 text-sm border-b-[1px] bg-transparent appearance-none focus:outline-none focus:ring-0 peer focus:border-b-black transition-all duration-200 ${errors.country && touched.country ? "border-red-500" : "border-gray-300"}`}
                value={form.country}
                onChange={e => {
                  handleChange(e);
                  setForm(f => ({ ...f, state: '' }));
                }}
                onBlur={handleBlur}
              >
                <option value="">Select Country</option>
                {countriesList.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {errors.country && touched.country && <div className="text-xs text-red-500 mt-1">{errors.country}</div>}
            </div>
            {/* City */}
            <div className="relative w-full">
              <input
                type="text"
                name="city"
                id="city"
                className={`block w-full px-2 py-2 text-sm border-b-[1px] bg-transparent appearance-none focus:outline-none focus:ring-0 peer focus:border-b-black transition-all duration-200 ${errors.city && touched.city ? "border-red-500" : "border-gray-300"}`}
                value={form.city}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder=" "
              />
              <label
                htmlFor="city"
                className={`
                absolute left-2 transition-all duration-200 text-sm pointer-events-none 
               text-gray-400
                peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm 
                peer-focus:-top-4 peer-focus:text-xs peer-focus:text-black
                ${form.city ? "-top-4 text-xs text-black" : ""}
    `}
              >
                City *
              </label>
              {errors.city && touched.city && <div className="text-xs text-red-500 mt-1">{errors.city}</div>}
            </div>
          </div>

          {/* State, Zip */}
          <div className="flex flex-col md:flex-row gap-10 w-full">
            {/* State */}
            <div className="relative w-full">
              <select
                name="state"
                id="state"
                className={`block w-full px-2 py-2 text-sm border-b-[1px] bg-transparent appearance-none focus:outline-none focus:ring-0 peer focus:border-b-black transition-all duration-200 ${errors.state && touched.state ? "border-red-500" : "border-gray-300"}`}
                value={form.state}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={!form.country}
              >
                <option value="">Select State</option>
                {(statesList[form.country] || []).map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              {errors.state && touched.state && <div className="text-xs text-red-500 mt-1">{errors.state}</div>}
            </div>
            {/* Zip */}
            <div className="relative w-full">
              <input
                type="text"
                name="zip"
                id="zip"
                className={`block w-full px-2 py-2 text-sm border-b-[1px] bg-transparent appearance-none focus:outline-none focus:ring-0 peer focus:border-b-black transition-all duration-200 ${errors.zip && touched.zip ? "border-red-500" : "border-gray-300"}`}
                value={form.zip}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder=" "
              />
              <label
                htmlFor="zip"
                className={`
                absolute left-2 transition-all duration-200 text-sm pointer-events-none 
               text-gray-400
                peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm 
                peer-focus:-top-4 peer-focus:text-xs peer-focus:text-black
                ${form.zip ? "-top-4 text-xs text-black" : ""}
    `}
              >
                Zip Code *
              </label>
              {errors.zip && touched.zip && <div className="text-xs text-red-500 mt-1">{errors.zip}</div>}
            </div>
          </div>

          {/* Mobile */}
          <div className="relative">
            <input
              type="text"
              name="mobile"
              id="mobile"
              className={`block w-full px-2 py-2 text-sm border-b-[1px] bg-transparent appearance-none focus:outline-none focus:ring-0 focus:border-b-black peer transition-all duration-200 ${errors.mobile && touched.mobile ? "border-red-500" : "border-gray-300"}`}
              value={form.mobile}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder=" "
            />
            <label
              htmlFor="mobile"
              className={`
                absolute left-2 transition-all duration-200 text-sm pointer-events-none 
               text-gray-400
                peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm 
                peer-focus:-top-4 peer-focus:text-xs peer-focus:text-black
                ${form.mobile ? "-top-4 text-xs text-black" : ""}
    `}
            >
              Mobile Number *
            </label>
            {errors.mobile && touched.mobile && <div className="text-xs text-red-500 mt-1">{errors.mobile}</div>}
          </div>

          {/* Payment Method */}
          <div className="flex flex-col gap-5">
            <label className="text-base font-semibold">Payment</label>
            <p className="text-sm text-gray-500">All transactions are secure and encrypted.</p>

            <div className="flex flex-col gap-3 mt-2">
              {paymentMethods.map((method) => {
                const isSelected = form.paymentMethod === method;

                return (
                  <div
                    key={method}
                    onClick={() =>
                      setForm((prev) => ({ ...prev, paymentMethod: method }))
                    }
                    className={`flex flex-col gap-3 cursor-pointer rounded-lg transition-all duration-200 
              ${isSelected
                        ? "bg-[#0b7eab1f] border-[1px] border-[#0b7fab]"
                        : "border border-gray-300"
                      }`}
                  >
                    <div className="flex items-center justify-between py-4 px-5">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method}
                          checked={isSelected}
                          onChange={handleChange}
                        />
                        <p className="capitalize text-sm font-medium">
                          {method === "COD"
                            ? "Cash on Delivery (Only in Pakistan)"
                            : method +
                            (["JazzCash", "EasyPaisa"].includes(method)
                              ? " (Only in Pakistan)"
                              : "")}
                        </p>
                      </div>

                      {/* Image: skip for COD */}
                      {method !== "COD" && (
                        <img
                          className="w-7 h-7 object-contain"
                          src={paymentIcons[method]}
                          alt={method + " logo"}
                        />
                      )}
                    </div>
                  </div>
                );
              })}

              {errors.paymentMethod && touched.paymentMethod && (
                <div className="text-xs text-red-500 mt-1">{errors.paymentMethod}</div>
              )}
            </div>



            {/* Bank Transfer Fields */}
            {form.paymentMethod === "Bank Transfer" && (
              <div className="mt-5 border rounded-md p-4 space-y-4 shadow-sm transition-all duration-500 ease-in-out bg-gray-50 animate-slide-down">
                <div className="text-sm font-semibold text-gray-800 mb-2">Credit card</div>

                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    name="cardNumber"
                    placeholder="Card number"
                    className="border px-3 py-2 rounded-md text-sm w-full placeholder-gray-400"
                    onChange={handleChange}
                  />
                  <div className="flex gap-3">
                    <input
                      type="text"
                      name="expiry"
                      placeholder="Expiration date (MM / YY)"
                      className="border px-3 py-2 rounded-md text-sm w-full placeholder-gray-400"
                      onChange={handleChange}
                    />
                    <input
                      type="text"
                      name="securityCode"
                      placeholder="Security code"
                      className="border px-3 py-2 rounded-md text-sm w-full placeholder-gray-400"
                      onChange={handleChange}
                    />
                  </div>
                  <input
                    type="text"
                    name="cardHolderName"
                    placeholder="Name on card"
                    className="border px-3 py-2 rounded-md text-sm w-full placeholder-gray-400"
                    onChange={handleChange}
                  />

                  <label className="flex items-center gap-2 text-sm mt-1">
                    <input
                      type="checkbox"
                      name="useShippingAsBilling"
                      checked={form.useShippingAsBilling}
                      onChange={(e) => setForm({ ...form, useShippingAsBilling: e.target.checked })}
                    />
                    Use shipping address as billing address
                  </label>
                </div>
              </div>
            )}

            {/* JazzCash Field */}
            {form.paymentMethod === "JazzCash" && (
              <div className="mt-5 border rounded-md p-4 shadow-sm bg-gray-50 animate-slide-down">
                <label className="text-sm font-medium">JazzCash Number</label>
                <input
                  type="text"
                  name="jazzcashNumber"
                  placeholder="Enter JazzCash Number"
                  className="border px-3 py-2 rounded-md text-sm w-full placeholder-gray-400 mt-1"
                  onChange={handleChange}
                />
              </div>
            )}

            {/* EasyPaisa Field */}
            {form.paymentMethod === "EasyPaisa" && (
              <div className="mt-5 border rounded-md p-4 shadow-sm bg-gray-50 animate-slide-down">
                <label className="text-sm font-medium">EasyPaisa Number</label>
                <input
                  type="text"
                  name="easypaisaNumber"
                  placeholder="Enter EasyPaisa Number"
                  className="border px-3 py-2 rounded-md text-sm w-full placeholder-gray-400 mt-1"
                  onChange={handleChange}
                />
              </div>
            )}
          </div>



        </div>

        <button
          type="submit"
          className="w-full bg-black text-white py-3 rounded mt-8 text-base font-semibold cursor-pointer"
        >
          place order
        </button>

        {/* THANKS FOR ORDER POPUP */}
        <div className='flex items-center justify-center'>
          {isPopupVisible && (
            <div
              className="overlay fixed inset-0 bg-black/40 bg-opacity-50 z-40"
            />
          )}

          <div className={`ThankspopUpitems ${isPopupVisible ? "ShowThanksForOrderPopup" : ""} rounded-xl`}>
            <div className='bg-white flex flex-col items-center justify-center text-center py-10'>
              <div className='flex flex-col items-center justify-center'>
                <img className='w-[100px]' src={Images.thanks} alt="" />
                <h2 className='text-3xl'>Thank you for your order!</h2>
              </div>

              <div className='flex flex-col items-center justify-center mt-10'>
                <p>Your order has been successfully placed.</p>
              </div>

              <div className="popup-buttons flex items-center gap-3 mt-10">
                <button
                  onClick={() => navigate("/yourOrders")}
                  className="border border-black py-2 px-5 text-black rounded-md"
                >
                  See Your Orders
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="py-2 px-5 bg-black text-white rounded-md"
                >
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Right: Order Summary */}
      <div className="w-full md:w-[350px] lg:w-[400px] bg-white rounded-lg shadow p-4 sm:p-6 md:p-8 h-fit">
        <h2 className="text-xl font-semibold mb-4">Order Review</h2>
        {/* Promo code */}
        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            placeholder="Enter Your Promo Code"
            className="flex-1 border-b px-2 py-2 outline-none border-gray-300"
          />
          <button className="text-sm font-semibold text-black px-3 py-2 border border-black rounded">Apply</button>
        </div>
        {/* Summary */}
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">{currency?.symbol || "₨"} {getCartAmount().toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">Tax</span>
          <span className="font-medium">{currency?.symbol || "₨"} 0</span>
        </div>
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600">Shipping</span>
          <span className="font-medium text-green-600">{currency?.symbol || "₨"} {getDeliveryFee().toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center border-t pt-4 mt-4">
          <span className="text-lg font-medium">Total</span>
          <span className="text-lg font-medium">{currency?.symbol || "₨"} {getCartTotal().toLocaleString()}</span>
        </div>
        {/* Cart Data */}
        <div className="mt-8">
          {cartData.length > 0 ? (
            cartData.map((item, idx) => {
              const { productData, color, imageIndex, quantity } = item;

              const colorIndex = productData?.colorImages?.findIndex(
                (c) => c.color.toLowerCase() === color.toLowerCase()
              );
              const imageArray = productData?.colorImages?.[colorIndex]?.images || [];
              const imageSrc = imageArray?.[imageIndex] || imageArray?.[0] || '';

              const basePrice = productData?.price || 0;
              const discount = productData?.discountPercent || 0;
              const wholesalePrice = productData?.wholesalePrice || 0;

              let finalPrice = basePrice;
              if (quantity >= 50 && wholesalePrice) {
                finalPrice = wholesalePrice;
              } else if (discount && !isNaN(discount)) {
                finalPrice = Math.round(basePrice - (basePrice * discount / 100));
              }

              const convertedPrice = Math.round(finalPrice * (currency?.rate || 1));

              return (
                <div key={item._id + color + imageIndex} className="flex items-center gap-3 border-b pb-3 mb-3">
                  <img
                    src={imageSrc}
                    alt={productData?.productName}
                    className="w-14 h-14 object-contain rounded bg-[#f5f5f5]"
                  />
                  <div className="flex-1">
                    <div className="text-xs text-gray-400 uppercase">RHR Creative</div>
                    <div className="font-normal text-sm">{productData?.productName}</div>
                    <div className="text-xs text-gray-500">Color: <span className="capitalize">{color}</span></div>
                    <div className="text-xs text-gray-500">Qty: {quantity}</div>
                  </div>
                  <div className="font-medium text-sm">
                    {currency?.symbol || "₨"} {convertedPrice.toLocaleString()}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center text-gray-500 text-sm">Loading cart data...</div>
          )}

        </div>


      </div>
    </div>
  );
};

export default Checkout;