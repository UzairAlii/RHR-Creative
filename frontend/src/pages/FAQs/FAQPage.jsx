import { NavLink, Routes, Route, useLocation, Navigate } from "react-router-dom";
import ProductsFAQ from "./ProductsFAQ";
import OrdersFAQ from "./OrdersFAQ";
import ReturnsFAQ from "./ReturnsFAQ";
import PaymentsFAQ from "./PaymentsFAQ";
import DeliveryFAQ from "./DeliveryFAQ";
import { Images } from "../../assets/assets";

const faqTabs = [
  { label: "Products & Pricing", path: "products" },
  { label: "Orders", path: "orders" },
  { label: "Returns & Refunds", path: "returns" },
  { label: "Payments", path: "payments" },
  { label: "Delivery", path: "delivery" },
];

const FAQPage = () => {
  const location = useLocation();
  const currentTab =
    faqTabs.find(tab => location.pathname.endsWith(tab.path)) || faqTabs[0];

  return (
    <div className="w-full min-h-screen bg-white py-10">
      <div className="pt-6 px-4 text-xs text-gray-500 flex items-center gap-2">
        <span>Home</span>
        <span className="mx-1">|</span>
        <span className="font-semibold text-black">{currentTab.label}</span>
      </div>

      {/* Banner Image */}
      <div className="w-full h-[40vh] md:h-[70vh] flex items-center justify-center my-5">
        <img
          src={Images.faqImage}
          alt="FAQ Banner"
          className="object-cover object-center w-full h-full"
        />
      </div>

      {/* Tabs and Content */}
      <div className="w-full mx-auto px-4 flex flex-col items-center">
        {/* Tabs */}
        <div className="flex border-b mb-8 overflow-x-auto w-full justify-start md:justify-center">
          {faqTabs.map(tab => (
            <NavLink
              key={tab.path}
              to={`/faq/${tab.path}`}
              className={({ isActive }) =>
                `px-4 py-2 whitespace-nowrap text-sm font-medium border-b-2 transition-all duration-300 ${
                  isActive
                    ? "border-black text-black"
                    : "border-transparent text-gray-500 hover:text-black"
                }`
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </div>

        {/* Routes */}
        <div className="w-full">
          <Routes>
            <Route index element={<ProductsFAQ />} />

            <Route path="products" element={<ProductsFAQ />} />
            <Route path="orders" element={<OrdersFAQ />} />
            <Route path="returns" element={<ReturnsFAQ />} />
            <Route path="payments" element={<PaymentsFAQ />} />
            <Route path="delivery" element={<DeliveryFAQ />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
