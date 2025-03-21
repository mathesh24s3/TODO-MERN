import React from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router";
// import TaskForm from "./components/task-form/TaskForm";
// import TodoList from "./components/todo-list/TodoList";
// import DoneList from "./components/done-list/DoneList";
import HomePage from "./pages/homePage/HomePage";
//
import RegisterPage from "./pages/registerPage/RegisterPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import "./App.css";
//

export default function App() {
  const [user, setUser] = React.useState();
  const mainElementRef1 = React.useRef(null);
  const mainElementRef2 = React.useRef(null);
  const mainElementRef3 = React.useRef(null);

  const enableObserver = (mainElementRef) => {
    const observer = new IntersectionObserver(
      ([enrty], observer) => {
        const element = enrty.target;
        if (enrty.isIntersecting) {
          element.classList.remove("hidden");
          // observer.unobserve(element);
        }
        return;
      },
      {
        root: null,
        threshold: 0.1,
      }
    );
    observer.observe(mainElementRef.current);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/home"
          element={
            <HomePage
              user={user}
              setUser={setUser}
              enableObserver={enableObserver}
            />
          }
        />
        <Route
          path="/register"
          element={<RegisterPage enableObserver={enableObserver} />}
        />
        <Route
          path="/login"
          element={
            <LoginPage setUser={setUser} enableObserver={enableObserver} />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
