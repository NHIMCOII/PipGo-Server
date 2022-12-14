const path = require("path");
const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const cookieSession = require("cookie-session");
const NotFoundError = require("./errors/not-found-error");
const { errorHandler } = require("./middlewares/errorHandler");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const fileRoutes = require("./routes/file");
const imageRoutes = require("./routes/image");
const areaRoutes = require("./routes/area");
const houseRoutes = require("./routes/house");
const searchRoutes = require("./routes/search");
const chatRoutes = require("./routes/chat");

const app = express();

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
);
app.use(morgan("combined", { stream: accessLogStream }));

// ======================= Routes =========================
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/category", categoryRoutes);
app.use("/file", fileRoutes);
app.use("/image", imageRoutes);
app.use("/area", areaRoutes);
app.use("/house", houseRoutes);
app.use("/search", searchRoutes);
app.use("/chat", chatRoutes);

// ==================== Errors Handler =====================
app.all("*", (req, res, next) => {
  throw new NotFoundError();
});
app.use(errorHandler);

module.exports = app;
