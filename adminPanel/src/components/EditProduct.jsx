import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { backendUrl } from "../App";
import axios from "axios";
import { toast } from "react-toastify";
import { Images } from "../assets/assets";

const initialSpecs = {
  material: "",
  compatibility: "",
  texture: "",
  closure: "",
  compartment: "",
  zips: "",
  strap: "",
  length: "",
  width: "",
  height: "",
  weight: "",
};

const EditProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [colorImages, setColorImages] = useState([[], [], [], []]);
  const [colors, setColors] = useState(["", "", "", ""]);
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [discountPercent, setDiscountPercent] = useState("");
  const [wholesalePrice, setWholesalePrice] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("yes");
  const [bestSeller, setBestSeller] = useState("no");
  const [para, setPara] = useState("");
  const [specs, setSpecs] = useState(initialSpecs);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.post(`${backendUrl}/api/product/single`, { productId: id })
      .then(res => {
        if (res.data.success) {
          const p = res.data.product;
          setProduct(p);
          setProductName(p.productName);
          setPrice(p.price);
          setDiscountPercent(p.discountPercent);
          setWholesalePrice(p.wholesalePrice);
          setCategory(p.category);
          setStock(p.stock ? "yes" : "no");
          setBestSeller(p.bestSeller ? "yes" : "no");
          setPara(p.para);
          setSpecs(p.specs || initialSpecs);
          setColors(p.colors.concat(["", "", "", ""]).slice(0, 4));
          setColorImages(
            (p.colorImages || []).map(ci => ci.images).concat([[], [], [], []]).slice(0, 4)
          );
        } else toast.error(res.data.message);
      })
      .catch(err => toast.error("Error loading product"));
  }, [id]);

  const handleImageChange = (colorIdx, imgIdx, file) => {
    setColorImages(prev => {
      const updated = prev.map(arr => [...arr]);
      updated[colorIdx][imgIdx] = file;
      return updated;
    });
  };

  const handleColorChange = (idx, value) => {
    const updated = [...colors];
    updated[idx] = value;
    setColors(updated);
  };

  const handleSpecsChange = (key, value) => {
    setSpecs({ ...specs, [key]: value });
  };

  const handleImageDelete = (colorIdx, imgIdx) => {
    setColorImages(prev => {
      const updated = prev.map(arr => [...arr]);
      updated[colorIdx].splice(imgIdx, 1); 
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        toast.error("Token not available, please login again.");
        setLoading(false);
        return;
      }
      const validColors = colors.filter(c => c.trim() !== "");
      const formData = new FormData();
      formData.append("id", id);
      formData.append("productName", productName);
      formData.append("price", price);
      formData.append("discountPercent", discountPercent);
      formData.append("wholesalePrice", wholesalePrice);
      formData.append("colors", JSON.stringify(validColors));
      formData.append("category", category);
      formData.append("stock", stock === "yes");
      formData.append("bestSeller", bestSeller === "yes");
      formData.append("para", para);
      Object.entries(specs).forEach(([key, value]) => {
        formData.append(key, value);
      });
      // Images
      let imageFieldIndex = 1;
      for (let i = 0; i < 4; i++) {
        colorImages[i].forEach((img, imgIdx) => {
          if (img && img instanceof File) {
            formData.append(`image${imageFieldIndex}`, img);
          }
          imageFieldIndex++;
        });
        formData.append(
          ["firstColorImages", "secondColorImages", "thirdColorImages", "forthColorImages"][i],
          JSON.stringify(
            colorImages[i].map(img =>
              img && img instanceof File
                ? "" 
                : img
            )
          )
        );
      }

      const response = await axios.post(
        `${backendUrl}/api/product/edit`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        toast.success("Product updated successfully");
        navigate("/list");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!product) return <div className="p-8 text-center">Loading...</div>;

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto py-8">
      <h2 className="text-xl font-bold mb-4">Edit Product</h2>
      {/* Images */}
      <h3 className="font-semibold mb-2">Product Images (edit or replace)</h3>
      {colorImages.map((imgs, colorIdx) => (
        <div key={colorIdx} className="mb-4">
          <div className="font-semibold mb-1">Color {colorIdx + 1} Images</div>
          <div className="grid grid-cols-2 gap-2">
            {[0, 1, 2, 3].map(imgIdx => (
              <label key={imgIdx} className="relative w-full h-full">
                <img
                  src={
                    imgs[imgIdx] && !(imgs[imgIdx] instanceof File)
                      ? imgs[imgIdx]
                      : imgs[imgIdx]
                        ? URL.createObjectURL(imgs[imgIdx])
                        : Images.uploadArea
                  }
                  alt=""
                  className="w-full h-full object-cover border rounded"
                />
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={e => handleImageChange(colorIdx, imgIdx, e.target.files[0])}
                />
                {imgs[imgIdx] && (
                  <button
                    type="button"
                    onClick={() => handleImageDelete(colorIdx, imgIdx)}
                    className="absolute top-[-6px] right-[-6px] bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center shadow"
                    title="Remove"
                  >
                    ✕
                  </button>
                )}
              </label>
            ))}
          </div>
        </div>
      ))}
      {/* Colors */}
      <h3 className="font-semibold mb-2">Colors</h3>
      <div className="flex gap-3 mb-4 flex-wrap">
        {colors.map((clr, idx) => (
          <input
            key={idx}
            type="text"
            className="border px-2 py-1 rounded"
            placeholder={`Color ${idx + 1}`}
            value={clr}
            onChange={e => handleColorChange(idx, e.target.value)}
          />
        ))}
      </div>
      {/* Product Name */}
      
      <h3 className="font-semibold mb-2">Product name</h3>
      <input
        type="text"
        className="border px-3 py-2 rounded w-full mb-4"
        placeholder="Product Name"
        value={productName}
        onChange={e => setProductName(e.target.value)}
      />
      {/* Product Price */}
      
      <div className="flex gap-3 mb-4 flex-wrap">
        <div className="flex flex-col items-start">
          <h3 className="font-semibold mb-2">Price</h3>
          <input
          type="number"
          className="border px-3 py-2 rounded"
          placeholder="Price"
          value={price}
          onChange={e => setPrice(e.target.value)}
        />
        </div>
        <div className="flex flex-col items-start">
          <h3 className="font-semibold mb-2">Discounted Percent %</h3>
          <input
          type="number"
          className="border px-3 py-2 rounded"
          placeholder="Discount Percent"
          value={discountPercent}
          onChange={e => setDiscountPercent(e.target.value)}
        />
        </div>
        <div className="flex flex-col items-start">
          <h3 className="font-semibold mb-2">Wholesale Price</h3>
          <input
          type="number"
          className="border px-3 py-2 rounded"
          placeholder="Wholesale Price"
          value={wholesalePrice}
          onChange={e => setWholesalePrice(e.target.value)}
        />
        </div>
      </div>
      {/* Category */}
      <div className="flex flex-col items-start">
        <h3 className="font-semibold mb-2">Category</h3>
        <select
        className="border px-3 py-2 rounded mb-4 w-full"
        value={category}
        onChange={e => setCategory(e.target.value)}
      >
        
        <option value="handbags">Handbags</option>
        <option value="bagpacks">Bagpacks</option>
        <option value="sleeves">Sleeves</option>
      </select>
      </div>
      {/* Stock */}
      <div className="flex flex-col items-start">
        <h3 className="font-semibold mb-2">Stock</h3>
        <select
        className="border px-3 py-2 rounded mb-4 w-full"
        value={stock}
        onChange={e => setStock(e.target.value)}
      >
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </select>
      </div>
      {/* Best Seller */}
      <div className="flex gap-4 mb-4">
        <h3 className="font-semibold mb-2">Bestseller : </h3>
        <label>
          <input
            type="radio"
            name="bestSeller"
            value="yes"
            checked={bestSeller === "yes"}
            onChange={() => setBestSeller("yes")}
          /> Yes
        </label>
        <label>
          <input
            type="radio"
            name="bestSeller"
            value="no"
            checked={bestSeller === "no"}
            onChange={() => setBestSeller("no")}
          /> No
        </label>
      </div>
      {/* Description */}
      <div>
        <h3 className="font-semibold mb-2">Description</h3>
        <textarea
        className="border px-3 py-2 rounded w-full mb-4"
        placeholder="Description"
        value={para}
        onChange={e => setPara(e.target.value)}
      />
      </div>
      {/* Specifications */}
      <h3 className="font-semibold mb-2">Specifications</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.keys(initialSpecs).map(key => (
          <div key={key}>
            <label className="font-semibold">{key.charAt(0).toUpperCase() + key.slice(1)}</label>
            <input
              type="text"
              className="border px-2 py-1 rounded w-full"
              value={specs[key]}
              onChange={e => handleSpecsChange(key, e.target.value)}
            />
          </div>
        ))}
      </div>
      <button
        type="submit"
        className="mt-8 px-6 py-2 bg-black text-white rounded font-semibold"
        disabled={loading}
      >
        {loading ? "Saving..." : "Edit Product"}
      </button>
    </form>
  );
};

export default EditProduct;