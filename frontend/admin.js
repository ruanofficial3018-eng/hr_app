// --- CONFIG ---
const API_BASE = "https://hr-app-backend-lmsb.onrender.com";

// --- Elements ---
const nameEl = document.getElementById("name");
const emailEl = document.getElementById("email");
const passEl = document.getElementById("password");
const baseSalaryEl = document.getElementById("baseSalary");
const otRateEl = document.getElementById("otRate");
const createBtn = document.getElementById("createBtn");

// --- Token ---
const token = localStorage.getItem("token");
if (!token) {
    alert("Not authorized");
    location.href = "index.html";
}

// --- Create Employee ---
createBtn.addEventListener("click", async () => {
    const name = nameEl.value.trim();
    const email = emailEl.value.trim();
    const password = passEl.value.trim();
    const baseSalary = baseSalaryEl.value.trim();
    const otRate = otRateEl.value.trim();

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

        if (!res.ok) return alert(data.message || "Error");

        alert("Employee Created!");
        location.reload();

    } catch (err) {
        console.error(err);
        alert("Network Error");
    }
});

// --- Logout ---
document.getElementById("logout").addEventListener("click", () => {
    localStorage.clear();
    location.href = "index.html";
});
