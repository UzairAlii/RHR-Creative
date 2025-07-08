import React, { useState } from "react";
import NeedHelp from "./NeedHelp";
import { Images } from "../../assets/assets";

const faqData = [
  {
    question: "How often is the website updated with new products?",
    answer:
      "To keep updated about new collections and re-stocks, subscribe on our website for regular email updates.",
  },
  {
    question: "Will an item be restocked?",
    answer: (
      <>
        If the item you’re looking for is out of stock, For further assistance, please WhatsApp or Email.<br /><br />
        Our products are restocked regularly, but some of our products are exclusive and subject to limited stock availability.
      </>
    ),
  },
  {
    question: "Does RHR Creative provide a customisation service?",
    answer:
      "RHR Creative currently does not provide customisation service yet, for any changes in the services available, subscribe to us on our website for regular email updates.",
  },
  {
    question: "How do I take care of my RHR Creative products?",
    answer: (
      <>
        To keep your bags and accessories clean, wipe them with a soft dry cloth. When they are not in use, store them in a protective dust bag provided with the purchase in a clean, cool and dry place.<br /><br />
        All our materials are carefully crafted and sourced for their unique qualities. Any incidental marks, tonal changes and/or textural variances are part of the material’s natural characteristic and should not be considered as imperfections.
      </>
    ),
  },
];

const ProductsFAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="w-full flex flex-col md:flex-row gap-8">
      {/* FAQ Section */}
      <div className="flex-1">
        <h2 className="text-2xl font-semibold mb-6">PRODUCTS & PRICING</h2>
        <div className="">
          {faqData.map((item, idx) => (
            <div key={idx} className="py-5 border-b-[1px] border-[#00000069]">
              <button
                className="flex items-center justify-between w-full text-left font-semibold text-sm md:text-md focus:outline-none transition-colors "
                onClick={() => toggle(idx)}
                aria-expanded={openIndex === idx}
              >
                <span>{item.question}</span>
                                <img className={`w-3 ${openIndex === idx ? "rotate-90" : ""}`} src={Images.chevronRight} alt="" />
              </button>
              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  openIndex === idx ? "max-h-96 opacity-100 mt-2" : "max-h-0 opacity-0"
                }`}
                style={{}}
              >
                <div className="text-gray-700 text-xs md:text-sm px-1 pb-2">{item.answer}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Side Help Section */}
      <div className="w-full md:w-80 flex-shrink-0 mt-8 md:mt-0">
        < NeedHelp />
      </div>
    </div>
  );
};

export default ProductsFAQ;