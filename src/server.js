import express from "express";
import "dotenv/config";
import dataBaseConnection from "./database/dataBaseConnection.js";
import cookieParser from "cookie-parser"
import helmet from 'helmet';
import categoryRouter from "./category/Category.Route.js";
import userRouter from "./user/User.Route.js";
import authRouter from "./auth/Auth-Route.js";
import brandRouter from "./brand/Brand.Route.js";
import productRouter from "./product/Product.Route.js";
import subCategoryRouter from "./sub-category/SubCategory.Route.js";
import couponRouter from "./coupon/Coupon.Route.js";
import reviewRouter from "./review/Review.Route.js";
import { globalLimiter } from "./middlewares/rateLimiter.middleware.js";
import morgan from "morgan";



const app = express();

//*logs
app.use(morgan("dev"));

//*for the limit 
app.set('trust proxy', 1);

//*Security Layer
app.use(helmet());

app.use(express.json());

//*Cookies Parser
app.use(cookieParser());


const PORT = process.env.PORT || 5000;

app.use("/api" , globalLimiter);

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/categories",categoryRouter);
app.use("/api/v1/users",userRouter);
app.use("/api/v1/brands", brandRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/subcategories", subCategoryRouter);
app.use("/api/v1/coupons", couponRouter);
app.use("/api/v1/reviews", reviewRouter);

app.get('/', (req, res) => {
  res.status(200).json({ status: 'Success', message: 'ده ويبسايت' });
});

const startServer = async () => {
  await dataBaseConnection();

  app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
  });
};

startServer();

export default app;