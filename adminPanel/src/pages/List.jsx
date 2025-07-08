import React, { useEffect, useState } from 'react';
import { backendUrl, currency } from '../App';
import axios from "axios";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const List = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchList = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`);
      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const removeProduct = async (id) => {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        toast.error("Token not available, please login again.");
        return;
      }
      setLoading(true);
      const response = await axios.post(
        `${backendUrl}/api/product/remove`,
        { id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="p-2 md:p-6">
      <h1 className='font-semibold text-2xl mb-4 text-black'>All Products</h1>
      <div className="overflow-x-auto">
        <div className="min-w-[900px]">
          <div className='grid grid-cols-7 gap-2 bg-slate-200 text-sm font-semibold py-2 px-2'>
            <div>Image</div>
            <div>Product Name</div>
            <div>Price</div>
            <div>Discount Percentage</div>
            <div>Wholesale Price</div>
            <div>Category</div>
            <div className="text-center">Actions</div>
          </div>
          {list.map((item) => (
            <div
              key={item._id}
              className='grid grid-cols-7 gap-2 items-center border-b py-2 px-2 hover:bg-gray-50 cursor-pointer'
              onClick={() => navigate(`/product/${item._id}`)}
            >
              <img src={item.colorImages?.[0]?.images?.[0]} alt={item.productName} className='w-14 h-14 object-cover rounded' />
              <div>{item.productName}</div>
              <div>{currency} {item.price}</div>
              <div>{item.discountPercent}%</div>
              <div>{currency} {item.wholesalePrice}</div>
              <div>{item.category}</div>
              <div className="flex gap-2 justify-center">
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded text-xs"
                  onClick={e => { e.stopPropagation(); if(window.confirm("Delete this product?")) removeProduct(item._id); }}
                >Delete</button>
                <button
                  className="bg-emerald-700 text-white px-3 py-1 rounded text-xs"
                  onClick={e => { e.stopPropagation(); navigate(`/edit/${item._id}`); }}
                >Edit</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default List;