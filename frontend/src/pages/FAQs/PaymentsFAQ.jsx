import React, { useState } from "react";
import NeedHelp from "./needHelp";
import { Images } from "../../assets/assets";

const faqData = [
  {
    question: "What forms of payment can I use?",
    answer: (
      <div>
        The following modes of payments are available for any purchase on the RHR Creative website:
        <ul className="list-disc pl-6 my-2">
          <li>Domestic credit and debit cards issued by banks and institutions that are part of the Visa & MasterCard Network.</li>
          <li>Cash on delivery (COD)</li>
          <li>Jazzcash</li>
          <li>Easypaisa</li>
        </ul>
        <span>
          A full list is available at the time of Check Out and prior to making payments for purchases. In case of COD, payments for purchases will be confirmed via WhatsApp.
        </span>
      </div>
    ),
  },
  {
    question: "My payment was declined, what should I do?",
    answer: (
      <div>
        If your payment has been declined, do kindly place a new order. We will not be able to reinstate an order once the payment has been declined.<br /><br />
        On occasions, the financial institution may have declined your payment, do contact your bank directly to verify. Alternatively, you may try paying with another card.<br /><br />
        If similar issues still persist after you have tried on the above suggestions, please WhatsApp our customer service for further assistance.
      </div>
    ),
  },
  {
    question: "Will RHR Creative store my payment information?",
    answer: (
      <div>
        RHR Creative does not store any customer's credit/debit card information. When you pay by credit/debit card, all credit/debit card information is directly transacted in a secure fashion to our payment gateway providers.<br /><br />
        As prescribed by the financial institutions issuing the credit or debit cards affiliated with Visa and MasterCard, you will be required to submit your 16-digit credit card number, card expiry date and 3-digit CVV number (usually on the reverse of the card) when you make your online transaction using your Credit or Debit card. You should also have enrolled your Credit Card with VBV (Verified by Visa) or MSC (MasterCard Secure Code) to complete the transaction.
      </div>
    ),
  },
];

const PaymentsFAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="w-full flex flex-col md:flex-row gap-8">
      {/* FAQ Section */}
      <div className="flex-1">
        <h2 className="text-2xl font-semibold mb-6">PAYMENTS</h2>
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

export default PaymentsFAQ;