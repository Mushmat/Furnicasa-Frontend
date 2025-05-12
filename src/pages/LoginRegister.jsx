// src/pages/LoginRegister.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function LoginRegister() {
  // — login state & handlers
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLoginChange = e =>
    setLoginData({ ...loginData, [e.target.name]: e.target.value });

  const handleLoginSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post(
        'https://furnicasa.onrender.com/api/auth/login',
        {
          email: loginData.email,
          password: loginData.password,
        }
      );
      const { token, isAdmin } = res.data;
      login(loginData.email, token, isAdmin);
      navigate(isAdmin ? '/admin' : '/');
    } catch (err) {
      alert(err.response?.data?.error || 'Login failed');
    }
  };

  // — register state & handlers
  const [regData, setRegData] = useState({
    fullName: '',
    phone: '',
    email: '',
    password: '',
  });
  const [statusMessage, setStatusMessage] = useState('');

  const handleRegChange = e =>
    setRegData({ ...regData, [e.target.name]: e.target.value });

  const handleRegSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post(
        'https://furnicasa.onrender.com/api/auth/register',
        regData
      );
      setStatusMessage(res.data.message);
      navigate('/verify-otp', { state: { email: regData.email } });
    } catch (err) {
      alert(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div id="main-wrapper">
      {/* Page Banner */}
      <div
        className="page-banner-section section bg-image"
        style={{ backgroundImage: 'url(/assets/images/bg/breadcrumb.png)' }}
      >
        <div className="container">
          <div className="page-banner text-start">
            <h2>Login Register</h2>
            <ul className="page-breadcrumb">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>Login Register</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Login/Register Section */}
      <div className="login-register-section section pt-90 pb-70">
        <div className="container">
          <div className="row">
            {/* ——— Login Form ——— */}
            <div className="col-md-6 col-sm-6">
              <div className="customer-login-register">
                <div className="form-login-title">
                  <h2>Login</h2>
                </div>
                <div className="login-form">
                  <form onSubmit={handleLoginSubmit}>
                    <div className="form-fild">
                      <p>
                        <label>
                          Email <span className="required">*</span>
                        </label>
                      </p>
                      <input
                        type="email"
                        name="email"
                        value={loginData.email}
                        onChange={handleLoginChange}
                        required
                      />
                    </div>
                    <div className="form-fild">
                      <p>
                        <label>
                          Password <span className="required">*</span>
                        </label>
                      </p>
                      <input
                        type="password"
                        name="password"
                        value={loginData.password}
                        onChange={handleLoginChange}
                        required
                      />
                    </div>
                    <div className="login-submit">
                      <button type="submit" className="btn">
                        Login
                      </button>
                      <label>
                        <input
                          type="checkbox"
                          name="rememberme"
                          className="checkbox"
                        />
                        <span>Remember me</span>
                      </label>
                    </div>
                    <div className="lost-password">
                      <Link to="/forgot-password">Lost your password?</Link>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* ——— Register Form ——— */}
            <div className="col-md-6 col-sm-6">
              <div className="customer-login-register register-pt-0">
                <div className="form-register-title">
                  <h2>Register</h2>
                </div>
                <div className="register-form">
                  <form onSubmit={handleRegSubmit}>
                    <div className="form-fild">
                      <p>
                        <label>
                          Full Name <span className="required">*</span>
                        </label>
                      </p>
                      <input
                        type="text"
                        name="fullName"
                        value={regData.fullName}
                        onChange={handleRegChange}
                        required
                      />
                    </div>
                    <div className="form-fild">
                      <p>
                        <label>
                          Phone <span className="required">*</span>
                        </label>
                      </p>
                      <input
                        type="text"
                        name="phone"
                        value={regData.phone}
                        onChange={handleRegChange}
                        required
                      />
                    </div>
                    <div className="form-fild">
                      <p>
                        <label>
                          Email <span className="required">*</span>
                        </label>
                      </p>
                      <input
                        type="email"
                        name="email"
                        value={regData.email}
                        onChange={handleRegChange}
                        required
                      />
                    </div>
                    <div className="form-fild">
                      <p>
                        <label>
                          Password <span className="required">*</span>
                        </label>
                      </p>
                      <input
                        type="password"
                        name="password"
                        value={regData.password}
                        onChange={handleRegChange}
                        required
                      />
                    </div>
                    <div className="register-submit">
                      <button type="submit" className="btn">
                        Register
                      </button>
                    </div>
                    {statusMessage && (
                      <p className="mt-4 text-center text-green-600">
                        {statusMessage}
                      </p>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
