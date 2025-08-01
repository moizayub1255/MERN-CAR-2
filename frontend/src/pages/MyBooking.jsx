import { useEffect, useState } from "react";
import { assets } from "../assets/assets.js";
import Title from "../components/Title.jsx";
import { useAppContext } from "../context/AppContext.jsx";
import toast from "react-hot-toast";
import { motion } from "motion/react";

const MyBooking = () => {
  const { axios, user, currency } = useAppContext();
  const [bookings, setBookings] = useState([]);
  // const currency=import.meta.env.VITE_CURENCY

  const fetchMyBooking = async () => {
    // setBooking(dummyMyBookingsData);
    try {
      const { data } = await axios.get("/api/bookings/user");
      if (data.success) {
        setBookings(data.bookings);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    user && fetchMyBooking();
  }, [user]);
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="px-6 md:px-16 lg:px-24 xl:px-32 2xl:px-48 mt-16 text-sm max-w-7xl"
    >
      <Title
        title={"My Booking"}
        subTitle="View and manage your all car booking"
        align="left"
      />
      <div>
        {bookings.map((booking, index) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 * index }}
            key={booking._id}
            className="grid grid-cols-1 md:grid-cols-4 gap-6
          p-4 border border-borderColor rounded-lg mt-5 first:mt-12 "
          >
            {/* car image + info */}
            <div className="md:col-span-1">
              <div className="rounded-md overflow-x-hidden mb-3">
                <img
                  src={booking.car.image}
                  alt="car_image"
                  className="w-full h-auto
                aspect-video object-cover"
                />
              </div>
              <p className="text-lg font-medium mt-2">
                {booking.car.brand} {booking.car.model}
              </p>
              <p className="text-gray-500">
                {booking.car.year} . {booking.car.category} .
                {booking.car.location}
              </p>
            </div>
            {/*Booking Info */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2">
                <p className="px-3 py-1.5 bg-light rounded">
                  Booking #{index + 1}
                </p>
                <p
                  className={`px-3 py-1 text-xs rounded-full ${
                    booking.status === "confirmed"
                      ? "bg-green-400/15 text-green-600"
                      : "bg-red-400/15 text-red-600"
                  }`}
                >
                  {booking.status}
                </p>
              </div>
              <div className="flex items-start mt-3 gap-2">
                <img
                  src={assets.calendar_icon_colored}
                  alt="cal_icon"
                  className="w-4 h-4 mt-1"
                />
                <div>
                  <p className="text-gray-500">Rental Period</p>
                  <p>
                    {booking.pickupDate.split("T")[0]} To{" "}
                    {booking.returnDate.split("T")[0]}
                  </p>
                </div>
              </div>

              <div className="flex items-start mt-3 gap-2">
                <img
                  src={assets.location_icon_colored}
                  alt="cal_icon"
                  className="w-4 h-4 mt-1"
                />
                <div>
                  <p className="text-gray-500">Pick-up Location</p>
                  <p>{booking.car.location}</p>
                </div>
              </div>
            </div>
            {/* Price  */}
            <div className="md:col-span-1 flex flex-col justify-between gap-6">
              <div className="text-sm text-gray-500 text-right">
                <p>Total Price</p>
                <h1 className="text-2xl font-semibold text-primary">
                  {currency}
                  {booking.price}
                </h1>
                <p>Booked on {booking.createdAt.split("T")[0]}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default MyBooking;
