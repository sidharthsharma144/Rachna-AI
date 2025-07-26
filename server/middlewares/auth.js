
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const userAuth = async (req, res, next) => {
  try {
   
    const authHeader = req.headers.authorization || req.headers.Authorization;
  

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.error("No valid Authorization header found");
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    
    if (!token) {
      console.error("Token is missing");
      return res.status(401).json({ success: false, message: "No token found" });
    }

  
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      console.error("Token Verification Failed:", error.message);
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    if (!decoded.id) {
      console.error("Decoded token does not contain a valid user ID");
      return res.status(400).json({ success: false, message: "Invalid token: No user ID" });
    }

    const user = await userModel.findById(decoded.id).select("-password");
   

    if (!user) {
      console.error("User not found");
      return res.status(404).json({ success: false, message: "User not found" });
    }


    req.user = user;
    next();
  } catch (error) {
    console.error("Auth error:", error);
    res.status(401).json({ success: false, message: "Authentication failed" });
  }
};

export default userAuth;
