import { useState } from "react";
import Navbar from "./components/Navbar";
import { useLocation, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Car from "./pages/Car";
import CarDetails from "./pages/CarDetails";
import MyBooking from "./pages/MyBooking";
import Footer from "./components/Footer";
import Layout from "./pages/owner/Layout";
import Dashboard from "./pages/owner/Dashboard";
import AddCar from "./pages/owner/AddCar";
import ManageCar from "./pages/owner/ManageCar";
import ManageBooking from "./pages/owner/ManageBooking";
import Login from "./components/Login";
import { Toaster } from "react-hot-toast";
import { useAppContext } from "./context/AppContext";
const App = () => {
  const { showlogin } = useAppContext();
  const isOwnerPath = useLocation().pathname.startsWith("/owner");
  return (
    <>
      <Toaster />
      {showlogin && <Login/>}
      {!isOwnerPath && <Navbar/>}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cars" element={<Car />} />
        <Route path="/car-details/:id" element={<CarDetails />} />
        <Route path="/my-bookings" element={<MyBooking />} />
        <Route path="/owner" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="add-car" element={<AddCar />} />
          <Route path="manage-cars" element={<ManageCar />} />
          <Route path="manage-bookings" element={<ManageBooking />} />
        </Route>
      </Routes>
      {!isOwnerPath && <Footer />}
    </>
  );
};

export default App;
