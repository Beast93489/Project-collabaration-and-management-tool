import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Calendar, MoreVertical, X } from 'lucide-react';
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
              <button className="btn-icon" onClick={(e) => { e.stopPropagation(); }}>
                <MoreVertical size={16} />
              </button>
            </div>
            <p className="text-sm text-muted mb-4">{project.description}</p>
            
            <div className="flex items-center gap-2 mb-4">
              <span className={`badge ${getPriorityColor(project.priority)}`}>{project.priority} Priority</span>
            </div>

            <div className="flex items-center justify-between border-top pt-4 mt-auto">
              <div className="flex items-center gap-1 text-sm text-muted">
                <Calendar size={16} />
                <span>Due {new Date(project.deadline).toLocaleDateString()}</span>
              </div>
              <div className="avatar-group">
                {project.members.map(member => (
                  <img key={member.id} src={member.avatarUrl} alt={member.name} title={member.name} className="avatar avatar-sm" />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

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
    </div>
  );
}
