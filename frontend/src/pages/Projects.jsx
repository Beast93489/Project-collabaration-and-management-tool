import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Calendar, MoreVertical, X, Edit2, Trash2 } from 'lucide-react';
import './Projects.css';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    priority: 'Medium'
  });

  // Edit project
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState(null);

  // Dropdown menu
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);

  const navigate = useNavigate();

  const fetchProjects = () => {
    fetch('http://localhost:8080/api/projects')
      .then(res => res.json())
      .then(data => setProjects(data))
      .catch(console.error);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getPriorityColor = (priority) => {
    if (priority === 'High') return 'badge-high';
    if (priority === 'Medium') return 'badge-medium';
    return 'badge-low';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:8080/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, members: [] })
    })
    .then(res => res.json())
    .then(() => {
      setShowModal(false);
      setFormData({ title: '', description: '', deadline: '', priority: 'Medium' });
      fetchProjects();
    })
    .catch(console.error);
  };

  const openEditProject = (project) => {
    setEditFormData({
      id: project.id,
      title: project.title || '',
      description: project.description || '',
      deadline: project.deadline || '',
      priority: project.priority || 'Medium'
    });
    setShowEditModal(true);
    setOpenMenuId(null);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    fetch(`http://localhost:8080/api/projects/${editFormData.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: editFormData.title,
        description: editFormData.description,
        deadline: editFormData.deadline,
        priority: editFormData.priority
      })
    })
    .then(res => res.json())
    .then(() => {
      setShowEditModal(false);
      setEditFormData(null);
      fetchProjects();
    })
    .catch(console.error);
  };

  const handleDeleteProject = (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project? All tasks in this project will also be removed.')) return;
    fetch(`http://localhost:8080/api/projects/${projectId}`, { method: 'DELETE' })
      .then(() => {
        fetchProjects();
      })
      .catch(console.error);
    setOpenMenuId(null);
  };

  return (
    <div className="flex-col gap-4" style={{ height: '100%' }}>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">All Projects</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={20} /> New Project
        </button>
      </div>

      <div className="projects-grid">
        {projects.map(project => (
          <div key={project.id} className="card project-card" onClick={() => navigate(`/projects/${project.id}`)}>
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-lg">{project.title}</h3>
              <div className="project-menu-wrapper" ref={openMenuId === project.id ? menuRef : null}>
                <button className="btn-icon" onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === project.id ? null : project.id); }}>
                  <MoreVertical size={16} />
                </button>
                {openMenuId === project.id && (
                  <div className="project-dropdown" onClick={(e) => e.stopPropagation()}>
                    <button className="dropdown-item" onClick={() => openEditProject(project)}>
                      <Edit2 size={14} /> Edit
                    </button>
                    <button className="dropdown-item dropdown-item-danger" onClick={() => handleDeleteProject(project.id)}>
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
            <p className="text-sm text-muted mb-4">{project.description}</p>
            
            <div className="flex items-center gap-2 mb-4">
              <span className={`badge ${getPriorityColor(project.priority)}`}>{project.priority} Priority</span>
            </div>

            <div className="flex items-center justify-between border-top pt-4 mt-auto">
              <div className="flex items-center gap-1 text-sm text-muted">
                <Calendar size={16} />
                <span>Due {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'No date'}</span>
              </div>
              <div className="avatar-group">
                {project.members?.map(member => (
                  <img key={member.id} src={member.avatarUrl} alt={member.name} title={member.name} className="avatar avatar-sm" />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Project Modal */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Create New Project</h2>
              <button className="btn-icon" onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="flex-col gap-4">
              <div className="form-group">
                <label>Title</label>
                <input type="text" className="input" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea className="input" rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
              </div>
              <div className="flex gap-4">
                <div className="form-group flex-1">
                  <label>Deadline</label>
                  <input type="date" className="input" value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} required />
                </div>
                <div className="form-group flex-1">
                  <label>Priority</label>
                  <select className="input" value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})}>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" className="btn" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Project</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      {showEditModal && editFormData && (
        <div className="modal-backdrop">
          <div className="modal card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Edit Project</h2>
              <button className="btn-icon" onClick={() => { setShowEditModal(false); setEditFormData(null); }}><X size={20} /></button>
            </div>
            <form onSubmit={handleEditSubmit} className="flex-col gap-4">
              <div className="form-group">
                <label>Title</label>
                <input type="text" className="input" value={editFormData.title} onChange={e => setEditFormData({...editFormData, title: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea className="input" rows={3} value={editFormData.description} onChange={e => setEditFormData({...editFormData, description: e.target.value})} />
              </div>
              <div className="flex gap-4">
                <div className="form-group flex-1">
                  <label>Deadline</label>
                  <input type="date" className="input" value={editFormData.deadline} onChange={e => setEditFormData({...editFormData, deadline: e.target.value})} />
                </div>
                <div className="form-group flex-1">
                  <label>Priority</label>
                  <select className="input" value={editFormData.priority} onChange={e => setEditFormData({...editFormData, priority: e.target.value})}>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" className="btn" onClick={() => { setShowEditModal(false); setEditFormData(null); }}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
