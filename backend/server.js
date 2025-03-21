const express = require("express");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const mongodb = require("mongodb");
const { connectDb, getDb } = require("./config/db.js");
const { router: todoRoutes } = require("./routes/todo.route.js");

//

const app = express();
dotenv.config();
app.use(cors());

app.use(express.json()); // allows us to access JSON data in the req.body
app.use("/api/list", todoRoutes);

app.post("/api/register", async (req, res) => {
  const { userName, userEmail, userPassword } = req.body;

  const hashedPassword = await bcrypt.hash(userPassword, 10);
  try {
    const result = await getDb().collection("todoUsers").insertOne({
      userName,
      userEmail,
      userPassword: hashedPassword,
      createdAt: new Date(),
    });
    res
      .status(200)
      .json({ success: true, message: "User created successfully !!!" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.post("/api/login", async (req, res) => {
  const { userName, userPassword } = req.body;
  try {
    const [user] = await getDb()
      .collection("todoUsers")
      .find({ userName: userName })
      .toArray();
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials!" });
    }
    const isMatch = await bcrypt.compare(userPassword, user.userPassword);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials!" });
    }

    const token = jwt.sign({ ...user }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    return res
      .status(200)
      .json({ success: true, message: "Login successfull!", data: user , token });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

app.listen(3000, () => {
  connectDb();
  console.log("Server started at PORT: " + 3000);
});
