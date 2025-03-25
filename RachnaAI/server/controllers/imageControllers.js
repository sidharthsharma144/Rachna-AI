import axios from "axios"
import userModel from "../models/userModel.js"
import FormData from "form-data"

export const generateImage = async (req, res) => {
  try {
    
    
    const { prompt } = req.body;
    if (!prompt) {
      console.error("Missing Prompt in Request");
      return res.status(400).json({ success: false, message: "Missing prompt details" });
    }

    const userId = req.user._id;
  

    
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.creditBalance === 0 || user.creditBalance < 0) {
      return res.json({ success: false, message: "No Credit Balance", creditBalance: user.creditBalance });
    }

    const formData = new FormData();
    formData.append("prompt", prompt);

    const { data } = await axios.post("https://clipdrop-api.co/text-to-image/v1", formData, {
      headers: {
        "x-api-key": process.env.CLIPDROP_API,
      },
      responseType: "arraybuffer",
    });

    const base64Image = Buffer.from(data, "binary").toString("base64");
    const resultImage = `data:image/png;base64,${base64Image}`;

    await userModel.findByIdAndUpdate(user._id, { creditBalance: user.creditBalance - 1 });

    return res.json({
      success: true,
      message: "Image Generated",
      creditBalance: user.creditBalance - 1,
      resultImage,
    });
  } catch (error) {
    console.error("Error in generateImage:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
