const express = require("express");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();
const {
  getUser,
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/todo.controller.js");

const router = express.Router();
//
function authenticateToken(req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ success: false, message: "Access Denied!" });
  }
  try {
    const verified = jwt.verify(token, process.env.SECRET_KEY);
    req.user = verified;
    next();
  } catch (err) {
    res.status(403).json({ success: false, message: "Invalid Token!" });
  }
}

router.get("/user", authenticateToken, getUser);

router.get("/", authenticateToken, getTasks);

router.post("/:id", createTask);

//
router.put("/:id", updateTask);

//

router.delete("/:id", deleteTask);

module.exports = { router };
