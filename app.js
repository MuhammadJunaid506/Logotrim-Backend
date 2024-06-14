require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const { initialize } = require("./config");
require("./helpers/cronJob");
const path = require('path');

const authRoutes = require("./routes/auth");
const categoryRoutes = require("./routes/category");
const postRoutes = require("./routes/post");
const portfolioRoutes = require("./routes/portfolio");
const planRoutes = require("./routes/plan");
const orderRoute = require("./routes/order");
const inquiryRoute = require("./routes/inquiry");
const commentRoute = require("./routes/comment");
const popupRoute = require("./routes/popup");
const reviewRoute = require("./routes/review");

const app = express();

mongoose
    .connect(process.env.DB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("Connected to database"))
    .then(() => initialize())
    .catch((err) => console.log(`Error while connecting to database: ${err}`));

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use('/uploads', express.static('./uploads'));

app.use("/api/auth", authRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/post", postRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/plan", planRoutes);
app.use("/api/order", orderRoute);
app.use("/api/inquiry", inquiryRoute);
app.use("/api/comment", commentRoute);
app.use("/api/popup", popupRoute);
app.use("/api/review", reviewRoute);

app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Listening to server on ${port}`);
});
