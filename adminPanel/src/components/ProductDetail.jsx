import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { backendUrl, currency } from "../App";
import axios from "axios";
import { toast } from "react-toastify";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.post(`${backendUrl}/api/product/single`, { productId: id })
      .then(res => {
        if (res.data.success) setProduct(res.data.product);
        else toast.error(res.data.message);
      })
      .catch(err => toast.error("Error loading product"));
  }, [id]);

  if (!product) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className=" md:p-5 max-w-6xl">
      {/* Product Header */}
      <div className="bg-white shadow rounded-lg p-2 md:p-5 mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">{product.productName}</h2>

        {/* Images by Color */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {product.colorImages?.map((clr, idx) => (
            <div key={idx}>
              <h4 className="text-lg font-semibold mb-2 capitalize">{clr.color}</h4>
              <div className="grid grid-cols-2 gap-2">
                {clr.images.map((img, i) => (
                  <img key={i} src={img} alt={`img-${i}`} className="w-full h-full rounded shadow object-cover" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing & Meta Info */}
      <div className="bg-white shadow rounded-lg p-6 mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <p className="mb-2"><span className="font-semibold">Price:</span> {currency} {product.price}</p>
          <p className="mb-2"><span className="font-semibold">Discount Percentage:</span> {product.discountPercent}%</p>
          <p className="mb-2"><span className="font-semibold">Wholesale Price:</span> {currency} {product.wholesalePrice}</p>
          <p className="mb-2"><span className="font-semibold">Category:</span> {product.category}</p>
        </div>
        <div>
          <p className="mb-2"><span className="font-semibold">Stock:</span> {product.stock ? "Yes" : "No"}</p>
          <p className="mb-2">
            <span className="font-semibold">Stock Quantity:</span> {typeof product.stockQuantity !== "undefined" ? product.stockQuantity : "-"}
          </p>
          <p className="mb-2"><span className="font-semibold">Best Seller:</span> {product.bestSeller ? "Yes" : "No"}</p>
        </div>
      </div>

      {/* Description */}
      <div className="bg-white shadow rounded-lg p-6 mb-6 flex flex-wrap">
        <h3 className="text-xl font-semibold mb-2 text-gray-800 w-full">Description</h3>
        <p className="text-gray-700 break-words overflow-hidden w-full">
          {product.para}
        </p>
      </div>


      {/* Specifications */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Specifications</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-gray-700">
          {product.specs && Object.entries(product.specs).map(([key, value]) => (
            <div key={key}>
              <p><span className="font-semibold capitalize">{key}:</span> {value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-end">
        <button
          className="bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-2 rounded transition duration-200"
          onClick={() => navigate(`/edit/${product._id}`)}
        >
          Edit
        </button>
        <button
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded transition duration-200"
          onClick={() => {
            if (window.confirm("Delete this product?")) {
              const token = localStorage.getItem('admin_token');
              axios.post(`${backendUrl}/api/product/remove`, { id: product._id }, {
                headers: { Authorization: `Bearer ${token}` }
              })
                .then(res => {
                  if (res.data.success) {
                    toast.success("Product deleted");
                    navigate("/list");
                  } else toast.error(res.data.message);
                });
            }
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;
