import React from "react";
import { TiTickOutline } from "react-icons/ti";
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { IoArrowUndoSharp } from "react-icons/io5";

import "./TodoList.css";

export default function TodoList({
  task,
  completeTask = () => {},
  deleteTask = () => {},
  editTask = () => {},
}) {
  const taskTitleElRef = React.useRef(null);
  function editContent() {
    const taskTitleEl = taskTitleElRef.current;
    taskTitleEl.contentEditable = true;
    taskTitleEl.focus();
    const editProcess = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        editTask(task._id, { ...task, task: taskTitleEl.textContent });
        taskTitleEl.contentEditable = false;
        taskTitleEl.blur();
        window.removeEventListener("keypress" , editProcess);
      }
    };
    window.addEventListener("keypress", editProcess);
  }
  return (
    <li className={`task-list${task.isCompleted ? " completed" : ""}`}>
      <span ref={taskTitleElRef}>{task.task}</span>
      {!task.isCompleted ? (
        <div className="btn-container">
          <button
            className="btn complete"
            onClick={() => completeTask(task._id, "done")}
          >
            <TiTickOutline />
          </button>
          <button className="btn edit" onClick={() => editContent()}>
            <FaRegEdit />
          </button>
          <button className="btn delete" onClick={() => deleteTask(task._id)}>
            <MdOutlineDeleteOutline />
          </button>
        </div>
      ) : (
        <div className="btn-container">
          <button
            className="btn undo"
            onClick={() => {
              console.log("clicked");
              completeTask(task._id, "undo");
            }}
          >
            <IoArrowUndoSharp />
          </button>
        </div>
      )}
    </li>
  );
}
