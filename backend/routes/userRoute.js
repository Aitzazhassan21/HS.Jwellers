import express from "express";
import {
  loginUser,
  registerUser,
  loginAdmin,
  getAllUsers,
  changeAdminPassword,
} from "../controllers/userController.js";
import adminAuth from "../middleware/adminAuth.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/admin", loginAdmin);
userRouter.get("/admin/list", adminAuth, getAllUsers);
userRouter.post("/admin/change-password", adminAuth, changeAdminPassword);

export default userRouter;
