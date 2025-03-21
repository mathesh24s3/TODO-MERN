const mongodb = require("mongodb");
const { connectDb, getDb } = require("../config/db.js");

async function getUser(req, res) {
  const { user } = req;
  if (!user) {
    res
      .status(401)
      .json({ success: false, message: "Access denied!! Login first!!!" });
  }
  res
    .status(200)
    .json({ success: true, message: "User fetched successfully", data: user });
}

async function getTasks(req, res) {
  const { _id: userId } = req.user;
  const { ObjectId } = mongodb;

  try {
    const collection = getDb().collection("todoList");
    const allTasks = await collection
      .find({ userId: new ObjectId(userId) })
      .toArray();
    console.log(allTasks);
    res.status(201).json({
      success: true,
      message: "Tasks fetched successfully",
      data: allTasks,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
}

async function createTask(req, res) {
  const { id: userId } = req.params;
  const task = req.body;
  const { ObjectId } = mongodb;
  console.log(task);
  if (!task.title) {
    res.status(400).json({ success: false, message: "Please add a task" });
  }

  try {
    const db = getDb();
    const collection = db.collection("todoList");
    const now = new Date();
    const newTask = {
      userId: new ObjectId(userId),
      task: task.title,
      isCompleted: false,
      createdAt: now,
      updatedAt: now,
    };
    const result = await collection.insertOne(newTask);
    const allTasks = await collection.find({}).toArray();
    res.status(201).json({
      success: true,
      message: "Task added successfully",
      data: newTask,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
}

async function updateTask(req, res) {
  const { id: taskId } = req.params;
  const { taskData, editType } = req.body;
  console.log(taskData);
  const { ObjectId } = mongodb;
  try {
    const collection = getDb().collection("todoList");
    if (editType === "done" || editType === "undo") {
      const result = await collection.updateOne(
        { _id: new ObjectId(taskId) },
        { $set: { isCompleted: taskData.isCompleted } }
      );
    } else if (editType === "editContent") {
      const result = await collection.updateOne(
        { _id: new ObjectId(taskId) },
        { $set: { task: taskData.task, updatedAt: new Date() } }
      );
    }
    const updatedTasks = await collection.find({}).toArray();
    res.status(201).json({
      success: true,
      message: "Task Updated Successfully",
      data: updatedTasks,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
}

async function deleteTask(req, res) {
  const { id: taskId } = req.params;
  const { ObjectId } = mongodb;
  try {
    const collection = getDb().collection("todoList");
    const result = await collection.deleteOne({ _id: new ObjectId(taskId) });
    const allTasks = await collection.find({}).toArray();
    res.status(201).json({
      success: true,
      message: "Task Deleted Successfully",
      data: allTasks,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
}

module.exports = {
  getUser,
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};
