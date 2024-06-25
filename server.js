const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const fileupload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const errorHandler = require("./middleware/error");
const cors = require("cors");
const connectDB = require("./config/db");

//Load env vars
//Path is there because env file is in a special locationa
dotenv.config({ path: "./config/config.env" });

//Connect to Database
connectDB();

// Route files
const authRoutes = require("./routes/authRoutes");
const patientRoutes = require("./routes/patientRoutes");
const visitRoutes = require("./routes/visitRoutes");
const billingRoutes = require("./routes/billingRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const queueRoutes = require("./routes/queueRoutes");
const prescriptionRoutes = require("./routes/prescriptionRoutes");
const rateRoutes = require("./routes/rateRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

//Body Parser
app.use(express.json());

// Enable cors
app.use(
  cors({
    origin: ["https://chipatara.vercel.app", "http://localhost:3000"],
  })
);

// Cookie Parser
app.use(cookieParser());

//Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// File upload
app.use(fileupload());

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent xss attack
app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Static folder
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "https://chipatara.vercel.app");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

//Mount routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/patients", patientRoutes);
app.use("/api/v1/visits", visitRoutes);
app.use("/api/v1/billings", billingRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/services", serviceRoutes);
app.use("/api/v1/queues", queueRoutes);
app.use("/api/v1/prescriptions", prescriptionRoutes);
app.use("/api/v1/rates", rateRoutes);
app.use("/api/v1/users", userRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.white.bold
      .underline
  )
);

//Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  //Close server & exit process
  server.close(() => process.exit(1));
});
