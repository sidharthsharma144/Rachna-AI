import axios from "axios";
import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [credit, setCredit] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);
  const navigate= useNavigate()

  const loadCreditsData = async () => {
    
    if (!token) {
      console.error("No token found in localStorage");
      return;
    }

    try {
      
      const response = await axios.get(`${backendUrl}/api/user/credits`, {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });

      
      const { data } = response; 
     
      if (data.success) {
        setCredit(data.credits);
        if (data.user && data.user._id) {
          setUser({
            _id: data.user._id,
            name: data.user.name,
            email: data.user.email,
          });
        } else {
          console.error("User ID is missing in API response:", data.user);
        }
      }else {
        toast.error("Failed to fetch credits.");
      }
    } catch (error) {
      console.error("Error fetching credits:", error.response?.data || error);
      toast.error(error.response?.data?.message || "Error fetching credits");
    }
  };

  const generateImage=async(prompt)=>{
    
    try{
      const { data } = await axios.post(
        backendUrl + "/api/image/generate-image",
        { prompt },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if(data.success){
        loadCreditsData()
        return data.resultImage
      }
      else{
        toast.error(data.message)
        loadCreditsData()
        if(data.creditBalance==0){
          navigate('/buy')
        }
      }

    }
    catch(error){
      toast.error(error.message)
    }
  }

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
  };

  useEffect(() => {
    if (token) {
      loadCreditsData();
    }
  }, [token]);
  
  const value = {
    user,
    setUser,
    showLogin,
    setShowLogin,
    backendUrl,
    token,
    setToken,
    credit,
    setCredit,
    loadCreditsData,
    logout,
    generateImage
  };

  return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>;
};


export default AppContextProvider;
