import express from "express"
import cors from "cors"
import 'dotenv/config'
import connectDB from "./config/mongoDB.js"
import connectCloudinary from "./config/cloudinary.js"
import userRouter from "./routes/userRoutes.js";
import productRouter from "./routes/productRoutes.js";
import CartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoutes.js";

//App config
const app = express()
const port = process.env.PORT || 4000

connectDB()
connectCloudinary()

// middlewares

app.use(express.json())
app.use(cors({
  origin: ['https://rhrcreative.com', 'https://admin.rhrcreative.com'],
  credentials: true
}))



app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", CartRouter)
app.use("/api/order", orderRouter)


// api endpoints

app.get('/', (re, res) => {
    res.send("API WORKING")

})

app.listen(port, () => console.log("server started on : " + port))