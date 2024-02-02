import express from "express";
import {
  forgotPasswordController,
  getALlOrdersController,
  getOrdersController,
  loginController,
  registerController,
  testController,
  updateOrderStatusController,
  updateProfileController,
} from "../controllers/authController.js";
import {
  isAdmin,
  requireSignin,
  requireSigninProtected,
} from "../middleware/authMiddleware.js";
//router object

const router = express.Router();

//routing

//REGISTER
router.post("/register", registerController);

//login
router.post("/login", loginController);
export default router;

// checking email and security answer validity

//forgot password
router.post("/forgot-password", forgotPasswordController);

//test

router.get("/test", requireSignin, isAdmin, testController);

//protected route auth
router.get("/user-auth", requireSigninProtected, (req, res) => {
  res.status(200).send({ ok: true });
});

//Admin Route
router.get("/admin-auth", requireSigninProtected, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

//update profile
router.put("/update-profile", requireSignin, updateProfileController);

//order
router.get("/orders", requireSignin, getOrdersController);

//all orders
router.get("/all-orders", requireSignin, getALlOrdersController);

//order status update

router.put(
  "/order-status/:orderId",
  requireSignin,
  isAdmin,
  updateOrderStatusController
);

//sending email function
