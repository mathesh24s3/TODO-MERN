import React from "react";
import { useNavigate, Link } from "react-router";
import "./LoginPage.css";

export default function LoginPage({ setUser, enableObserver }) {
  const [loginData, setLoginData] = React.useState({
    userName: "",
    userPassword: "",
  });
  const navigate = useNavigate();

  const mainElementRef = React.useRef(null);

  React.useEffect(() => {
    enableObserver(mainElementRef);
  }, []);

  function login(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formObject = Object.fromEntries(formData);
    fetch("http://localhost:3000/api/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formObject),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.data) {
          localStorage.setItem("token", data.token);
          setUser(data.data);
          navigate("/home");
        }
        console.log(data);
      })
      .catch((err) => console.log(err));
    setLoginData({
      userName: "",
      userPassword: "",
    });
  }

  function handleChange(e) {
    setLoginData((prevLoginData) => ({
      ...prevLoginData,
      [e.target.name]: e.target.value,
    }));
  }

  return (
    <main ref={mainElementRef} className="hidden">
      <form className="login-form" onSubmit={login}>
        <input
          type="text"
          name="userName"
          placeholder="Max"
          onChange={handleChange}
          value={loginData.userName}
        />
        <input
          type="password"
          name="userPassword"
          placeholder="*****"
          onChange={handleChange}
          value={loginData.userPassword}
        />
        <button className="login-btn">Log In</button>
      </form>
      <p
        style={{
          margin: "1rem auto",
          textAlign: "center",
        }}
      >
        {" "}
        Don't have an account ?{" "}
        <Link to={"/register"}>
          <span>sign up</span>
        </Link>
      </p>
    </main>
  );
}
