import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import KanbanBoard from './pages/KanbanBoard';
import Team from './pages/Team';

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('collab_user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [theme, setTheme] = useState(() => localStorage.getItem('collab_theme') || 'light');

  useEffect(() => {
    if (user) {
      localStorage.setItem('collab_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('collab_user');
    }
  }, [user]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('collab_theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={!user ? <Login setUser={setUser} /> : <Navigate to="/dashboard" />} />
        
        {user ? (
          <Route path="/" element={<Layout user={user} setUser={setUser} theme={theme} toggleTheme={toggleTheme} />}>
            <Route index element={<Navigate to="/dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="projects" element={<Projects />} />
            <Route path="projects/:id" element={<KanbanBoard user={user} />} />
            <Route path="team" element={<Team />} />
          </Route>
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
