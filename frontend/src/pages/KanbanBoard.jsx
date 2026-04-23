import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client/dist/sockjs';
import { Plus, Clock, X, Edit2, Trash2, ArrowLeft } from 'lucide-react';
import './KanbanBoard.css';

export default function KanbanBoard({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const stompClient = useRef(null);

  // Add Task modal
  const [showAddTask, setShowAddTask] = useState(false);
  const [taskForm, setTaskForm] = useState({
    title: '', description: '', priority: 'Medium', dueDate: '', assigneeId: ''
  });

  // Edit Task modal
  const [showEditTask, setShowEditTask] = useState(false);
  const [editTaskForm, setEditTaskForm] = useState(null);

  // Edit Project modal
  const [showEditProject, setShowEditProject] = useState(false);
  const [projectForm, setProjectForm] = useState({
    title: '', description: '', deadline: '', priority: 'Medium'
  });

  useEffect(() => {
    fetch(`http://localhost:8080/api/projects/${id}`)
      .then(res => res.json())
      .then(data => {
        setProject(data);
        setProjectForm({
          title: data.title || '',
          description: data.description || '',
          deadline: data.deadline || '',
          priority: data.priority || 'Medium'
        });
      })
      .catch(console.error);

    fetch(`http://localhost:8080/api/tasks/project/${id}`)
      .then(res => res.json())
      .then(setTasks)
      .catch(console.error);

    fetch('http://localhost:8080/api/users')
      .then(res => res.json())
      .then(setUsers)
      .catch(console.error);

    // Setup WebSocket
    const socket = new SockJS('http://localhost:8080/ws-collaboration');
    const client = new Client({
      webSocketFactory: () => socket,
      debug: () => {},
      onConnect: () => {
        client.subscribe('/topic/tasks', (msg) => {
          if (msg.body) {
            const updatedTask = JSON.parse(msg.body);
            const taskProjectId = updatedTask.project?.id;
            if (taskProjectId === Number(id)) {
              setTasks(prev => {
                const existing = prev.find(t => t.id === updatedTask.id);
                if (existing) {
                  return prev.map(t => t.id === updatedTask.id ? updatedTask : t);
                }
                return [...prev, updatedTask];
              });
            }
          }
        });
        client.subscribe('/topic/task-deleted', (msg) => {
          if (msg.body) {
            const deletedId = JSON.parse(msg.body);
            setTasks(prev => prev.filter(t => t.id !== deletedId));
          }
        });
      },
    });

    client.activate();
    stompClient.current = client;

    return () => {
      client.deactivate();
    };
  }, [id]);

  const handleStatusChange = (taskId, newStatus) => {
    fetch(`http://localhost:8080/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    }).catch(console.error);
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    const payload = {
      title: taskForm.title,
      description: taskForm.description,
      priority: taskForm.priority,
      status: 'To Do',
      dueDate: taskForm.dueDate || null,
      project: { id: Number(id) },
      assignee: taskForm.assigneeId ? { id: Number(taskForm.assigneeId) } : null
    };
    fetch('http://localhost:8080/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(() => {
      setShowAddTask(false);
      setTaskForm({ title: '', description: '', priority: 'Medium', dueDate: '', assigneeId: '' });
      // WebSocket will push update, but also fetch fresh
      fetch(`http://localhost:8080/api/tasks/project/${id}`)
        .then(r => r.json())
        .then(setTasks);
    })
    .catch(console.error);
  };

  const openEditTask = (task) => {
    setEditTaskForm({
      id: task.id,
      title: task.title || '',
      description: task.description || '',
      priority: task.priority || 'Medium',
      status: task.status || 'To Do',
      dueDate: task.dueDate || '',
      assigneeId: task.assignee?.id || ''
    });
    setShowEditTask(true);
  };

  const handleEditTask = (e) => {
    e.preventDefault();
    const payload = {
      title: editTaskForm.title,
      description: editTaskForm.description,
      priority: editTaskForm.priority,
      status: editTaskForm.status,
      dueDate: editTaskForm.dueDate || null,
      assignee: editTaskForm.assigneeId ? { id: Number(editTaskForm.assigneeId) } : null
    };
    fetch(`http://localhost:8080/api/tasks/${editTaskForm.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(() => {
      setShowEditTask(false);
      setEditTaskForm(null);
      fetch(`http://localhost:8080/api/tasks/project/${id}`)
        .then(r => r.json())
        .then(setTasks);
    })
    .catch(console.error);
  };

  const handleDeleteTask = (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    fetch(`http://localhost:8080/api/tasks/${taskId}`, { method: 'DELETE' })
      .then(() => {
        setTasks(prev => prev.filter(t => t.id !== taskId));
      })
      .catch(console.error);
  };

  const handleEditProject = (e) => {
    e.preventDefault();
    fetch(`http://localhost:8080/api/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(projectForm)
    })
    .then(res => res.json())
    .then(updated => {
      setProject(updated);
      setShowEditProject(false);
    })
    .catch(console.error);
  };

  const columns = ['To Do', 'In Progress', 'Completed'];

  if (!project) return <div>Loading...</div>;

  return (
    <div className="flex-col gap-4 h-full" style={{ height: 'calc(100vh - 120px)' }}>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <button className="btn btn-sm" onClick={() => navigate('/projects')}>
            <ArrowLeft size={16} /> Back
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold">{project.title}</h1>
              <button className="btn-icon" onClick={() => setShowEditProject(true)} title="Edit Project">
                <Edit2 size={16} />
              </button>
            </div>
            <p className="text-muted text-sm">{project.description}</p>
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddTask(true)}>
          <Plus size={20} /> Add Task
        </button>
      </div>

      <div className="kanban-board">
        {columns.map(col => (
          <div key={col} className="kanban-column">
            <h3 className="kanban-col-header">
              {col} <span className="kanban-count">{tasks.filter(t => t.status === col).length}</span>
            </h3>
            <div className="kanban-tasks">
              {tasks.filter(t => t.status === col).map(task => (
                <div key={task.id} className="kanban-task-card card">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-sm">{task.title}</h4>
                    <div className="flex gap-2">
                      <button className="btn-icon" onClick={() => openEditTask(task)} title="Edit Task">
                        <Edit2 size={14} />
                      </button>
                      <button className="btn-icon text-red-500" onClick={() => handleDeleteTask(task.id)} title="Delete Task">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-muted mb-3 line-clamp-2">{task.description}</p>
                  
                  <div className="flex justify-between items-center mb-3">
                    <span className={`badge badge-${task.priority?.toLowerCase()}`}>{task.priority}</span>
                    {task.assignee && (
                      <img src={task.assignee.avatarUrl} alt="Assignee" className="avatar avatar-sm" title={task.assignee.name} />
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center border-top pt-2 mt-auto">
                    <span className="text-xs text-muted flex items-center gap-1">
                      <Clock size={12} /> {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}
                    </span>
                  </div>

                  {/* Quick status actions */}
                  <div className="kanban-actions mt-3 flex gap-2">
                    {col !== 'To Do' && <button onClick={() => handleStatusChange(task.id, 'To Do')} className="btn btn-sm">To Do</button>}
                    {col !== 'In Progress' && <button onClick={() => handleStatusChange(task.id, 'In Progress')} className="btn btn-sm">In Prog</button>}
                    {col !== 'Completed' && <button onClick={() => handleStatusChange(task.id, 'Completed')} className="btn btn-sm">Done</button>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Add Task Modal */}
      {showAddTask && (
        <div className="modal-backdrop">
          <div className="modal card" style={{ maxWidth: 480 }}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add New Task</h2>
              <button className="btn-icon" onClick={() => setShowAddTask(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleAddTask} className="flex-col gap-4">
              <div className="form-group">
                <label>Title</label>
                <input type="text" className="input" value={taskForm.title} onChange={e => setTaskForm({...taskForm, title: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea className="input" rows={3} value={taskForm.description} onChange={e => setTaskForm({...taskForm, description: e.target.value})} />
              </div>
              <div className="flex gap-4">
                <div className="form-group flex-1">
                  <label>Priority</label>
                  <select className="input" value={taskForm.priority} onChange={e => setTaskForm({...taskForm, priority: e.target.value})}>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div className="form-group flex-1">
                  <label>Due Date</label>
                  <input type="date" className="input" value={taskForm.dueDate} onChange={e => setTaskForm({...taskForm, dueDate: e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label>Assignee</label>
                <select className="input" value={taskForm.assigneeId} onChange={e => setTaskForm({...taskForm, assigneeId: e.target.value})}>
                  <option value="">Unassigned</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" className="btn" onClick={() => setShowAddTask(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Add Task</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {showEditTask && editTaskForm && (
        <div className="modal-backdrop">
          <div className="modal card" style={{ maxWidth: 480 }}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Edit Task</h2>
              <button className="btn-icon" onClick={() => { setShowEditTask(false); setEditTaskForm(null); }}><X size={20} /></button>
            </div>
            <form onSubmit={handleEditTask} className="flex-col gap-4">
              <div className="form-group">
                <label>Title</label>
                <input type="text" className="input" value={editTaskForm.title} onChange={e => setEditTaskForm({...editTaskForm, title: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea className="input" rows={3} value={editTaskForm.description} onChange={e => setEditTaskForm({...editTaskForm, description: e.target.value})} />
              </div>
              <div className="flex gap-4">
                <div className="form-group flex-1">
                  <label>Status</label>
                  <select className="input" value={editTaskForm.status} onChange={e => setEditTaskForm({...editTaskForm, status: e.target.value})}>
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <div className="form-group flex-1">
                  <label>Priority</label>
                  <select className="input" value={editTaskForm.priority} onChange={e => setEditTaskForm({...editTaskForm, priority: e.target.value})}>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="form-group flex-1">
                  <label>Due Date</label>
                  <input type="date" className="input" value={editTaskForm.dueDate} onChange={e => setEditTaskForm({...editTaskForm, dueDate: e.target.value})} />
                </div>
                <div className="form-group flex-1">
                  <label>Assignee</label>
                  <select className="input" value={editTaskForm.assigneeId} onChange={e => setEditTaskForm({...editTaskForm, assigneeId: e.target.value})}>
                    <option value="">Unassigned</option>
                    {users.map(u => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" className="btn" onClick={() => { setShowEditTask(false); setEditTaskForm(null); }}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      {showEditProject && (
        <div className="modal-backdrop">
          <div className="modal card" style={{ maxWidth: 480 }}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Edit Project</h2>
              <button className="btn-icon" onClick={() => setShowEditProject(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleEditProject} className="flex-col gap-4">
              <div className="form-group">
                <label>Title</label>
                <input type="text" className="input" value={projectForm.title} onChange={e => setProjectForm({...projectForm, title: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea className="input" rows={3} value={projectForm.description} onChange={e => setProjectForm({...projectForm, description: e.target.value})} />
              </div>
              <div className="flex gap-4">
                <div className="form-group flex-1">
                  <label>Deadline</label>
                  <input type="date" className="input" value={projectForm.deadline} onChange={e => setProjectForm({...projectForm, deadline: e.target.value})} />
                </div>
                <div className="form-group flex-1">
                  <label>Priority</label>
                  <select className="input" value={projectForm.priority} onChange={e => setProjectForm({...projectForm, priority: e.target.value})}>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" className="btn" onClick={() => setShowEditProject(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
