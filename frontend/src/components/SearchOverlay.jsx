import React, { useState, useContext, useMemo } from "react";
import { shopContext } from "../context/ShopContext";
import ProductItem from "./ProductItem";
import { Link } from "react-router-dom";
import { Images } from "../assets/assets";

const CATEGORIES = [
  { label: "Handbags", value: "Laptop Handbags", path: "/Handbags" },
  { label: "Bagpacks", value: "Laptop Bagpacks", path: "/Bagpacks" },
  { label: "Sleeves", value: "Laptop Sleeves", path: "/Sleeves" },
];

const SearchOverlay = ({ open, onClose }) => {
  const { APIproducts } = useContext(shopContext);
  const allProducts = [
    ...(APIproducts || []),
  ];

  const bestSellers = useMemo(
    () => allProducts.filter((p) => p.bestSeller).slice(0, 6),
    [allProducts]
  );

  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    return allProducts.filter(
      (item) =>
        item.productName?.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, allProducts]);

  const suggestions = [
    "Laptop Handbags",
    "Laptop Bagpacks",
    "Laptop Sleeves",
  ];

  const slideClass = open
    ? "translate-x-0 opacity-100 pointer-events-auto"
    : "translate-x-full opacity-0 pointer-events-none";

  const handlePanelClick = (e) => e.stopPropagation();

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 z-[9999] transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-auto"}`}
        onClick={onClose}
      />
      {/* Main Search Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-[80vw] lg:w-[90vw] bg-white z-[9999] flex flex-col md:flex-row transition-transform duration-500 ease-in-out ${slideClass} overflow-y-auto max-h-screen`}
        style={{ maxWidth: "1200px" }}
        onClick={handlePanelClick}
      >
        {/* MOBILE/TABLET LAYOUT */}
        <div className="w-full flex flex-col md:hidden p-2 pt-8 relative min-h-screen">
          {/* Close Button */}
          <button
            className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-black z-10"
            onClick={onClose}
            aria-label="Close"
            type="button"
          >
            <img src={Images.cancel} className="w-5" alt="close" />
          </button>
          {/* Search Bar */}
          <div className="flex items-center border-b border-gray-300 pb-2 mb-10 mt-4">
            <img src={Images.sea} alt="" className="w-5 mr-2" />
            <input
              type="text"
              className="w-full outline-none text-base bg-white text-black"
              placeholder="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              autoFocus={open}
              style={{ background: "white", color: "black" }}
            />
            {query && (
              <button
                className="ml-2 text-sm text-gray-500 hover:text-black"
                onClick={() => setQuery("")}
                aria-label="Clear"
                type="button"
              >
                Clear
              </button>
            )}
          </div>
          {!query.trim() && (
            <div className="flex flex-row gap-2 mb-4">
              {CATEGORIES.map((cat) => (
                <Link
                  to={cat.path}
                  key={cat.value}
                  className="py-2 px-3 rounded text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium"
                  onClick={onClose}
                >
                  {cat.label}
                </Link>
              ))}
            </div>
          )}
          {query.trim() && (
            <div className="mb-4">
              <h3 className="font-semibold mb-2 text-black text-sm">Suggestions</h3>
              <ul>
                {suggestions
                  .filter((s) => s.toLowerCase().includes(query.toLowerCase()))
                  .map((s) => (
                    <li
                      key={s}
                      className="py-2 px-2 rounded hover:bg-gray-100 cursor-pointer text-gray-700 text-sm"
                      onClick={() => setQuery(s)}
                    >
                      {s}
                    </li>
                  ))}
              </ul>
            </div>
          )}
          {/* Heading */}
          <h2 className="text-lg font-semibold mb-4 text-black">
            {query.trim()
              ? `Showing result for "${query}"`
              : "Trending Products"}
          </h2>
          {/* Products */}
          <div className="grid grid-cols-2 gap-2 min-w-0">
  {(query.trim() ? searchResults : bestSellers).slice(0, 6).map((item) => (
    <div key={item._id} className="min-w-0" onClick={onclose}>
      <ProductItem
        id={item._id}
        name={item.productName}
        price={item.price}
        discountPercent={item.discountPercent}
        colorImages={item.colorImages}
        colors={item.colors}
      />
    </div>
  ))}
  {(query.trim() && searchResults.length === 0) && (
    <div className="col-span-2 text-gray-500 text-center mt-10">
      No products found.
    </div>
  )}
