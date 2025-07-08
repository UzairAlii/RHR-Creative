import React from 'react'
import { Images } from '../assets/assets'

const Whatsapp = () => {
  return (
    <div>
      <a
        href="https://wa.me/923242934332?text=Hello%2C%20I%20visited%20your%20website%20and%20want%20to%20contact%20you."
        target="_blank"
        rel="noopener noreferrer"
        title="Message Us On Whatsapp"
      >
        <img className='w-16' src={Images.whatsapp} alt="WhatsApp" />
      </a>
    </div>
  )
}

export default Whatsapp