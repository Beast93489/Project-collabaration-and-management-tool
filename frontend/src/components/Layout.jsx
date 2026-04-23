import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function Layout({ user, setUser, theme, toggleTheme }) {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Topbar user={user} setUser={setUser} theme={theme} toggleTheme={toggleTheme} />
        <div className="content-area">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
