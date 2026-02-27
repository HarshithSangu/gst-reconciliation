const User = require("../models/User");
const Business = require("../models/Business");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET not defined");
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// ================= REGISTER =================
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, businessName, gstin } = req.body;

    // Basic validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All required fields missing" });
    }

    if (role === "business" && (!businessName || !gstin)) {
      return res
        .status(400)
        .json({ message: "Business name and GSTIN are required" });
    }

    // Check if email exists
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    // If business role, create business
    if (role === "business") {
      try {
        const business = await Business.create({
          userId: user._id,
          businessName,
          gstin,
          email,
        });

        user.businessId = business._id;
        await user.save();
      } catch (businessError) {
        // Rollback user if business creation fails
        await User.findByIdAndDelete(user._id);
        return res.status(400).json({
          message:
            businessError.code === 11000
              ? "GSTIN already exists"
              : businessError.message,
        });
      }
    }

    const token = generateToken(user._id);

    return res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("🔥 REGISTER ERROR:", error);
    return res.status(500).json({
      message: error.message || "Registration failed",
    });
  }
};

// ================= LOGIN =================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "Account deactivated" });
    }

    const token = generateToken(user._id);

    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("🔥 LOGIN ERROR:", error);
    return res.status(500).json({
      message: error.message || "Login failed",
    });
  }
};
