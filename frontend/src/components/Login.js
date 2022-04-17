import React from "react";
import "./login.css";
import { Room, Cancel } from "@material-ui/icons";
import { useState, useRef } from "react";
import axios from "axios";

// take setShowLogin as prop
const Login = ({ setShowLogin, setCurrentUser }) => {
  const [error, setError] = useState(false);
  const nameRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = {
      username: nameRef.current.value,
      password: passwordRef.current.value,
    };

    try {
      const res = await axios.post("/users/login", user);
      //this contains userid and username
      window.localStorage.setItem("user", res.data.username);
      window.localStorage.setItem("userId", res.data._id);
      setCurrentUser(res.data.username);
      setShowLogin(false);
      setError(false);
    } catch (err) {
      setError(true);
    }
  };

  return (
    <div className="loginContainer">
      <div className="logo">
        <Room />
        Travel Pin
      </div>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="username" ref={nameRef}></input>

        <input type="password" placeholder="password" ref={passwordRef}></input>
        <button className="loginBtn">Login</button>

        {error && <span className="failure">Something went wrong!</span>}
      </form>
      <Cancel className="loginCancel" onClick={() => setShowLogin(false)} />
    </div>
  );
};

export default Login;
