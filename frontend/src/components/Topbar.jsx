import React from 'react';
import { Bell, Search, Sun, Moon, LogOut } from 'lucide-react';
import './Topbar.css';

export default function Topbar({ user, setUser, theme, toggleTheme }) {
  const handleLogout = () => {
    if (setUser) {
      setUser(null);
    }
  };
  return (
    <div className="topbar">
      <div className="topbar-search">
        <Search size={20} className="text-muted" />
        <input type="text" placeholder="Search tasks, projects..." className="topbar-input" />
      </div>
      <div className="topbar-actions flex items-center gap-4">
        <button className="btn-icon" onClick={toggleTheme}>
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <button className="btn-icon">
          <Bell size={20} />
        </button>
        <div className="user-profile flex items-center gap-2">
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.name} className="avatar" />
          ) : (
            <div className="avatar-placeholder">{user?.name?.charAt(0) || 'U'}</div>
          )}
          <span className="font-medium text-sm">{user?.name || 'Guest'}</span>
        </div>
        <button className="btn-icon" onClick={handleLogout} title="Logout">
          <LogOut size={20} />
        </button>
      </div>
    </div>
  );
}
