import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

export default function Login({ setUser }) {
  const [email, setEmail] = useState('divyanshu@example.com');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8080/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (res.ok) {
        const user = await res.json();
        setUser(user);
        navigate('/dashboard');
      } else {
        alert('User not found. Try divyanshu@example.com');
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to backend');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card card">
        <div className="login-header">
          <div className="logo-icon-large"></div>
          <h2>Welcome to CollabFlow</h2>
          <p className="text-muted">Sign in to your team workspace</p>
        </div>
        <form onSubmit={handleLogin} className="flex-col gap-4">
          <div className="flex-col gap-2">
            <label className="font-medium text-sm">Email Address</label>
            <input 
              type="email" 
              className="input" 
              value={email} 
              onChange={e => setEmail(e.target.value)}
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary w-full" style={{marginTop: '1rem'}}>
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
