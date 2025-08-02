import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import Swal from 'sweetalert2';
import './AuthForm.css';
// import API_BASE_URL from '../api';

const AuthForm = () => {

    const API_BASE_URL = process.env.REACT_APP_API_URL;

  const [isLogin, setIsLogin] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '', firstName: '', lastName: '', email: '', mobile: '',
    password: '', confirmPassword: '',
  });
  const navigate = useNavigate();

  const showToast = (icon, title) => {
    Swal.fire({ toast: true, position: 'top-end', icon, title, showConfirmButton: false, timer: 2500 });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const { email, password, confirmPassword, mobile } = formData;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}$/;
    const mobileRegex = /^\d{10}$/;

    if (!emailRegex.test(email)) return 'Invalid email format';
    if (!passRegex.test(password)) return 'Password must be stronger';
    if (!isLogin) {
      if (!mobileRegex.test(mobile)) return 'Mobile must be 10 digits';
      if (password !== confirmPassword) return 'Passwords do not match';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validate();
    if (error) return showToast('error', error);

    try {
      if (isLogin) {
        const res = await axios.post(`${API_BASE_URL}/user/login`, {
          email: formData.email,
          password: formData.password,
        });
        const user = res.data.user;
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('role', user.role);
        showToast('success', 'Login successful');
        if(user.role === 'superadmin') {
          navigate('/company-profile');
        } else {
          navigate('/vision-mission-core');
        }
      } else {
        const res = await axios.post(`${API_BASE_URL}/user/signup`, formData);
        const newUser = res.data.user;
        localStorage.setItem('signupUser', JSON.stringify(newUser));
        localStorage.setItem('user', JSON.stringify(newUser));
        if (res.data.token) localStorage.setItem('token', res.data.token);
        showToast('success', 'Signup successful! Please login now.');
        setIsLogin(true);
      }

      setFormData({
        companyName: '', firstName: '', lastName: '', email: '', mobile: '',
        password: '', confirmPassword: '',
      });
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="auth-container d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="auth-form-box shadow-lg p-4 rounded bg-white d-flex flex-column flex-md-row w-100" style={{ maxWidth: '900px' }}>
        <div className="auth-form-left w-100 w-md-50 p-3">
          <h2 className="mb-4 text-primary">{isLogin ? '🔁 Login' : '📝 Signup'}</h2>
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <div className="d-flex gap-2 mb-3">
                  <input className="form-control" name="firstName" placeholder="👤 First Name" value={formData.firstName} onChange={handleChange} required />
                  <input className="form-control" name="lastName" placeholder="👥 Last Name" value={formData.lastName} onChange={handleChange} required />
                </div>
                <input className="form-control mb-3" name="companyName" placeholder="🏢 Company Name" value={formData.companyName} onChange={handleChange} required />
                <input className="form-control mb-3" name="mobile" placeholder="📱 Mobile Number" value={formData.mobile} onChange={handleChange} required />
              </>
            )}
            <input className="form-control mb-3" name="email" placeholder="📧 Email ID" value={formData.email} onChange={handleChange} required />
            <input className="form-control mb-3" type="password" name="password" placeholder="🔒 Password" value={formData.password} onChange={handleChange} required />
            {!isLogin && (
              <input className="form-control mb-3" type="password" name="confirmPassword" placeholder="🔐 Confirm Password" value={formData.confirmPassword} onChange={handleChange} required />
            )}
            <button type="submit" className="btn btn-primary w-100">{isLogin ? '🔓 Login' : '📝 Sign Up'}</button>
          </form>
          <p className="auth-toggle-text mt-3 text-center">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <span className="auth-toggle-link text-decoration-underline text-primary" style={{ cursor: 'pointer' }} onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? 'Signup' : 'Login'}
            </span>
          </p>
        </div>
        <div className="auth-form-right w-100 w-md-50 bg-primary text-white p-4 d-flex flex-column justify-content-center rounded-end">
          <h3>{isLogin ? '👋 Hello Again, Glad to See You!' : '🚀 Let’s Get You Started!'}</h3>
          <p className="mt-2">
            {isLogin ? '🔑 Ready when you are! Sign in and take control.' : '✨ Let’s get started on something amazing! Create your account.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
