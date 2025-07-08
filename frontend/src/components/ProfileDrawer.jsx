import { useState, useContext } from "react";
import { Images } from "../assets/assets";
import { shopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';
import axios from "axios";

const ProfileDrawer = ({ isOpen, onClose }) => {
    const { backendUrl, setToken, setEmail, logout, userName, setUserName } = useContext(shopContext);
    const [isRegistering, setIsRegistering] = useState(false);
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [emailState, setEmailState] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [showSpamMessage, setShowSpamMessage] = useState(true);

    const toggleRegister = () => {
        setIsRegistering(true);
        setIsForgotPassword(false);
    };

    const toggleForgotPassword = () => {
        setIsForgotPassword(true);
        setIsRegistering(false);
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        if (isForgotPassword) {
            if (!otpSent) {
                try {
                    const response = await fetch(`${backendUrl}/api/user/reset-password-request`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ email: emailState }),
                    });

                    const data = await response.json();

                    if (data.success) {
                        toast.success('OTP sent to your email.');
                        setOtpSent(true);
                    } else {
                        toast.error(data.msg || 'Error sending OTP. Please try again.');
                    }
                } catch (err) {
                    toast.error('Failed to send OTP. Please try again later.');
                }
            } else {
                try {
                    const response = await fetch(`${backendUrl}/api/user/verify-otp-reset-password`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ email: emailState, otp, newPassword }),
                    });

                    const data = await response.json();

                    if (data.success) {
                        toast.success('Password updated successfully. Please log in.');
                        setIsForgotPassword(false);
                        setOtpSent(false);
                    } else {
                        toast.error(data.msg || 'Failed to reset password. Please try again.');
                    }
                } catch (err) {
                    toast.error('An error occurred. Please try again later.');
                }
            }
            return;
        }

        const url = isRegistering
            ? `${backendUrl}/api/user/register`
            : `${backendUrl}/api/user/login`;

        const bodyData = isRegistering
            ? { name, email: emailState, password }
            : { email: emailState, password };

        console.log("URL:", url);
        console.log("Sending data:", bodyData);


        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bodyData),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                toast.error(data.msg || 'Login/Register failed.');
                return;
            }

            setToken(data.token);
            setEmail(data.user.email);
            setUserName(data.user.name);
            toast.success(data.msg || 'You are logged in!');

            setName('');
            setEmailState('');
            setPassword('');
            setOtp('');
            setNewPassword('');
            onClose();

        } catch (err) {
            console.error("Fetch Error:", err);
            toast.error('Something went wrong. Please try again later.');
        }
    };

    const handleGoogleLogin = async (credentialResponse) => {
        try {
            const res = await axios.post(`${backendUrl}/api/user/google-login`, {
                token: credentialResponse.credential,
            });

            if (res.data.success) {
                setToken(res.data.token);
                setEmail(res.data.user.email);
                setUserName(res.data.user.name);

                localStorage.setItem("token", res.data.token);
                localStorage.setItem("email", res.data.user.email);
                localStorage.setItem("name", res.data.user.name);
            }
        } catch (err) {
            console.error("Google login failed", err);
        }
    };


    useEffect(() => {
        if (otpSent) {
            const timer = setTimeout(() => setShowSpamMessage(true), 5000);
            return () => clearTimeout(timer);
        }
    }, [otpSent]);

    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 bg-black/40 z-[998]" onClick={onClose}></div>
            )}

            <div
                className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white shadow-lg z-[999] transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                <div className="flex justify-end p-4">
                    <button onClick={onClose}>
                        <img className="w-5" src={Images.cancel} alt="Close" />
                    </button>
                </div>

                <div className="w-full h-full px-6 pb-10">

                    {localStorage.getItem("token") ? (
                        <div className="w-full h-full relative">
                            <h2 className="text-2xl font-medium mb-4 text-black">
                                Welcome, {userName || "User"}
                            </h2>



                            <ul className="flex flex-col gap-10 text-black font-medium text-[15px] mt-10">
                                <Link to={"/mySetting"} onClick={onClose}>
                                    <div className="flex items-center gap-5 border-b-[1px] border-[#000000a7] pb-2 ">
                                        <img className="w-6" src={Images.setting} alt="" />
                                        <li className="cursor-pointer hover:underline">
                                            My Setting
                                        </li>
                                    </div>
                                </Link>
                                <Link to="/yourFavourites" onClick={onClose}>
                                    <div className="flex items-center gap-5 border-b-[1px] border-[#000000a7] pb-2">
                                        <img className="w-6" src={Images.save} alt="" />
                                        <li className="cursor-pointer hover:underline">My Saved Items</li>
                                    </div>
                                </Link>

                                <Link to={"/yourOrders"} onClick={onClose}>
                                    <div className="flex items-center gap-5 border-b-[1px] border-[#000000a7] pb-2 ">
                                        <img className="w-6" src={Images.orderBag} alt="" />
                                        <li className="cursor-pointer hover:underline">
                                            Your Orders
                                        </li>
                                    </div>
                                </Link>
                            </ul>

                            <div className="mt-6 flex flex-col gap-4 absolute bottom-10 w-full">
                                <button
                                    onClick={() => {
                                        logout();
                                        onClose();
                                        toast.success("Signed out successfully");
                                    }}
                                    className="border border-black bg-black py-3 rounded text-white hover:bg-gray-100 hover:text-black transition-all"
                                >
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>

                            <h2 className="text-2xl font-semibold mb-2 text-black">Welcome to RHR Creative</h2>
                            <p className="text-xs text-gray-600 mb-6">
                                Sign in or create an account to view saved products, register items,
                                track orders, manage repairs and take advantage of RHR Creative membership perks.
                            </p>

                            {/* Forms */}
                            {isForgotPassword ? (
                                <form onSubmit={onSubmitHandler} className="flex flex-col gap-4">
                                    <input type="email" placeholder="Email" value={emailState} onChange={(e) => setEmailState(e.target.value)} className="border p-3 rounded text-black" />
                                    {otpSent && (
                                        <>
                                            <input type="text" placeholder="OTP" value={otp} onChange={(e) => setOtp(e.target.value)} className="border p-3 rounded text-black" />
                                            <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="border p-3 rounded" />
                                        </>
                                    )}
                                    <button className="bg-black text-white py-4 rounded">Submit</button>
                                    <p onClick={() => setIsForgotPassword(false)} className="underline text-sm cursor-pointer text-center text-black">Back to login</p>
                                </form>
                            ) : isRegistering ? (
                                <form onSubmit={onSubmitHandler} className="flex flex-col gap-4">
                                    <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className="border p-3 rounded text-black" />
                                    <input type="email" placeholder="Email" value={emailState} onChange={(e) => setEmailState(e.target.value)} className="border p-3 rounded text-black" />
                                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="border p-3 rounded text-black" />
                                    <button className="bg-black text-white py-4 rounded">Register</button>
                                    <p onClick={() => setIsRegistering(false)} className="underline text-sm cursor-pointer text-center text-black">Already have an account? Log in</p>
                                </form>
                            ) : (
                                <form onSubmit={onSubmitHandler} className="flex flex-col gap-4">
                                    <input type="email" placeholder="Email" value={emailState} onChange={(e) => setEmailState(e.target.value)} className="border p-3 rounded text-black" />
                                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="border p-3 rounded text-black" />
                                    <p onClick={toggleForgotPassword} className="underline text-sm cursor-pointer text-black">Forgot password?</p>
                                    <button className="bg-black text-white py-4 rounded">Login</button>
                                    <p onClick={toggleRegister} className="underline text-sm cursor-pointer text-center text-black">New Customer? Create account</p>
                                </form>
                            )}

                            {/* Divider */}
                            <div className="flex items-center my-4">
                                <hr className="flex-grow border-t border-gray-300" />
                                <span className="mx-2 text-sm text-gray-500">or</span>
                                <hr className="flex-grow border-t border-gray-300" />
                            </div>

                            <div className="w-full">
                                <GoogleLogin
                                    onSuccess={handleGoogleLogin}
                                    onError={() => toast.error("Google sign-in failed")}
                                    useOneTap
                                >
                                    {(renderProps) => (
                                        <div className="w-full"> 
                                            <button
                                                onClick={renderProps.onClick}
                                                disabled={renderProps.disabled}
                                                className="flex items-center justify-center w-full gap-4 py-4 px-6 border border-gray-300 rounded-lg shadow-sm bg-white hover:shadow-md transition-all duration-300"
                                            >
                                                <img src={Images.google} alt="Google" className="w-6 h-6" />
                                                <span className="text-gray-700 font-medium text-base">Continue with Google</span>
                                            </button>
                                        </div>
                                    )}
                                </GoogleLogin>
                            </div>


                            <p className="text-xs text-gray-500 mt-6 text-center">
                                By signing in, you agree to RHR Creative's <a href="/privacy-policy" className="underline cursor-pointer">Privacy Policy</a> and <a href="/terms-of-service" className="underline cursor-pointer">Terms & Conditions</a>.
                            </p>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default ProfileDrawer;