</div>
        </div>

        {/* DESKTOP LAYOUT */}
        <div className="hidden md:flex w-full h-full">
          {/* Left: Best Sellers or Search Results */}
          <div className="w-2/3 p-6 flex flex-col overflow-y-auto max-h-screen">
            <h2 className="text-lg font-semibold mb-4 text-black">
              {query.trim()
                ? `Showing result for "${query}"`
                : "Trending Products"}
            </h2>
            {query.trim() ? (
              searchResults.length === 0 ? (
                <div className="text-gray-500 text-center mt-10">
                  No products found.
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 min-w-0">
  {(query.trim() ? searchResults : bestSellers).slice(0, 6).map((item) => (
    <div key={item._id} className="min-w-0" onClick={onClose}>
      <ProductItem
        id={item._id}
        name={item.productName}
        price={item.price}
        discountPercent={item.discountPercent}
        colorImages={item.colorImages}
        colors={item.colors}
      />
    </div>
  ))}
</div>
              )
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {bestSellers.map((item) => (
                  <Link
                    to={`/product/${item._id}`}
                    key={item._id}
                    onClick={onClose}
                    className="flex flex-col items-center w-full"
                  >
                    <ProductItem
                      id={item._id}
                      name={item.productName}
                      price={item.price}
                      discountPercent={item.discountPercent}
                      colorImages={item.colorImages}
                      colors={item.colors}
                    />
                  </Link>
                ))}
              </div>
            )}
          </div>
          {/* Right: Search Bar & Categories/Suggestions */}
          <div className="w-1/3 border-l border-gray-200 p-6 flex flex-col relative">
            {/* Close Button */}
            <div
              className="absolute top-6 right-8 text-2xl text-gray-500 hover:text-black"
              onClick={onClose}
              aria-label="Close"
              type="button"
            >
              <img src={Images.cancel} className="w-5" alt="close" />
            </div>
            {/* Search Bar */}
            <div className="flex items-center border-b border-gray-300 pb-2 mb-6 mt-10">
              <img src={Images.sea} alt="" className="w-5 mr-2" />
              <input
                type="text"
                className="w-full outline-none text-sm bg-white text-black"
                placeholder="Search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setFocused(true)}
                autoFocus={open}
                style={{ background: "white", color: "black" }}
              />
              {query && (
                <button
                  className="ml-2 text-sm text-gray-500 hover:text-black"
                  onClick={() => setQuery("")}
                  aria-label="Clear"
                  type="button"
                >
                  Clear
                </button>
              )}
            </div>
            {/* Categories or Suggestions */}
            {!query.trim() ? (
              <div className="flex flex-row gap-2 mb-4">
                {CATEGORIES.map((cat) => (
                  <Link
                    to={cat.path}
                    key={cat.value}
                    className="py-2 px-3 rounded text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium"
                    onClick={onClose}
                  >
                    {cat.label}
                  </Link>
                ))}
              </div>
            ) : (
              <div className="mb-4">
                <h3 className="font-semibold mb-2 text-black text-sm">Suggestions</h3>
                <ul>
                  {suggestions
                    .filter((s) => s.toLowerCase().includes(query.toLowerCase()))
                    .map((s) => (
                      <li
                        key={s}
                        className="py-2 px-2 rounded hover:bg-gray-100 cursor-pointer text-gray-700 text-sm"
                        onClick={() => setQuery(s)}
                      >
                        {s}
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Responsive styles */}
      <style>
        {`
        @media (max-width: 768px) {
          .search-overlay-panel {
            flex-direction: column !important;
          }
        }
        `}
      </style>
    </>
  );
};

export default SearchOverlay;