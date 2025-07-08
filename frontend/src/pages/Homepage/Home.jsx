import React from 'react'
import LandingPage from './LandingPage'
import Categories from './Categories'
import BestProducts from './BestProducts'
import ImageSection from './ImageSection'

const Home = () => {
  return (
    <div className='overflow-hidden w-full flex flex-col gap-10'>
      <LandingPage />
      <Categories />
      <ImageSection />
      <BestProducts />
    </div>
  )
}

export default Home