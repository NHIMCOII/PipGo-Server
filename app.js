// const path = require("path");
// const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
// const morgan = require("morgan");

const authRoutes = require("./routes/auth"); 
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const fileImageRoutes = require("./routes/fileImage");
const areaRoutes = require("./routes/area");
const houseRoutes = require("./routes/house");
const searchRoutes = require("./routes/search");

const app = express();

// const accessLogStream = fs.createWriteStream(
//   path.join(__dirname, "access.log"),
//   { flags: "a" }
// );

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(cors(corsOptions));
// app.use(morgan("combined", { stream: accessLogStream }));

// ======================= Routes =========================

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/category", categoryRoutes);
app.use("/fileImage", fileImageRoutes);
app.use("/area", areaRoutes);
app.use("/house", houseRoutes);
app.use("/search", searchRoutes);

// ==================== Errors Handler =====================
app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

module.exports = app;
