import React, { useState } from "react";
import NeedHelp from "./NeedHelp";
import { Images } from "../../assets/assets";

const faqData = [
  {
    question: "How will I know if my order is placed?",
    answer:
      "Orders are confirmed once payment has been successfully completed. You will receive a confirmation email from RHR Creative within 15 minutes to inform you that your order has been received. (Do ensure to check for the confirmation email that may have been directed to your junk folder).",
  },
  {
    question: "I did not receive my Order Confirmation email after placing the order, what should I do?",
    answer:
      "Once an order has been successfully placed, an email containing the order details will be sent to your provided email address. Do check your junk folder as the email may be directed there. If you have not received your Order Confirmation, please check the email address entered. For further assistance, please WhatsApp our customer service.",
  },
  {
    question: "When I place an item in my shopping bag, is the item placed under my reservation?",
    answer:
      "Placing an item in your shopping bag does not guarantee that the item is reserved for you. If the product is no longer available, our website will alert you that the product is out of stock. Your order will only be confirmed after payment has been made.",
  },
  {
    question: "What are the shipping charges?",
    answer:
      "Shipping Charges are 250PKR for Anywhere in Pakistan and there is a different shipping rates for different countries.",
  },
  {
    question: "How do I check my order status?",
    answer:
      "You just have to come to your orders page and click on the track order button. it will show you the current status of your order.",
  },
  {
    question: "Can I cancel my order?",
    answer: (
      <>
        Please contact us immediately via e-mail <a href="mailto:rehmanshahid000@gmail.com" className="underline text-blue-600">rehmanshahid000@gmail.com</a> or please WhatsApp our customer service. If you contact us within 30 minutes of placing your order we can cancel the order. However, once an order begins processing no changes can be made.<br /><br />
        Most orders are shipped within 24 hours In Pakistan.
      </>
    ),
  },
  {
    question: "My order status is showing as cancelled and payment has been made, what should I do?",
    answer:
      "Kindly contact our Customer Care at rehmanshahid000@gmail.com or please WhatsApp our customer service. with the Order ID, Name and Email address for assistance.",
  },
  {
    question: "I received a damaged item, what should I do?",
    answer: (
      <>
        Please contact our Customer Care at <a href="mailto:rehmanshahid000@gmail.com" className="underline text-blue-600">rehmanshahid000@gmail.com</a> or please WhatsApp our customer service immediately with the following information:<br /><br />
        <ul className="list-disc pl-6">
          <li>Your order ID</li>
          <li>Images of the item(s) showing the overview and a close up of the issues.</li>
          <li>Description of the issues</li>
        </ul>
        <br />
        Please do not dispose/throw away the item(s) as it may need to be returned to RHR Creative. Our Customer Care team will get in touch with you to assist you on your concern.
      </>
    ),
  },
];

const OrdersFAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="w-full flex flex-col md:flex-row gap-8">
      {/* FAQ Section */}
      <div className="flex-1">
        <h2 className="text-2xl font-semibold mb-6">ORDERS</h2>
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

export default OrdersFAQ;