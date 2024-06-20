const express = require("express");
const mongoose = require("mongoose");
const config = require("config");

const authenticationRoutes = require("./routes/authentication");
const profileRoutes = require("./routes/profile");
const realEstateRoutes = require("./routes/realEstate");
const favoritesRoutes = require("./routes/favorites");
const ordersRoutes = require("./routes/orders");
const adminConsoleRoutes = require("./routes/adminConsole");
const mainRoutes = require("./routes/main");

const app = express();
const PORT = config.get("port");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

app.use("/api/authentication", authenticationRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/realEstate", realEstateRoutes);
app.use("/api/favorites", favoritesRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/adminConsole", adminConsoleRoutes);
app.use("/api/main", mainRoutes);

mongoose.connect(config.get("mongoURI"));

app.listen(PORT, () =>
  console.log(`Server has been started on port ${PORT}...`)
);
