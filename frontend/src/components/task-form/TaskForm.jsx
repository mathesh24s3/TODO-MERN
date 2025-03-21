import React from "react";
import { CiSquarePlus } from "react-icons/ci";
import "./TaskForm.css";

export default function TaskForm({
  setTodoList,
  refreshData,
  //   editable,
  //   editTask,
  user,
}) {
  const [taskTitle, setTaskTitle] = React.useState("");
  function addTask(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formObj = Object.fromEntries(formData);
    console.log(formObj);
    fetch("http://localhost:3000/api/list/" + user._id, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formObj),
    })
      .then((res) => res.json())
      .then((data) =>
        setTodoList((prevTodoList) => [data.data, ...prevTodoList])
      )
      .catch((err) => console.log(err));
    // refreshData();
    setTaskTitle("");
  }

  return (
    <form className="task-form" onSubmit={addTask}>
      <input
        className="task-input"
        name="title"
        placeholder="Add a new task"
        value={taskTitle}
        onChange={(e) => setTaskTitle(e.target.value)}
      />
      <button className="add-task">+</button>
    </form>
  );
}
