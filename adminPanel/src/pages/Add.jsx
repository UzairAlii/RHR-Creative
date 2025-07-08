import React, { useState } from 'react';
import { Images } from '../assets/assets';
import { toast } from 'react-toastify';
import { backendUrl } from '../App';
import axios from 'axios';

const initialColorImages = [
  [null, null, null, null],
  [null, null, null, null],
  [null, null, null, null],
  [null, null, null, null],
];

const initialColors = ["", "", "", ""];

const initialSpecs = {
  material: "",
  compat: "",
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

const Add = ({ token }) => {
  const [colorImages, setColorImages] = useState(initialColorImages);
  const [colors, setColors] = useState(initialColors);
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [discountPercent, setDiscountPercent] = useState("");
  const [wholesalePrice, setWholesalePrice] = useState("");
  const [category, setCategory] = useState("handbags");
  const [stock, setStock] = useState("yes");
  const [bestSeller, setBestSeller] = useState("no");
  const [para, setPara] = useState("");
  const [specs, setSpecs] = useState(initialSpecs);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (colorIdx, imgIdx, file) => {
    const updated = colorImages.map((arr, i) =>
      i === colorIdx
        ? arr.map((img, j) => (j === imgIdx ? file : img))
        : arr
    );
    setColorImages(updated);
  };

  const handleColorChange = (idx, value) => {
    const updated = [...colors];
    updated[idx] = value;
    setColors(updated);
  };

  const handleSpecsChange = (key, value) => {
    setSpecs({ ...specs, [key]: value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  const validColors = colors.filter(c => c.trim() !== "");
  const colorCount = validColors.length;

  if (!productName || !price || !category) {
  toast.error("Please fill all required fields");
  setLoading(false);
  return;
}

if (colorCount < 1) {
  toast.error("At least 1 color is required");
  setLoading(false);
  return;
}

for (let i = 0; i < colorCount; i++) {
  if (colorImages[i].filter(Boolean).length !== 4) {
    toast.error(`Please add 4 images for Color ${i + 1}`);
    setLoading(false);
    return;
  }
}


  try {
    const formData = new FormData();

    let imageFieldIndex = 1;
    for (let i = 0; i < colorCount; i++) {
      colorImages[i].forEach((img) => {
        if (img) {
          formData.append(`image${imageFieldIndex}`, img);
          imageFieldIndex++;
        }
      });
    }

    formData.append("productName", productName);

    formData.append("firstColorImages", JSON.stringify(colorImages[0] && validColors[0] ? colorImages[0] : []));
    formData.append("secondColorImages", JSON.stringify(colorImages[1] && validColors[1] ? colorImages[1] : []));
    formData.append("thirdColorImages", JSON.stringify(colorImages[2] && validColors[2] ? colorImages[2] : []));
    formData.append("forthColorImages", JSON.stringify(colorImages[3] && validColors[3] ? colorImages[3] : []));
    formData.append("price", price);
    formData.append("discountPercent", discountPercent);
    formData.append("wholesalePrice", wholesalePrice);
    formData.append("colors", JSON.stringify(validColors));
    formData.append("category", category);
    formData.append("stock", stock === "yes");
    formData.append("bestSeller", bestSeller === "yes");

    formData.append("para", para);
    formData.append("material", specs.material);
    formData.append("compat", specs.compat);
    formData.append("texture", specs.texture);
    formData.append("closure", specs.closure);
    formData.append("compartment", specs.compartment);
    formData.append("zips", specs.zips);
    formData.append("strap", specs.strap);
    formData.append("length", specs.length);
    formData.append("width", specs.width);
    formData.append("height", specs.height);
    formData.append("weight", specs.weight);

    formData.append("date", Date.now());

    const response = await axios.post(
      `${backendUrl}/api/product/add`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Accept": "application/json",
        },
      }
    );

    const data = response.data;
    if (data.success) {
      toast.success("Product added successfully");
      window.scrollTo({ top: 0, behavior: "smooth" });

      setColorImages([
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
      ]);
      setColors(["", "", "", ""]);
      setProductName("");
      setPrice("");
      setDiscountPercent("");
      setWholesalePrice("");
      setCategory("handbags");
      setStock("yes");
      setBestSeller("no");
      setPara("");
      setSpecs(initialSpecs);
    } else {
      toast.error(data.message || "Something went wrong, please try again");
    }
  } catch (error) {
    console.error("Error occurred:", error.message);
    toast.error("Something went wrong, please try again");
  } finally {
    setLoading(false); 
  }
};

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-3xl mx-auto py-4 px-2 sm:px-4 md:px-8"
    >
      {/* --- Images Section --- */}
      <h2 className="text-lg sm:text-xl font-bold mb-2">Product Images</h2>
      <div className="flex flex-col gap-4">
        {colorImages.map((imgs, colorIdx) => (
          <div key={colorIdx} className="mb-1">
            <div className="font-semibold mb-1 text-sm sm:text-base">Color {colorIdx + 1} Images</div>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {imgs.map((img, imgIdx) => (
                <label key={imgIdx} className="relative">
                  <img
                    src={img ? URL.createObjectURL(img) : Images.uploadArea}
                    alt=""
                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover border rounded"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={e =>
                      handleImageChange(colorIdx, imgIdx, e.target.files[0])
                    }
                  />
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* --- Colors Section --- */}
      <h2 className="text-lg sm:text-xl font-bold mt-6 mb-2">Colors</h2>
      <div className="flex flex-col xs:flex-row gap-2 sm:gap-3 mb-4">
        {colors.map((clr, idx) => (
          <input
            key={idx}
            type="text"
            className="border px-2 py-1 rounded w-full xs:w-auto"
            placeholder={`Color ${idx + 1}`}
            value={clr}
            onChange={e => handleColorChange(idx, e.target.value)}
          />
        ))}
      </div>

      {/* --- Product Name --- */}
      <h2 className="text-lg sm:text-xl font-bold mt-6 mb-2">Product Name</h2>
      <input
        type="text"
        className="border px-3 py-2 rounded w-full mb-4"
        placeholder="Product Name"
        value={productName}
        onChange={e => setProductName(e.target.value)}
      />

      {/* --- Product Price --- */}
      <h2 className="text-lg sm:text-xl font-bold mt-6 mb-2">Product Price</h2>
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-4">
        <input
          type="number"
          className="border px-3 py-2 rounded w-full"
          placeholder="Price"
          value={price}
          onChange={e => setPrice(e.target.value)}
        />
        <input
          type="number"
          className="border px-3 py-2 rounded w-full"
          placeholder="Discount Percent"
          value={discountPercent}
          onChange={e => setDiscountPercent(e.target.value)}
        />
        <input
          type="number"
          className="border px-3 py-2 rounded w-full"
          placeholder="Wholesale Price"
          value={wholesalePrice}
          onChange={e => setWholesalePrice(e.target.value)}
        />
      </div>

      {/* --- Category --- */}
      <h2 className="text-lg sm:text-xl font-bold mt-6 mb-2">Category</h2>
      <select
        className="border px-3 py-2 rounded mb-4 w-full"
        value={category}
        onChange={e => setCategory(e.target.value)}
      >
        <option value="handbags">Handbags</option>
        <option value="bagpacks">Bagpacks</option>
        <option value="sleeves">Sleeves</option>
      </select>

      {/* --- Stock --- */}
      <h2 className="text-lg sm:text-xl font-bold mt-6 mb-2">Stock Available</h2>
      <select
        className="border px-3 py-2 rounded mb-4 w-full"
        value={stock}
        onChange={e => setStock(e.target.value)}
      >
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </select>

      {/* --- Best Seller --- */}
      <h2 className="text-lg sm:text-xl font-bold mt-6 mb-2">Best Seller</h2>
      <div className="flex gap-4 mb-4">
        <label className="flex items-center gap-1">
          <input
            type="radio"
            name="bestSeller"
            value="yes"
            checked={bestSeller === "yes"}
            onChange={() => setBestSeller("yes")}
          /> Yes
        </label>
        <label className="flex items-center gap-1">
          <input
            type="radio"
            name="bestSeller"
            value="no"
            checked={bestSeller === "no"}
            onChange={() => setBestSeller("no")}
          /> No
        </label>
      </div>

      {/* --- Description --- */}
      <h2 className="text-lg sm:text-xl font-bold mt-6 mb-2">Description</h2>
      <textarea
        className="border px-3 py-2 rounded w-full mb-4"
        placeholder="Description"
        value={para}
        onChange={e => setPara(e.target.value)}
      />

      {/* --- Specifications --- */}
      <h2 className="text-lg sm:text-xl font-bold mt-6 mb-2">Specifications</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4">
        <div>
          <label className="font-semibold text-sm sm:text-base">Material</label>
          <input
            type="text"
            className="border px-2 py-1 rounded w-full"
            value={specs.material}
            onChange={e => handleSpecsChange("material", e.target.value)}
          />
        </div>
        <div>
          <label className="font-semibold text-sm sm:text-base">Laptop Compatibility</label>
          <input
            type="text"
            className="border px-2 py-1 rounded w-full"
            value={specs.compat}
            onChange={e => handleSpecsChange("compat", e.target.value)}
          />
        </div>
        <div>
          <label className="font-semibold text-sm sm:text-base">Texture</label>
          <input
            type="text"
            className="border px-2 py-1 rounded w-full"
            value={specs.texture}
            onChange={e => handleSpecsChange("texture", e.target.value)}
          />
        </div>
        <div>
          <label className="font-semibold text-sm sm:text-base">Closure</label>
          <input
            type="text"
            className="border px-2 py-1 rounded w-full"
            value={specs.closure}
            onChange={e => handleSpecsChange("closure", e.target.value)}
          />
        </div>
        <div>
          <label className="font-semibold text-sm sm:text-base">Compartment</label>
          <input
            type="text"
            className="border px-2 py-1 rounded w-full"
            value={specs.compartment}
            onChange={e => handleSpecsChange("compartment", e.target.value)}
          />
        </div>
        <div>
          <label className="font-semibold text-sm sm:text-base">Zips</label>
          <input
            type="text"
            className="border px-2 py-1 rounded w-full"
            value={specs.zips}
            onChange={e => handleSpecsChange("zips", e.target.value)}
          />
        </div>
        <div>
          <label className="font-semibold text-sm sm:text-base">Strap</label>
          <input
            type="text"
            className="border px-2 py-1 rounded w-full"
            value={specs.strap}
            onChange={e => handleSpecsChange("strap", e.target.value)}
          />
        </div>
        <div>
          <label className="font-semibold text-sm sm:text-base">Length</label>
          <input
            type="text"
            className="border px-2 py-1 rounded w-full"
            value={specs.length}
            onChange={e => handleSpecsChange("length", e.target.value)}
          />
        </div>
        <div>
          <label className="font-semibold text-sm sm:text-base">Width</label>
          <input
            type="text"
            className="border px-2 py-1 rounded w-full"
            value={specs.width}
            onChange={e => handleSpecsChange("width", e.target.value)}
          />
        </div>
        <div>
          <label className="font-semibold text-sm sm:text-base">Height</label>
          <input
            type="text"
            className="border px-2 py-1 rounded w-full"
            value={specs.height}
            onChange={e => handleSpecsChange("height", e.target.value)}
          />
        </div>
        <div>
          <label className="font-semibold text-sm sm:text-base">Weight</label>
          <input
            type="text"
            className="border px-2 py-1 rounded w-full"
            value={specs.weight}
            onChange={e => handleSpecsChange("weight", e.target.value)}
          />
        </div>
      </div>

      <button
  type="submit"
  className="mt-8 px-6 py-2 w-full sm:w-auto bg-black text-white rounded font-semibold flex items-center justify-center"
  disabled={loading}
>
  {loading ? (
    <svg className="animate-spin h-6 w-6 text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
    </svg>
  ) : (
    "Add Product"
  )}
</button>
    </form>
  );
};

export default Add;