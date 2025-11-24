// ----------------------
// CONFIG
// ----------------------
const API_BASE = "https://hr-app-backend-lmsb.onrender.com";

// ----------------------
// AUTH CHECK
// ----------------------
const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

if (!token || !user || user.role !== "admin") {
    alert("Unauthorized");
    location.href = "index.html";
}

// ----------------------
// PAGE SWITCHING
// ----------------------
const pages = document.querySelectorAll(".page");
const navLinks = document.querySelectorAll("aside nav a");

navLinks.forEach(link => {
    link.addEventListener("click", () => {
        const page = link.dataset.page;

        pages.forEach(p => p.classList.add("hidden"));
        document.getElementById(page + "Page").classList.remove("hidden");

        navLinks.forEach(n => n.classList.remove("active"));
        link.classList.add("active");

        if (page === "dashboard") loadDashboard();
        if (page === "employees") loadEmployees();
    });
});

// ----------------------
// LOGOUT
// ----------------------
document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.clear();
    location.href = "index.html";
});

// ----------------------
// LOAD EMPLOYEES
// ----------------------
async function loadEmployees() {
    try {
        const res = await fetch(`${API_BASE}/api/employees`, {
            headers: { "Authorization": "Bearer " + token }
        });

        const data = await res.json();
        if (!res.ok) return alert(data.message);

        const tbody = document.querySelector("#employeesTable tbody");
        tbody.innerHTML = "";

        data.forEach(emp => {
            tbody.innerHTML += `
                <tr>
                    <td>${emp.name}</td>
                    <td>${emp.email}</td>
                    <td>${emp.role}</td>
                    <td><button class="ghost">View</button></td>
                </tr>
            `;
        });

    } catch (err) {
        console.error(err);
        alert("Network error");
    }
}

// ----------------------
// CREATE EMPLOYEE
// ----------------------
document.getElementById("createBtn").addEventListener("click", async () => {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const baseSalary = document.getElementById("baseSalary").value.trim();
    const otRate = document.getElementById("otRate").value.trim();

    if (!name || !email || !password) {
        return alert("All fields required");
    }

    try {
        const res = await fetch(`${API_BASE}/api/employees`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({
                name,
                email,
                password,
                role: "employee",
                baseSalary,
                otRate
            })
        });

        const data = await res.json();
        if (!res.ok) return alert(data.message);

        alert("Employee Created!");
        loadEmployees();
    } catch (err) {
        console.error(err);
        alert("Network Error");
    }
});

// ----------------------
// DASHBOARD DATA
// ----------------------
async function loadDashboard() {
    try {
        const res = await fetch(`${API_BASE}/api/employees`, {
            headers: { "Authorization": "Bearer " + token }
        });
        const data = await res.json();

        document.getElementById("totalEmployees").innerText = data.length;

    } catch (err) {
        console.error(err);
    }
}

// Load dashboard initially
loadDashboard();
