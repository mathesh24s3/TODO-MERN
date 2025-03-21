import React from "react";
import { useNavigate, Link } from "react-router";

import TaskForm from "../../components/task-form/TaskForm";
import TodoList from "../../components/todo-list/TodoList";
import DoneList from "../../components/done-list/DoneList";

export default function HomePage({ user, setUser, enableObserver }) {
  console.log(user);
  const [todoList, setTodoList] = React.useState();
  const [tasksDone, setTasksDone] = React.useState();
  // const [editable, setEditable] = React.useState({});
  const [refreshTrigger, setRefreshTrigger] = React.useState();
  const mainElementRef = React.useRef(null);

  const navigate = useNavigate();

  React.useEffect(() => {
    console.log("fetching user");
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Access denied!. Login First");
      navigate("/login");
    }

    fetch("http://localhost:3000/api/list/user", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUser(data.data);
        } else {
          alert("Access denied!. Login First");
          navigate("/login");
        }
      })
      .catch((err) => console.log(err));
  }, []);

  React.useEffect(() => {
    console.log("fetching");
    const token = localStorage.getItem("token");

    console.log(token);
    if (!token) {
      alert("Access denied!. Login First");
      navigate("/login");
    }
    fetch("http://localhost:3000/api/list/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setTodoList(data.data.filter((d) => !d.isCompleted));
        setTasksDone(data.data.filter((d) => d.isCompleted));
      })
      .catch((err) => console.log(err));
    enableObserver(mainElementRef);
  }, []);

  function completeTask(id, type) {
    let task;
    console.log(id, type);
    if (type === "done") {
      task = todoList.find((tl) => tl._id === id);
      task.isCompleted = true;
      setTodoList((prevTodoList) => prevTodoList.filter((tl) => tl._id !== id));
      setTasksDone((prevTasksDone) => [task, ...prevTasksDone]);
    } else if (type === "undo") {
      task = tasksDone.find((tl) => tl._id === id);
      task.isCompleted = false;
      setTodoList((prevTodoList) => [...prevTodoList, task]);
      setTasksDone((prevTasksDone) =>
        prevTasksDone.filter((td) => td._id !== id)
      );
    }

    fetch(`http://localhost:3000/api/list/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        editType: type,
        taskData: {
          ...task,
        },
      }),
    })
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((err) => console.log(err));
  }

  function editTask(id, editedTask) {
    const task = todoList.find((tl) => tl._id === id);
    fetch(`http://localhost:3000/api/list/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        editType: "editContent",
        taskData: {
          ...editedTask,
        },
      }),
    })
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((err) => console.log(err));
    // setEditable({ isEditable: true, editContent: task });
  }

  function deleteTask(id) {
    setTodoList((prevTodoList) => prevTodoList.filter((tl) => tl._id !== id));
    fetch(`http://localhost:3000/api/list/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => console.log(data.data))
      .catch((err) => console.log(err));
  }

  const taskLiComponents = todoList?.map((tl) => (
    <TodoList
      key={tl._id}
      task={tl}
      completeTask={completeTask}
      deleteTask={deleteTask}
      editTask={editTask}
    />
  ));

  const tasksDoneComponents = tasksDone?.map((td) => (
    <DoneList key={td._id} task={td} completeTask={completeTask} />
  ));

  const refreshData = () =>
    setRefreshTrigger((prevRefreshTrigger) => prevRefreshTrigger + 1);

  return (
    <main ref={mainElementRef} className="hidden">
      {user && <h2 className="greetings">Hello , {user.userName}</h2>}
      <Link to={"/login"}>
        <button
          style={{
            font: "inherit",
            borderRadius: "11px",
            padding: "0.5rem 1rem",
            backgroundColor: "rgb(158, 120, 207)",
            color: "white",
          }}
          className="logout-btn"
          onClick={() => setUser({})}
        >
          Log Out
        </button>
      </Link>
      <TaskForm
        setTodoList={setTodoList}
        refreshData={refreshData}
        // editTask={editTask}
        // editable={editable}
        user={user}
      />

      <section className="todo-section">
        <h2 className="section-label">Tasks to do - {todoList?.length}</h2>
        <ul className="tasks-container">{taskLiComponents}</ul>
      </section>
      <section className="done-section">
        <h2 className="section-label">Tasks done - {tasksDone?.length}</h2>
        <ul className="tasks-container">{tasksDoneComponents}</ul>
      </section>
      {/*
       */}
    </main>
  );
}
