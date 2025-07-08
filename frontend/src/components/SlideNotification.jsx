import React from 'react'

const SlideNotification = ({ show, message }) => (
  <div
    className={`fixed top-0 left-0 text-center z-[9999] px-6 py-5 bg-[#000000a3] text-white text-xs md:text-md rounded-lg shadow-lg transition-transform duration-600
      ${show ? 'translate-y-2' : '-translate-y-full'}
    `}
    style={{ minWidth: "100%", fontWeight: 500 }}
  >
    {message}
  </div>
)

export default SlideNotification