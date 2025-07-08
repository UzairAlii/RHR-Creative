import React, { useContext, useEffect, useState } from "react";
import { shopContext } from "../../context/ShopContext";

const Setting = () => {
  const { token, email, userName } = useContext(shopContext);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: userName ||"",
    email: email || "",
    gender: "Prefer not to say",
    dob: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (email) {
      const savedData = localStorage.getItem(`userSettings_${email}`);
      if (savedData) {
        setFormData(JSON.parse(savedData));
      } else {
        setFormData({
          name: userName || "",
          email: email || "",
          gender: "Prefer not to say",
          dob: "",
          phone: "",
          address: "",
        });
      }
    }
  }, [email, userName]);

  const handleSave = () => {
    if (email) {
      localStorage.setItem(`userSettings_${email}`, JSON.stringify(formData));
    }
    setEditing(false);
  };

  const handleCancel = () => {
    const savedData = localStorage.getItem(`userSettings_${email}`);
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
    setEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (!token) {
    return (
      <div className="text-center mt-20 text-xl text-gray-500">
        Please log in to view your settings.
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 max-w-3xl mx-auto bg-white shadow-md rounded-lg mt-8">
      <h2 className="text-3xl font-bold mb-6 text-center">Customer Settings</h2>

      {editing ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name:</label>
            <input
              value={userName}
              readOnly
              className="mt-1 block w-full bg-gray-100 border rounded-md p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email:</label>
            <input
              value={formData.email}
              readOnly
              className="mt-1 block w-full bg-gray-100 border rounded-md p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Gender:</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="mt-1 block w-full border rounded-md p-2"
            >
              <option>Male</option>
              <option>Female</option>
              <option>Prefer not to say</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Date of Birth (MM/DD):</label>
            <input
              type="text"
              name="dob"
              placeholder="MM/DD"
              value={formData.dob}
              onChange={handleChange}
              className="mt-1 block w-full border rounded-md p-2"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Phone:</label>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 block w-full border rounded-md p-2"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Address:</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="mt-1 block w-full border rounded-md p-2"
            />
          </div>
          <div className="sm:col-span-2 flex gap-4 justify-end">
            <button
              onClick={handleSave}
              className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-200 px-6 py-2 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4 text-gray-700">
          <div><strong>Name:</strong> {userName}</div>
          <div><strong>Email:</strong> {formData.email}</div>
          <div><strong>Gender:</strong> {formData.gender}</div>
          <div><strong>Date of Birth:</strong> {formData.dob || "MM/DD"}</div>
          <div><strong>Phone:</strong> {formData.phone || "-"}</div>
          <div><strong>Address:</strong> {formData.address || "-"}</div>

          <div className="mt-6">
            <button
              onClick={() => setEditing(true)}
              className="text-blue-600 underline hover:text-blue-800"
            >
              Edit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Setting;
