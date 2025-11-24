// Employee panel: GPS punch
const token = localStorage.getItem('token');
if(!token) location.href = '/';
const API = "https://hr-app-tkdf.onrender.com/api";
const user = JSON.parse(localStorage.getItem('user') || '{}');
document.getElementById('empName').innerText = user.name || 'Employee';

async function showToday(){
  const res = await fetch(API + '/attendance/me/today', {headers:{Authorization:'Bearer '+token}});
  const data = await res.json();
  const el = document.getElementById('todayAtt');
  if(data.length===0) el.innerText = 'No punches today';
  else el.innerText = data.map(d=> `${d.type} @ ${new Date(d.timestamp).toLocaleTimeString()}`).join('\n');
}

async function punch(type){
  if(!navigator.geolocation) return alert('Geolocation not supported');
  navigator.geolocation.getCurrentPosition(async (pos)=>{
    const lat = pos.coords.latitude, lon = pos.coords.longitude;
    const res = await fetch(API + '/attendance/punch', {
      method:'POST',
      headers:{'Content-Type':'application/json', Authorization:'Bearer '+token},
      body: JSON.stringify({type, lat, lon})
    });
    const data = await res.json();
    if(!res.ok) return alert(data.message || 'Error');
    alert('Punched ' + type);
    showToday();
  }, (err)=>{
    alert('Unable to get location: ' + err.message);
  }, {enableHighAccuracy:true, timeout:10000});
}

document.getElementById('punchIn').addEventListener('click', ()=>punch('in'));
document.getElementById('punchOut').addEventListener('click', ()=>punch('out'));

showToday();
