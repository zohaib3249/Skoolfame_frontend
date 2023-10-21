import React, { useContext, useState } from 'react'
import { Button } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import validator from 'validator';
import { Auth } from '../../App';
import { login } from '../../controller/api';
import './login.css'
import CircularProgress from '@mui/material/CircularProgress';
import { useEffect } from 'react';
import { useRef } from 'react';
import TextField from '@mui/material/TextField';

const Login = (e) => {

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const ref = useRef();

  const { token, setToken, user, setUser, userName, setUserName } = useContext(Auth);

  const handelSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {

      if (!loginData.email.trim() || !loginData.password.trim()) {
        toast.error("Please fill field");
        setLoading(false);
        return;
      }

      if (!validator.isEmail(loginData.email.trim())) {
        toast.error("Please enter valid email address");
        setLoading(false);
        return
      }
      const loginResponse = await login(loginData);
      const { status, message, data, token } = loginResponse;

      if (status === 1) {
        localStorage.setItem("token", token);
        setToken(token);
        localStorage.setItem("user", JSON.stringify(data));
        setUser(data);
        localStorage.setItem("username", JSON.stringify({ first_name: data.first_name, last_name: data.last_name, email: data.email }));
        setUserName({ first_name: data.first_name, last_name: data.last_name, email: data.email });
        toast.success(message);
        navigate("/");
      } else {
        setLoading(false);
        toast.error(message);
      }
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    const callback = (event) => {
      if (event.key === 'Enter') { ref.current.click() }
    };

    document.addEventListener('keydown', callback);
    document.title = "Skoolfame | Login";
    return () => {
      document.removeEventListener('keydown', callback);
    };
  }, []);

  return (
    <div className='login d-flex align-items-center justify-content-center'>
      <div className='login-box text-center'>
        <div className="bg-h1">
          <h1>Login</h1>
        </div>
        <div className='login-form'>
          <input type="text" placeholder='Email Address' name='email' value={loginData.email} onChange={(e) => setLoginData({ ...loginData, [e.target.name]: e.target.value })} />
          <input className='mt-4' type="password" placeholder='Password' name='password' value={loginData.password} onChange={(e) => setLoginData({ ...loginData, [e.target.name]: e.target.value })} />

          <div className='d-flex justify-content-end'>
          </div>
          <Button to="/dashboard" ref={ref} className='login-btn shadow-none' onClick={handelSubmit} disabled={loading ? true : false}>{loading ? <CircularProgress style={{ color: "white" }} /> : "Login"}</Button>
        </div>
      </div>
    </div>
  )
}

export default Login