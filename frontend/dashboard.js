// Admin dashboard interactions
const token = localStorage.getItem('token');
if(!token) location.href = '/';
const user = JSON.parse(localStorage.getItem('user') || '{}');
const API = localStorage.getItem('apiBase') || 'http://localhost:5000/api';

document.querySelectorAll('.sidebar nav a').forEach(a=>{
  a.addEventListener('click', (e)=>{
    e.preventDefault();
    document.querySelectorAll('.sidebar nav a').forEach(x=>x.classList.remove('active'));
    a.classList.add('active');
    const page = a.dataset.page;
    document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
    document.getElementById(page + 'Page').classList.remove('hidden');
  });
});

document.getElementById('logoutBtn').addEventListener('click', ()=>{ localStorage.clear(); location.href='/' });

async function fetchEmployees(){
  const res = await fetch(API + '/employees', {headers:{Authorization:'Bearer '+token}});
  const data = await res.json();
  document.getElementById('totalEmployees').innerText = data.length;
  const tbody = document.querySelector('#employeesTable tbody');
  tbody.innerHTML = '';
  data.forEach(u=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${u.name}</td><td>${u.email}</td><td>${u.role}</td>
      <td><button data-id="${u._id}" class="edit">Edit</button> <button data-id="${u._id}" class="del">Delete</button></td>`;
    tbody.appendChild(tr);
  });
}

document.getElementById('createEmp').addEventListener('click', async ()=>{
  const name=document.getElementById('emp_name').value;
  const email=document.getElementById('emp_email').value;
  const password=document.getElementById('emp_password').value;
  const base=Number(document.getElementById('emp_base').value||0);
  const ot=Number(document.getElementById('emp_ot').value||0);
  const res = await fetch(API + '/employees', {
    method:'POST',
    headers:{'Content-Type':'application/json', Authorization:'Bearer '+token},
    body: JSON.stringify({name,email,password,role:'employee', baseSalary:base, otRate:ot})
  });
  const data = await res.json();
  if(!res.ok) return alert(data.message || 'Error');
  alert('Created');
  fetchEmployees();
});

document.getElementById('downloadCsv').addEventListener('click', ()=>{
  window.open(API + '/attendance/report/csv?token=' + token, '_blank');
});

async function init(){
  await fetchEmployees();
  // charts with dummy data to be replaced by real queries
  const ctx = document.getElementById('monthlyAttendanceChart').getContext('2d');
  new Chart(ctx, {type:'bar', data:{labels:['Week1','Week2','Week3','Week4'], datasets:[{label:'Attendance', data:[12,18,15,20]}]}});
  const ctx2 = document.getElementById('dailyPunchesChart').getContext('2d');
  new Chart(ctx2, {type:'line', data:{labels:['Mon','Tue','Wed','Thu','Fri'], datasets:[{label:'Punches', data:[5,7,6,8,4]}]}});
}
init();
