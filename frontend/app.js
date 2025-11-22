// Simple login logic
const API = localStorage.getItem('apiBase') || 'https://hr-backend.onrender.com';
const emailEl = document.getElementById('email');
const passEl = document.getElementById('password');
const loginBtn = document.getElementById('loginBtn');
const toggle = document.getElementById('toggleTheme');

function setTheme(theme){
  document.body.className = theme;
  localStorage.setItem('theme', theme);
}
toggle.addEventListener('click', () => {
  const t = document.body.className === 'light' ? 'dark' : 'light';
  setTheme(t);
});
document.addEventListener('DOMContentLoaded', () => {
  setTheme(localStorage.getItem('theme') || 'light');
});

loginBtn.addEventListener('click', async () => {
  const email = emailEl.value, password = passEl.value;
  if(!email||!password) return alert('enter credentials');
  try{
    const res = await fetch(API + '/auth/login', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({email,password})
    });
    const data = await res.json();
    if(!res.ok) return alert(data.message || 'Login failed');
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    if(data.user.role === 'admin') location.href = 'admin.html';
    else location.href = 'employee.html';
  } catch(err){
    console.error(err); alert('Network error');
  }
});
