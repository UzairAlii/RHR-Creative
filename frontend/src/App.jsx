import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Homepage/Home';
import Orders from './pages/Orders/Orders';
import Products from './pages/Products/Products';
import Cart from './pages/Cart/Cart';
import Checkout from './pages/Checkout/Checkout';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Collection from './pages/Collection/Collection';
import Handbags from './pages/Handbags/Handbags';
import Bagpacks from './pages/Bagpacks/Bagpacks';
import Countries from './components/Countries';
import Under1999 from './components/under';
import Sleeves from './pages/Sleeves/Sleeves';
import Whatsapp from './components/Whatsapp';
import Favourites from './components/Favourites';
import { ToastContainer } from 'react-toastify';
import Setting from './pages/Account/Setting';
import FavouritesPage from './components/FavouritesPage';
import BestProducts from './pages/Homepage/BestProducts';
import FAQPage from './pages/FAQs/FAQPage';
import PP from './components/PP';
import TermsOfService from './components/TermOfService';
import { ProfileDrawerContext } from './context/ProfileDrawerContext';
import ProfileDrawer from './components/ProfileDrawer';

const App = () => {
 const [showFavourites, setShowFavourites] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false)
  return (
    <ProfileDrawerContext.Provider value={{
      openProfileDrawer: () => setShowDrawer(true),
    }}>
      <div className='overflow-hidden relative w-full'>
        <ToastContainer />
        <Navbar onFavouritesClick={() => setShowFavourites(true)} showProfileDrawer={showDrawer} setShowProfileDrawer={setShowDrawer} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Collections" element={<Collection />} />
        <Route path="/Handbags" element={<Handbags />} />
        <Route path="/Bagpacks" element={<Bagpacks />} />
        <Route path="/BestSellers" element={<BestProducts />} />
        <Route path="/under999" element={<Under1999 />} />
        <Route path="/Sleeves" element={<Sleeves />} />
        <Route path='/product/:productId' element={<Products />} />
        <Route path='/Cart' element={<Cart />} />
        <Route path='/Checkout' element={<Checkout setShowDrawer={setShowDrawer} />} />
        <Route path='/selectCountry' element={<Countries />} />
        <Route path='/mySetting' element={<Setting />} />
        <Route path='/favourites' element={<Favourites />} />
        <Route path="/yourFavourites" element={<FavouritesPage />} />
        <Route path='/yourOrders' element={<Orders />} />
        <Route path="/faq/*" element={<FAQPage />} />
        <Route path="/privacy-policy" element={<PP />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
      </Routes>

      <Footer />

      <div className='fixed bottom-5 right-5 md:bottom-10 md:right-10 z-[9999]'>
        <Whatsapp />
        <Favourites isOpen={showFavourites} onClose={() => setShowFavourites(false)}  />
      </div>

      <ProfileDrawer isOpen={showDrawer} onClose={() => setShowDrawer(false)} />
        
    </div>
     </ProfileDrawerContext.Provider>
  )
}

export default App