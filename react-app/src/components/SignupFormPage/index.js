import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, NavLink } from "react-router-dom";
import { signUp } from "../../store/session";
import './SignupForm.css';

function SignupFormPage() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState('');
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const [submitted, setSubmitted] = useState(false)


  useEffect(() => {
    const err = {}

    const isEmail = (email) => {
      return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)
    }

    const hasWhiteSpace = (input) => {
      return /\s/g.test(input);
    }

    if (firstName.length > 50) err["firstName"] = "First Name can not be more than 50 charcters"
    if (firstName.length <= 2) err["firstName"] = "First name can not be less than 2 charcters"
    if (!firstName.length) err["firstName"] = "Please provide a valid first name"

    if (lastName.length > 50) err["lastName"] = "Last Name can not be more than 50 charcters"
    if (lastName.length <= 1) err["lastName"] = "Last name can not be less than 2 charcters"
    if (!lastName.length) err["lastName"] = "Please provide a valid last name"

    if (username.length > 50) err["username"] = "Username can not be more than 50 charcters"
    if (username.length <= 1) err["username"] = "Username can not be less than 2 charcters"
    if (hasWhiteSpace(username)) err["username"] = "Username can not contian any spaces"
    if (!username.length) err["username"] = "Please provide a valid Username"

    if (!email.length) err["email"] = "Please provide a valid email"
    if(!isEmail(email)) err['email'] = "Email is invalid"


    if (!phoneNumber.length) err["phoneNumber"] = "Please provide a valid phone number"
    if (phoneNumber.length !== 10) err["phoneNumber"] = "Please provide a valid 10-digit phone number"

    if (password.length < 6) err["password"] = "Password must be at least 6 characters"
    if (password.length > 50) err["password"] = "Password must be less than 50 characters"
    if (!password.length) err["password"] = "Please provide a valid password"
    if(hasWhiteSpace(password)) err["password"] = "Password can not include any white space."

    setErrors(err)
  }, [firstName, lastName, email, phoneNumber, username, password])

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitted(true)
    if (Object.values(errors).length) return

    if (password === confirmPassword) {

      const formData = new FormData()

      formData.append("first_name", firstName)
      formData.append("last_name", lastName)
      formData.append("username", username)
      formData.append("email", email)
      formData.append("phone_number", phoneNumber)
      formData.append("password", password)

      // console.log("Form Data gathered from form:")
      // for (let key of formData.entries()) {
      // 	console.log(key[0] + ' ----> ' + key[1])
      // }

      const data = await dispatch(signUp(formData));
      if (data) {
        const err = data.reduce((acc, cv) => {
          let split = cv.split(":")
          // acc[split[0]] = split[1]
          // console.log(split[0].trim(), split[1].trim())
          let key = split[0].trim()
          let property = split[1].trim()
          // console.log({ key, property })
          acc[key] = property
          return acc
        }, {})
        setErrors(err)
      }
      else {
        return <Redirect exact to="/user" />
      }
    } else {
      setErrors(['Confirm Password field must be the same as the Password field']);
    }
  };
  if (sessionUser) return <Redirect to="/" />;

  return (
    <div className="signup-container">
      <NavLink className="navlink" exact to="/">
        <h1 className="logo">
          PayMe
        </h1>
      </NavLink>

      <form className="signupForm" onSubmit={handleSubmit}>
        <h3>
          Create Your Account
        </h3>
        <div className="name-container">

          <label style={{ display: "flex", flexDirection: "column" }}>
            First Name {submitted && <span className='errors'>{errors?.firstName}</span>}
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </label>
          <label style={{ display: "flex", flexDirection: "column" }}>
            Last Name  {submitted && <span className='errors'>{errors?.lastName}</span>}
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </label>
        </div>

        <label>
          Username  {submitted && <span className='errors'>{errors?.username}</span>}
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <label>
          Phone Number  {submitted && <span className='errors'>{errors?.phone_number || errors?.phoneNumber}</span>}
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </label>
        <label>
          Email  {submitted && <span className='errors'>{errors?.email}</span>}
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Password  {submitted && <span className='errors'>{errors?.password}</span>}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <label>
          Confirm Password
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        <button className="signup-button" type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default SignupFormPage;
