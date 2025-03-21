import React from "react";
import { useNavigate, Link } from "react-router";
import "./RegisterPage.css";

export default function RegisterPage({ enableObserver }) {
  const [registerData, setRegisterData] = React.useState({
    userName: "",
    userEmail: "",
    userPassword: "",
  });

  const mainElementRef = React.useRef(null);

  const navigate = useNavigate();

  React.useEffect(() => {
    enableObserver(mainElementRef);
  }, []);
  function createUser(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formObject = Object.fromEntries(formData);
    fetch("http://localhost:3000/api/register/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formObject),
    })
      .then((res) => res.json())
      .then((data) => console.log(data.message))
      .catch((err) => console.log(err));
    setRegisterData({
      userName: "",
      userEmail: "",
      userPassword: "",
    });
    navigate("/login");
  }

  function handleChange(e) {
    setRegisterData((prevRegisterData) => ({
      ...prevRegisterData,
      [e.target.name]: e.target.value,
    }));
  }

  return (
    <main ref={mainElementRef} className="hidden">
      <form className="register-form" onSubmit={createUser}>
        <input
          type="text"
          name="userName"
          placeholder="Max"
          onChange={handleChange}
          value={registerData.userName}
        />
        <input
          type="email"
          name="userEmail"
          placeholder="max123@gmail.com"
          onChange={handleChange}
          value={registerData.userEmail}
        />
        <input
          type="password"
          name="userPassword"
          placeholder="*****"
          onChange={handleChange}
          value={registerData.userPassword}
        />
        <button className="signin-btn">Sign In</button>
      </form>
      <p
        style={{
          margin: "1rem auto",
          textAlign: "center",
        }}
      >
        {" "}
        Have an account ?{" "}
        <Link to={"/login"}>
          <span>Log In</span>
        </Link>
      </p>
    </main>
  );
}
