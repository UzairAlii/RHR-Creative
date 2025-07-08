import React, { useState } from "react";
import NeedHelp from "./needHelp";
import { Images } from "../../assets/assets";

const faqData = [
  {
    question: "What are the Terms and Conditions for Returns and Refunds?",
    answer: (
      <div>
        <ul className="list-disc pl-6 mb-2">
          <li>Products can only be replaced if there are any manufacturing defects within 7 days.</li>
          <li>We gladly accept returns, exchanges, or replacements of ONLY unused merchandise within 7 days from the date of delivery.</li>
          <li>Please note that all products must have their original tags, dust bags, and packaging boxes intact. All items should be unused and in brand-new condition.</li>
          <li>
            If the product received is either damaged or has a manufacturing defect, contact Customer Service at <a href="mailto:rehmanshahid00@gmail.com" className="underline text-blue-600">rehmanshahid00@gmail.com</a> or simply message us on WhatsApp <a href="https://wa.me/923242934332" className="underline text-blue-600">+923 242934332</a> within 48 hours of delivery.
          </li>
          <li>The pick-up and delivery of the products will be taken care of by RHR Creative.</li>
        </ul>
        <p className="text-md font-semibold mb-1">In Case of Missing Items:</p>
        <p className="mb-1">To process your claim for a refund or replacement, please follow these steps:</p>
        <ul className="list-disc pl-6 mb-2">
          <li>Inform us about the missing item within 48 hours of receiving your package.</li>
          <li>Share an unboxing video of the package and its contents.</li>
        </ul>
        <p>
          This video will help us investigate and resolve the issue swiftly. Please note that claims submitted beyond the 48-hour timeframe or without an unboxing video may not be eligible for a refund or replacement.
        </p>
      </div>
    ),
  },
  {
    question: "How do I return a product?",
    answer:
      "Changed your mind? No worries. You can submit a return request within 7 days of receiving your bag, and we’ll happily process it. (But we’d love it if you ordered again – just saying!)",
  },
  {
    question: "Can I return a bag after trying it on?",
    answer:
      "We do not offer a try-on option. However, if you are not satisfied with the product, you can return it within 7 days. Please ensure the bag is unused, has its original tags attached and is in its original condition.",
  },
  {
    question: "How do I exchange for a different bag?",
    answer:
      "Simply let us know, and we’ll swap it for a different style or color within 7 days, shipping charges will be applied.",
  },
  {
    question: "How long does it take to process a return or refund?",
    answer:
      "Once you’ve placed your return request, we’ll arrange a pick-up within 24–48 hours. After we receive and inspect the bag, your refund will be processed within 7 business days.",
  },
  {
    question: "How do I get a refund if I paid via COD?",
    answer:
      "After return request simply provide your bank account details on WhatsApp for a smooth and hassle-free refund process.",
  },
  {
    question: "How do I check on my return status?",
    answer:
      "Simply contact us via Email rehmanshahid00@gmail.com or contact us on WhatsApp +923 242934332",
  },
  {
    question: "When will I receive the refund of my return?",
    answer: (
      <ul className="list-disc pl-6">
        <li>The refund process would take 3-7 working days.</li>
        <li>After your return request is approved, it takes up to 48-72 hours for us to arrange your return pick up.</li>
        <li>
          Once picked up, we will initiate your refund within next 48-72 hours and your refund will reflect in your original or chosen method of payment by obtaining return authorization via phone or email.
        </li>
        <li>We request you to be patient while we work to process your return request. Thank you.</li>
      </ul>
    ),
  },
];

const ReturnsFAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="w-full flex flex-col md:flex-row gap-8">
      {/* FAQ Section */}
      <div className="flex-1">
        <h2 className="text-2xl font-semibold mb-6">RETURNS & REFUNDS</h2>
        <h2 className="text-sm font-medium mb-6 text-red-600">RETURNS & REFUNDS are only for Pakistan, Outside from Pakistan can't return and get refunds once after their purchases.</h2>
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

export default ReturnsFAQ;