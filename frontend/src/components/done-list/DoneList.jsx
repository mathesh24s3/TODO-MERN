import { TiTickOutline } from "react-icons/ti";
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineDeleteOutline } from "react-icons/md";
import TodoList from "../todo-list/TodoList";
import "./DoneList.css";

//
export default function DoneList({ task, completeTask }) {
  return <TodoList task={task} completeTask={completeTask} />;
}
