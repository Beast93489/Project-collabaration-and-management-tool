import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client/dist/sockjs';
import { Plus, Clock } from 'lucide-react';
import './KanbanBoard.css';

export default function KanbanBoard({ user }) {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const stompClient = useRef(null);

  useEffect(() => {
    // Fetch initial project data and tasks
    fetch(`http://localhost:8080/api/projects/${id}`)
      .then(res => res.json())
      .then(setProject)
      .catch(console.error);

    fetch(`http://localhost:8080/api/tasks/project/${id}`)
      .then(res => res.json())
      .then(setTasks)
      .catch(console.error);

    // Setup WebSocket
    const socket = new SockJS('http://localhost:8080/ws-collaboration');
    const client = new Client({
      webSocketFactory: () => socket,
      debug: function (str) {
        console.log(str);
      },
      onConnect: () => {
        client.subscribe('/topic/tasks', (msg) => {
          if (msg.body) {
            const updatedTask = JSON.parse(msg.body);
            if (updatedTask.project?.id === Number(id)) {
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
      headers: {
        'Content-Type': 'application/json',
        'userId': user.id
      },
      body: JSON.stringify({ status: newStatus })
    }).catch(console.error);
  };

  const columns = ['To Do', 'In Progress', 'Completed'];

  if (!project) return <div>Loading...</div>;

  return (
    <div className="flex-col gap-4 h-full" style={{ height: 'calc(100vh - 120px)' }}>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-xl font-bold">{project.title}</h1>
          <p className="text-muted text-sm">{project.description}</p>
        </div>
        <button className="btn btn-primary">
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
                  <h4 className="font-bold text-sm mb-1">{task.title}</h4>
                  <p className="text-xs text-muted mb-3 line-clamp-2">{task.description}</p>
                  
                  <div className="flex justify-between items-center mb-3">
                    <span className={`badge badge-${task.priority.toLowerCase()}`}>{task.priority}</span>
                    {task.assignee && (
                      <img src={task.assignee.avatarUrl} alt="Assignee" className="avatar avatar-sm" title={task.assignee.name} />
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center border-top pt-2 mt-auto">
                    <span className="text-xs text-muted flex items-center gap-1">
                      <Clock size={12} /> {new Date(task.dueDate).toLocaleDateString()}
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
    </div>
  );
}
