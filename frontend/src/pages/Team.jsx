import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

export default function Team() {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', role: 'Team Member', avatarUrl: '' });

  const fetchUsers = () => {
    fetch('http://localhost:8080/api/users')
      .then(res => res.json())
      .then(setUsers)
      .catch(console.error);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingUser ? `http://localhost:8080/api/users/${editingUser.id}` : 'http://localhost:8080/api/users';
    const method = editingUser ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setIsModalOpen(false);
        setEditingUser(null);
        setFormData({ name: '', email: '', role: 'Team Member', avatarUrl: '' });
        fetchUsers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this member?')) {
      try {
        const res = await fetch(`http://localhost:8080/api/users/${id}`, { method: 'DELETE' });
        if (res.ok) fetchUsers();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const openAddModal = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '', role: 'Team Member', avatarUrl: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setFormData({ name: user.name, email: user.email, role: user.role, avatarUrl: user.avatarUrl || '' });
    setIsModalOpen(true);
  };

  return (
    <div className="flex-col gap-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Team Members</h1>
        <button className="btn btn-primary flex items-center gap-2" onClick={openAddModal}>
          <Plus size={20} /> Add Member
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
        {users.map(u => (
          <div key={u.id} className="card flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img src={u.avatarUrl} alt={u.name} className="avatar" style={{width: 48, height: 48}} />
              <div>
                <h3 className="font-bold text-lg">{u.name}</h3>
                <p className="text-sm text-muted">{u.role}</p>
                <p className="text-xs text-muted">{u.email}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="btn-icon" onClick={() => openEditModal(u)} title="Edit">
                <Edit2 size={16} />
              </button>
              <button className="btn-icon text-red-500" onClick={() => handleDelete(u.id)} title="Remove">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-lg">{editingUser ? 'Edit Member' : 'Add Member'}</h2>
              <button className="btn-icon" onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="flex-col gap-4">
              <div className="flex-col gap-2">
                <label className="text-sm font-medium">Name</label>
                <input className="input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div className="flex-col gap-2">
                <label className="text-sm font-medium">Email</label>
                <input type="email" className="input" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
              </div>
              <div className="flex-col gap-2">
                <label className="text-sm font-medium">Role</label>
                <select className="input" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} required>
                  <option value="Team Member">Team Member</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary w-full mt-2">
                {editingUser ? 'Save Changes' : 'Add Member'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
