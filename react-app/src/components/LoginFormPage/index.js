import React, { useState } from "react";
import { login } from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, NavLink } from "react-router-dom";
import './LoginForm.css';

function LoginFormPage() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);

  if (sessionUser) return <Redirect to="/" />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await dispatch(login(email, password));
    if (data) {
      return setErrors(data);
    }
  };
  const handleDemo = async (e) => {
    e.preventDefault();
    const data = await dispatch(login("demo@aa.io", "password"));
    if (data) {
      return setErrors(data);
    }
  };
  const handleJorge = async (e) => {
    e.preventDefault();
    const data = await dispatch(login("jorge@email.com", "password"));
    if (data) {
      return setErrors(data);
    }
  };

  return (
    <div className="login-container">
      <p>
        <NavLink className="navlink" exact to="/">
          <h1 className="logo">
            PayMe
          </h1>
        </NavLink>
      </p>
      <h1>Log In</h1>
      <form className="loginForm" onSubmit={handleSubmit}>
        <ul>
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
        <label>
          Email
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button className="login-button" type="submit">Log In</button>
        <button className="login-button" onClick={handleDemo}>Demo User</button>
        <button className="login-button" onClick={handleJorge}>Jorge</button>
      </form>
    </div>
  );
}

export default LoginFormPage;
