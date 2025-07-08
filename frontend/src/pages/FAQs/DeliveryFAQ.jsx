import React, { useState } from "react";
import NeedHelp from "./NeedHelp";
import { Images } from "../../assets/assets";

const faqData = [
  {
    question: "What are the available delivery options and rates?",
    answer: (
      <div>
        We currently offer a standard express delivery option with order tracking services.<br /><br />
        <span className="italic">
          *Please note that delivery may take longer during sale events or external circumstances like government restrictions during COVID19.
        </span>
      </div>
    ),
  },
  {
    question: "I have yet to receive my package, what should I do?",
    answer: (
      <div>
        If you did not receive your package by the expected delivery date, please check on the shipment by tracking your order. To track your order, visit our website. Locate the Track Your Order in the footer and you will be navigated to the orders page. Click on the track order button, it will show you expected delivery days.<br /><br />
        For further assistance, please WhatsApp our customer service.
      </div>
    ),
  },
  {
    question: "Is there a guaranteed date which I can receive my order on time?",
    answer: (
      <div>
        Order deliveries will be made by our own staff or third party courier and logistics companies or Postal Services usually between 9.00 am – 7.00 pm from Monday – Sunday.<br /><br />
        RHR Creative is committed to delivering your order at the earliest in compliance with the rules and regulations of the authorities at the delivery destination. Please note that the expected delivery date/time is at our best approximation and might be affected by conditions such as shipping restrictions, payment authorisation, online security checks and stock availability.<br /><br />
        Incase of special deliveries, please WhatsApp our customer service, and we will try to process the order as per your requested delivery date.
      </div>
    ),
  },
  {
    question: "How is a failed delivery processed?",
    answer: (
      <div>
        Most of our delivery agents will make three attempts to deliver a parcel and they may require a signature upon delivery of the parcel. It is generally up to the delivery agent’s discretion to determine whether a signature is required.<br /><br />
        The delivery agents will attempt to contact the recipient at the given contact number to rearrange a delivery. If the recipient failed to receive the package after the delivery agent’s delivery attempt(s), the package will be returned to us.
      </div>
    ),
  },
  {
    question: "Where does RHR Creative ship to?",
    answer: (
      <div>
        RHR Creative generally ships from TCS, Leopards Courier, Pakistan Post, M&P. All orders purchased from RHR Creative are shipped from our own or third-party warehouses/stores/offices.
      </div>
    ),
  },
  {
    question: "There’s a missing item in my order, what should I do?",
    answer: (
      <div>
        <span className="font-semibold">In Case Of Missing Items:</span><br />
        We prioritize ensuring your order reaches you in perfect condition. If however, an item is found missing from your package, we're here to assist you. To process your claim for a refund or replacement, please follow these steps:
        <ul className="list-decimal pl-6 my-2">
          <li>Inform us about the missing item within 48 hours of receiving your package.</li>
          <li>Share clear unboxing video showcasing the condition of the package upon arrival, including the opening process and contents received.</li>
        </ul>
        This video will help us investigate and resolve the issue swiftly. Please note that claims submitted beyond the 48 hour timeframe or without an unboxing video may not be eligible for a refund or replacement.
      </div>
    ),
  },
];

const DeliveryFAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="w-full flex flex-col md:flex-row gap-8">
      {/* FAQ Section */}
      <div className="flex-1">
        <h2 className="text-2xl font-semibold mb-6">DELIVERY</h2>
        <div>
          {faqData.map((item, idx) => (
            <div key={idx} className="py-5 border-b-[1px] border-[#00000069]">
              <button
                className="flex items-center justify-between w-full text-left font-semibold text-sm md:text-md focus:outline-none transition-colors"
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
              >
                <div className="text-gray-700 text-xs md:text-sm px-1 pb-2">{item.answer}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Side Help Section */}
      <div className="w-full md:w-80 flex-shrink-0 mt-8 md:mt-0">
        <NeedHelp />
      </div>
    </div>
  );
};

export default DeliveryFAQ;