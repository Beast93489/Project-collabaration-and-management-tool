import React, { useState, useEffect } from 'react';
import { CheckCircle2, Clock, FolderKanban, ListTodo } from 'lucide-react';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:8080/api/tasks').then(r => r.json()),
      fetch('http://localhost:8080/api/projects').then(r => r.json()),
      fetch('http://localhost:8080/api/activities').then(r => r.json())
    ]).then(([t, p, a]) => {
      setTasks(t);
      setProjects(p);
      setActivities(a);
    }).catch(console.error);
  }, []);

  const stats = {
    projects: projects.length,
    totalTasks: tasks.length,
    completed: tasks.filter(t => t.status === 'Completed').length,
    pending: tasks.filter(t => t.status !== 'Completed').length,
  };

  return (
    <div className="flex-col gap-4">
      <h1 className="text-xl font-bold mb-4">Dashboard Overview</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
        <div className="card flex-col gap-2">
          <div className="flex items-center justify-between text-muted">
            <span>Total Projects</span>
            <FolderKanban size={20} />
          </div>
          <h2 className="text-xl font-bold">{stats.projects}</h2>
        </div>
        <div className="card flex-col gap-2">
          <div className="flex items-center justify-between text-muted">
            <span>Total Tasks</span>
            <ListTodo size={20} />
          </div>
          <h2 className="text-xl font-bold">{stats.totalTasks}</h2>
        </div>
        <div className="card flex-col gap-2">
          <div className="flex items-center justify-between text-success">
            <span>Completed</span>
            <CheckCircle2 size={20} />
          </div>
          <h2 className="text-xl font-bold">{stats.completed}</h2>
        </div>
        <div className="card flex-col gap-2">
          <div className="flex items-center justify-between text-warning">
            <span>Pending</span>
            <Clock size={20} />
          </div>
          <h2 className="text-xl font-bold">{stats.pending}</h2>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
        <div className="card">
          <h3 className="font-bold mb-4">Recent Activity</h3>
          <div className="flex-col gap-4">
            {activities.map(act => (
              <div key={act.id} className="flex gap-4 items-center" style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)'}}>
                <img src={act.user?.avatarUrl} alt="avatar" className="avatar" style={{width: 32, height: 32}} />
                <div>
                  <p className="text-sm">{act.message}</p>
                  <p className="text-xs text-muted">{new Date(act.timestamp).toLocaleString()}</p>
                </div>
              </div>
            ))}
            {activities.length === 0 && <p className="text-muted text-sm">No recent activity.</p>}
          </div>
        </div>
        <div className="card">
          <h3 className="font-bold mb-4">Team Summary</h3>
          <div className="flex-col gap-4">
            <p className="text-sm text-muted">Workload overview is coming soon.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
