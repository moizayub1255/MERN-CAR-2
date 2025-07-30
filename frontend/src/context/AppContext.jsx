import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const currency = import.meta.env.VITE_CURENCY;

  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [showlogin, setShowLogin] = useState(false);
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [cars, setCars] = useState([]);

  //Function to check if user is logged In
  const fetchUser = async (req, res) => {
    try {
      const { data } = await axios.get("/api/user/data");
      if (data.success) {
        setUser(data.user);
        setIsOwner(data.user?.role === "owner");
      } else {
        navigate("/");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  // Function to fetch all the car form the server
  const fetchCars = async (req, res) => {
    try {
      const { data } = await axios.get("/api/user/cars");
      data.success ? setCars(data.cars) : toast.error(data.message);
    } catch (error) {
        toast.error(error.message)
    }
  };
//Function to logout to user
const logout=async(req,res)=>{
    try {
        localStorage.removeItem('token')
        setToken(null)
        setUser(null)
        setIsOwner(false)
        axios.defaults.headers.common['Authorization']=''
        toast.success("you have been logout")
    } catch (error) {
        toast.error(error.message)
    }
}



  //useEffect to retrive the token from localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    setToken(token);
    fetchCars()
  }, []);

  //useEffect to fetch the user data when token is available
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `${token}`;
      fetchUser();
    }
  }, [token]);

  const value = {
    navigate,currency,axios,user,setUser,token,setToken,isOwner,setIsOwner,
    fetchUser,showlogin,setShowLogin,logout,fetchCars,cars,setCars,pickupDate,
    setPickupDate,returnDate,setReturnDate
  };
  return <AppContext.Provider value={value}>
  {children}
  </AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};
