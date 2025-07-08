import express from "express";
import { adminLogin, registerUser, loginUser, resetPasswordRequest, verifyOtpAndResetPassword, googleLogin} from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/reset-password-request", resetPasswordRequest);
router.post("/verify-otp-reset-password", verifyOtpAndResetPassword);
router.post("/google-login", googleLogin);
router.post("/adminLogin", adminLogin);

export default router;