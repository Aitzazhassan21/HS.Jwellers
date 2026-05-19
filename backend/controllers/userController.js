import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import userModel from "../models/userModel.js";
import fs from "fs";
import path from "path";

// INFO: Function to create token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// INFO: Route for user login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (isPasswordCorrect) {
      const token = createToken(user._id);
      res.status(200).json({ success: true, token });
    } else {
      res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }
  } catch (error) {
    console.log("Error while logging in user: ", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// INFO: Route for user registration
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // INFO: Check if user already exists
    const userExists = await userModel.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    // INFO: Validating email and password
    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid email" });
    }
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    // INFO: Hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // INFO: Create new user
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    // INFO: Save user to database
    const user = await newUser.save();

    // INFO: Create token
    const token = createToken(user._id);

    // INFO: Return success response
    res.status(200).json({ success: true, token });
  } catch (error) {
    console.log("Error while registering user: ", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// INFO: Route for admin login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check database for admin user first (if DB is reachable)
    try {
      const adminUser = await userModel.findOne({
        email,
        $or: [{ role: "admin" }, { isAdmin: true }],
      });
      if (adminUser) {
        const isPasswordCorrect = await bcrypt.compare(password, adminUser.password);
        if (isPasswordCorrect) {
          const token = createToken(adminUser._id);
          res.status(200).json({ success: true, token, isAdmin: true });
          return;
        }
      }
    } catch (dbError) {
      console.log("[loginAdmin] DB lookup failed, falling back to legacy admin:", dbError?.message || dbError);
    }

    // Fallback to environment variables (legacy)
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign({ role: "admin", legacy: true }, process.env.JWT_SECRET);
      console.log("[loginAdmin] Legacy auth - created token for legacy admin");
      res.status(200).json({ success: true, token, isAdmin: false });
    } else {
      res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }
  } catch (error) {
    console.log("Error while logging in admin: ", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// INFO: Route for admin to get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find({}, { password: 0 }); // Exclude passwords
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.log("Error while fetching users: ", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// INFO: Change password for admin user
const changeAdminPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const adminUser = req.admin; // From adminAuth middleware

    if (!adminUser) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
    }

    // Handle legacy authentication (env-based)
    if (adminUser.isLegacy) {
      // For legacy auth, verify against environment variables
      if (currentPassword !== process.env.ADMIN_PASSWORD) {
        return res.status(400).json({ success: false, message: "Current password is incorrect" });
      }
      
      // Update .env file with new password
      try {
        // Read current .env file
        const envPath = path.join(process.cwd(), '.env');
        let envContent = fs.readFileSync(envPath, 'utf8');
        
        // Split into lines and find/update ADMIN_PASSWORD
        const lines = envContent.split('\n');
        let updated = false;
        
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].trim().startsWith('ADMIN_PASSWORD=')) {
            lines[i] = `ADMIN_PASSWORD=${newPassword}`;
            updated = true;
            break;
          }
        }
        
        if (!updated) {
          // Add ADMIN_PASSWORD if not found
          lines.push(`ADMIN_PASSWORD=${newPassword}`);
        }
        
        // Write back to .env file
        const updatedContent = lines.join('\n');
        fs.writeFileSync(envPath, updatedContent);
        
        // Update process.env for current session
        process.env.ADMIN_PASSWORD = newPassword;
        
        console.log("[changeAdminPassword] Legacy auth - password updated in .env file");
        console.log("[changeAdminPassword] New password:", newPassword);
        return res.status(200).json({ success: true, message: "Password changed successfully" });
      } catch (error) {
        console.error("[changeAdminPassword] Error updating .env file:", error);
        return res.status(500).json({ success: false, message: "Failed to update password" });
      }
    }

    // Handle database authentication
    const isPasswordCorrect = await bcrypt.compare(currentPassword, adminUser.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ success: false, message: "Current password is incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await userModel.findByIdAndUpdate(adminUser._id, { password: hashedPassword });

    res.status(200).json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    console.log("Error while changing password: ", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export { loginUser, registerUser, loginAdmin, getAllUsers, changeAdminPassword };
