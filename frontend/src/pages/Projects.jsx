import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Calendar, MoreVertical } from 'lucide-react';
import './Projects.css';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8080/api/projects')
      .then(res => res.json())
      .then(data => setProjects(data))
      .catch(console.error);
  }, []);

  const getPriorityColor = (priority) => {
    if (priority === 'High') return 'badge-high';
    if (priority === 'Medium') return 'badge-medium';
    return 'badge-low';
  };

  return (
    <div className="flex-col gap-4" style={{ height: '100%' }}>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">All Projects</h1>
        <button className="btn btn-primary">
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
    </div>
  );
}
