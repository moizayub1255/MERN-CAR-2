import express from "express"
import "dotenv/config"
import cors from "cors"
import connectDB from "./configs/db.js"
import userRouter from "./routes/user.routes.js"
import ownerRouter from "./routes/owner.routes.js"
import bookingRoute from "./routes/booking.routes.js"
//Initialize Express App
const app=express()
//database connection
await connectDB();

//Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extends:true}))


app.get("/",(req,res)=>{
   res.send("server is working")
})

app.use("/api/user",userRouter)
app.use("/api/owner",ownerRouter)
app.use("/api/bookings",bookingRoute)

const PORT=process.env.PORT || 3000;
app.listen(PORT,(req,res)=>{
    console.log(`server is ruuning at port ${PORT}`)
})