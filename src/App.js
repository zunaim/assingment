import './App.css';
import axios from 'axios';
import React, { useState, useEffect } from 'react';

const apiUrl = 'https://api.quicksell.co/v1/internal/frontend-assignment';

function App() {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    const savedUser = localStorage.getItem('selectedUser');
    const savedPriority = localStorage.getItem('selectedPriority');
    const savedStatus = localStorage.getItem('selectedStatus');

    if (savedUser) setSelectedUser(savedUser);
    if (savedPriority) setSelectedPriority(savedPriority);
    if (savedStatus) setSelectedStatus(savedStatus);

    axios
      .get(apiUrl)
      .then((response) => {
        console.log('API Response:', response.data);
        setTickets(response.data.tickets);
        setUsers(response.data.users);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);

  useEffect(() => {
    localStorage.setItem('selectedUser', selectedUser);
    localStorage.setItem('selectedPriority', selectedPriority);
    localStorage.setItem('selectedStatus', selectedStatus);
  }, [selectedUser, selectedPriority, selectedStatus]);


  const filteredTickets = tickets.filter((ticket) => {
    if (selectedUser && ticket.userId !== selectedUser) return false;
    if (selectedPriority !== '' && ticket.priority.toString() !== selectedPriority) return false;
    if (selectedStatus !== '' && ticket.status !== selectedStatus) return false;
    return true;
  });

  return (
    <div>
      <div className="options-container">
        <div className="option">
          <label><i className="fas fa-user"></i></label>
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className={selectedUser ? 'selected' : ''}
          >
            <option value="">All Users</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
        <div className="option">
          <label><i className="fas fa-flag"></i> Priority:</label>
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className={selectedPriority !== '' ? 'selected' : ''}
          >
            <option value="">All Priorities</option>
            <option value="0">No Priority</option>
            <option value="1">Low</option>
            <option value="2">Medium</option>
            <option value="3">High</option>
            <option value="4">Urgent</option>
          </select>
        </div>
        <div className="option">
          <label><i className="fas fa-info-circle"></i></label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className={selectedStatus !== '' ? 'selected' : ''}
          >
            <option value="">All Statuses</option>
            <option value="Todo">Todo</option>
            <option value="In progress">In progress</option>
            <option value="Backlog">Backlog</option>
          </select>
        </div>
      </div>
      <div className="card-container">
        {filteredTickets.map((ticket) => (
          <div key={ticket.id} className="card">
            <h3>{ticket.title}</h3>
            <p><i className="fas fa-user"></i> User: {users.find((user) => user.id === ticket.userId)?.name}</p>
            <p><i className="fas fa-flag"></i> Priority: {getPriorityLabel(ticket.priority)}</p>
            <p><i className="fas fa-info-circle"></i> Status: {ticket.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function getPriorityLabel(value) {
  switch (value) {
    case 0:
      return 'No Priority';
    case 1:
      return 'Low';
    case 2:
      return 'Medium';
    case 3:
      return 'High';
    case 4:
      return 'Urgent';
    default:
      return '';
  }
}

export default App;