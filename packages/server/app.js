require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const admin = require("firebase-admin");

const serviceAccount = require("./helper/cryptagram-service-account-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();
const url = "mongodb://localhost:27017/cryptagram";
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ origin: `http://localhost:${process.env.PORT}` }));

const { authMiddleware } = require("./middlewares");

const { postRoute, userRoute } = require("./routes");

app.use("/api/posts", authMiddleware, postRoute);
app.use("/api/user", authMiddleware, userRoute);

app.listen(process.env.PORT, () => console.log("Server started..."));
