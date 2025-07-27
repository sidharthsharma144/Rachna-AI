import userModel from "../models/userModel.js";

import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import razorpay from 'razorpay'
import transactionModel from "../models/transactionModel.js";

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.json({ success: false, message: "Missing Details" });
    } 

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = { name, email, password: hashedPassword };
    const newUser = new userModel(userData);
    const user = await newUser.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({ success: true, token, user: { name: user.name } });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

      res.json({
        success: true,
        token,
        user: { 
          _id: user._id,   // ✅ Send the user ID in the response
          name: user.name,
          email: user.email
        }
      });
    } else {
      return res.json({ success: false, message: "Invalid Credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const userCredits = async (req, res) => {
  try {
    const userId = req.user._id; 
    
    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is missing" });
    }

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

   
    res.json({
      success: true,
      credits: user.creditBalance,
      user: {
        _id: user._id,  
        name: user.name,
        email: user.email,  
      },
    });
  } catch (error) {
    console.error("Error fetching credits:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const razorpayInstance = new razorpay({
  key_id:process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});


const paymentRazorpay = async (req, res) => {
  try {
    
    const userId = req.user._id;  // ✅ Extract from `req.user`
    const { planId } = req.body;
    
    if (!userId || !planId) {
      return res.json({ success: false, message: 'Missing Details' });
    }

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }

    let credits, plan, amount;
    switch (planId) {
      case 'Basic': plan = 'Basic'; credits = 100; amount = 10; break;
      case 'Advanced': plan = 'Advanced'; credits = 500; amount = 50; break;
      case 'Business': plan = 'Business'; credits = 5000; amount = 250; break;
      default: return res.json({ success: false, message: 'Plan not found' });
    }

    const newTransaction = await transactionModel.create({
      userId, plan, amount, credits, date: Date.now()
    });

    const options = {
      amount: amount * 100,
      currency: process.env.CURRENCY,
      receipt: newTransaction._id.toString()
    };

    razorpayInstance.orders.create(options, (error, order) => {
      if (error) {
        console.error("Razorpay Order Error:", error);
        return res.json({ success: false, message: error.message });
      }
      res.json({ success: true, order });
    });
  } catch (error) {
    console.error("Payment Error:", error);
    res.json({ success: false, message: error.message });
  }
};

const verifyRazorpay= async(req , res)=>{
  try{
    const {razorpay_order_id}= req.body;

    const orderInfo= await razorpayInstance.orders.fetch(razorpay_order_id)

    if(orderInfo.status=='paid'){
      const transactionData= await transactionModel.findById(orderInfo.receipt)
      if(transactionModel.payment){
        return res.json({success:false ,message:'Payment Failed'})
      }
      const userData= await userModel.findById(transactionData.userId)
      if (!userData) {
        return res.json({ success: false, message: "User Not Found" });
      }

      const creditBalance=userData.creditBalance+transactionData.credits

      await userModel.findByIdAndUpdate(userData._id ,{creditBalance})

      await transactionModel.findByIdAndUpdate(transactionData._id , {payment:true})

      res.json({success:true , message:"credits Added"})
    }

    else{
      res.json({success:false , message:"Payment Failed"})
    }
  }
  catch(error){
    console.log(error);
    res.json({success:false , message:error.message})
  }
}
export { registerUser, loginUser, userCredits,paymentRazorpay ,verifyRazorpay};
