// frontend/admin_users.js
const API_BASE = "https://hr-app-backend-lmsb.onrender.com/api"; // <-- update if your backend URL differs

// Auth token + user check
const token = localStorage.getItem('token');
const me = JSON.parse(localStorage.getItem('user') || 'null');
if (!token || !me || me.role !== 'admin') {
  alert('Not authorized. Please login as admin.');
  window.location.href = 'index.html';
}

// Elements
const btnCreate = document.getElementById('btnCreate');
const usersTableBody = document.querySelector('#usersTable tbody');

async function fetchUsers() {
  try {
    const res = await fetch(`${API_BASE}/users`, {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    const data = await res.json();
    if (!res.ok) return alert(data.message || 'Failed to load');
    usersTableBody.innerHTML = '';
    data.forEach(u => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${u.name}</td>
        <td>${u.email}</td>
        <td>${u.role}</td>
        <td>${u.status || 'active'}</td>
        <td>
          <button data-id="${u._id}" class="btn-edit">Edit</button>
          <button data-id="${u._id}" class="btn-reset">Reset</button>
          <button data-id="${u._id}" class="btn-toggle">${u.status === 'suspended' ? 'Activate' : 'Suspend'}</button>
          <button data-id="${u._id}" class="btn-delete" style="color:red">Delete</button>
        </td>
      `;
      usersTableBody.appendChild(tr);
    });
  } catch (err) {
    console.error(err);
    alert('Network error');
  }
}

btnCreate.addEventListener('click', async () => {
  const name = document.getElementById('u_name').value.trim();
  const email = document.getElementById('u_email').value.trim();
  const password = document.getElementById('u_password').value.trim();
  const phone = document.getElementById('u_phone').value.trim();
  const department = document.getElementById('u_department').value.trim();
  const designation = document.getElementById('u_designation').value.trim();
  const employeeId = document.getElementById('u_employeeId').value.trim();
  const role = document.getElementById('u_role').value;
  const baseSalary = Number(document.getElementById('u_baseSalary').value || 0);
  const otRate = Number(document.getElementById('u_otRate').value || 0);

  if (!name || !email || !password) return alert('Name, email and password are required');

  try {
    const res = await fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({ name, email, password, phone, department, designation, employeeId, role, baseSalary, otRate })
    });

    const data = await res.json();
    if (!res.ok) return alert(data.message || 'Failed to create');

    alert('User created');
    // clear form
    document.getElementById('u_name').value = '';
    document.getElementById('u_email').value = '';
    document.getElementById('u_password').value = '';
    document.getElementById('u_phone').value = '';
    document.getElementById('u_department').value = '';
    document.getElementById('u_designation').value = '';
    document.getElementById('u_employeeId').value = '';
    document.getElementById('u_baseSalary').value = '';
    document.getElementById('u_otRate').value = '';
    fetchUsers();
  } catch (err) {
    console.error(err);
    alert('Network error');
  }
});

// Delegate actions
usersTableBody.addEventListener('click', async (e) => {
  const id = e.target.getAttribute('data-id');
  if (!id) return;
  if (e.target.classList.contains('btn-delete')) {
    if (!confirm('Delete this user?')) return;
    try {
      const res = await fetch(`${API_BASE}/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + token }
      });
      const data = await res.json();
      if (!res.ok) return alert(data.message);
      alert('Deleted');
      fetchUsers();
    } catch (err) { console.error(err); alert('Network error'); }
  } else if (e.target.classList.contains('btn-reset')) {
    if (!confirm('Reset password?')) return;
    try {
      const res = await fetch(`${API_BASE}/users/${id}/reset`, {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + token }
      });
      const data = await res.json();
      if (!res.ok) return alert(data.message);
      alert('Temporary password: ' + data.tempPassword + '\nShare securely with the user.');
    } catch (err) { console.error(err); alert('Network error'); }
  } else if (e.target.classList.contains('btn-toggle')) {
    const action = e.target.innerText.toLowerCase() === 'suspend' ? 'suspend' : 'activate';
    try {
      const res = await fetch(`${API_BASE}/users/${id}/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
        body: JSON.stringify({ action })
      });
      const data = await res.json();
      if (!res.ok) return alert(data.message);
      alert('Status updated to ' + data.status);
      fetchUsers();
    } catch (err) { console.error(err); alert('Network error'); }
  } else if (e.target.classList.contains('btn-edit')) {
    // Simple prompt-based editing for quick admin use
    const newName = prompt('New name (leave blank to keep)', e.target.closest('tr').children[0].innerText) || undefined;
    const newRole = prompt('New role (admin/hr/manager/employee)', e.target.closest('tr').children[2].innerText) || undefined;
    try {
      const res = await fetch(`${API_BASE}/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
        body: JSON.stringify({ name: newName, role: newRole })
      });
      const data = await res.json();
      if (!res.ok) return alert(data.message);
      alert('Updated');
      fetchUsers();
    } catch (err) { console.error(err); alert('Network error'); }
  }
});

// initial load
fetchUsers();

