import React from 'react'
import { Images } from '../../assets/assets'

const NeedHelp = () => {
  return (
    <div className="bg-gray-50 rounded-lg p-6 shadow border">
          <h3 className="text-lg font-bold mb-4">Need Help?</h3>
          <div className="flex items-center gap-2 mb-4">
            <img className='w-7' src={Images.whatsapp} alt="" />
            <span className="font-medium">Whatsapp</span>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <img className='w-7' src={Images.email} alt="" />
            <span className="font-medium">Email</span>
          </div>
          <div className="mb-2 text-sm font-semibold text-gray-700">
            rehmanshahid000@gmail.com
          </div>
          <div className="text-xs text-gray-600 mt-2">
            Customer Service operating hours:<br />
            <span className="font-medium">Monday - Saturday</span><br />
            24 Hours<br />
            Closed on Sunday and Public Holidays.
          </div>
        </div>
  )
}

export default NeedHelp