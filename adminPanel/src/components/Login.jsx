import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { backendUrl } from "../App";
import axios from "axios";
import { toast } from "react-toastify";
import { Images } from "../assets/assets";

const Login = ({ setToken }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post(`${backendUrl}/api/user/adminLogin`, { email, password });
            if (response.data.success) {
                setToken(response.data.token);
                toast.success("Login successful");
                navigate("/");
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error("An error occurred during login");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen w-full flex items-center justify-center p-5 bg-gray-200">
            <div className="h-fit w-full max-w-md flex flex-col items-start bg-white px-8 py-6 rounded-lg shadow-lg">
                <h1 className="text-2xl font-semibold mb-8">Admin Login</h1>
                <form className="w-full flex flex-col gap-6" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                        </label>
                        <input
                            className="w-full py-3 px-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                            placeholder="Admin Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="relative">
                        <input
                            className="w-full py-3 px-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-black pr-12"
                            placeholder="Enter your password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <div
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm"
                            onClick={() => setShowPassword((prev) => !prev)}
                            tabIndex={-1}
                        >
                            <img className="w-5" src={showPassword ? Images.hide : Images.show} alt="" />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 bg-black text-white rounded-md hover:bg-[#000000eb] focus:outline-none focus:ring-2 focus:ring-black flex items-center justify-center"
                        disabled={loading}
                    >
                        {loading ? (
                            <svg className="animate-spin h-6 w-6 text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                            </svg>
                        ) : (
                            "Login"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;


