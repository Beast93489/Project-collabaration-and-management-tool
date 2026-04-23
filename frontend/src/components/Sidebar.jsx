import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, Users, Settings } from 'lucide-react';
import './Sidebar.css';

export default function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo-icon"></div>
        <h2 className="logo-text">CollabFlow</h2>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/projects" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
          <FolderKanban size={20} />
          <span>Projects</span>
        </NavLink>
        <NavLink to="/team" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
          <Users size={20} />
          <span>Team</span>
        </NavLink>
      </nav>
      <div className="sidebar-footer">
        <button className="btn nav-item w-full" style={{justifyContent: 'flex-start'}} onClick={() => alert('Settings page coming soon!')}>
          <Settings size={20} />
          <span>Settings</span>
        </button>
      </div>
    </div>
  );
}
