const WEB_APP_URL = "YOUR_GOOGLE_SCRIPT_WEBAPP_URL_HERE";

let currentUser = null;

// ===== Utility: get formatted current time =====
function getCurrentTime() {
    const now = new Date();
    return now.toLocaleString('en-US', { hour12: false });
}

// ===== Login =====
async function login() {
    const userID = document.getElementById("userID").value.trim();
    if(!userID) { alert("Enter User ID"); return; }

    const res = await fetch(WEB_APP_URL + "?sheet=Users");
    const users = await res.json();

    const user = users.find(u => u[0] === userID);
    if(user) {
        currentUser = { id: user[0], name: user[1] };
        document.getElementById("empName").innerText = currentUser.name;
        document.getElementById("employeeArea").style.display = "block";
        document.getElementById("loginArea").style.display = "none";
    } else {
        alert("Invalid User ID");
    }
}

// ===== Update Attendance (Check-In / Check-Out) =====
async function updateAttendance(type) {
    const dateTime = getCurrentTime();

    // Fetch existing attendance
    const res = await fetch(WEB_APP_URL + "?sheet=Attendance");
    const data = await res.json();

    const todayStr = new Date().toLocaleDateString();
    let existingRow = data.find(r => r[0] === currentUser.id && new Date(r[1]).toLocaleDateString() === todayStr);

    if(existingRow){
        // TODO: Apps Script update function needed
        alert("Attendance already exists for today. Check-In/Check-Out might create duplicate until update function is added.");
    } else {
        // Add new row
        const payload = [currentUser.id, dateTime, type==='in'?dateTime:"", type==='out'?dateTime:"", currentUser.name];
        await fetch(WEB_APP_URL + "?sheet=Attendance", {
            method: "POST",
            body: JSON.stringify(payload)
        });
        alert(`${type==='in' ? 'Check-In' : 'Check-Out'} recorded: ${dateTime}`);
    }
}

function checkIn(){ updateAttendance('in'); }
function checkOut(){ updateAttendance('out'); }

// ===== Update Task =====
async function updateTask() {
    const taskTitle = document.getElementById("taskTitle").value.trim();
    const taskStatus = document.getElementById("taskStatus").value;
    const dateTime = getCurrentTime();

    if(!taskTitle) { alert("Enter Task Title"); return; }

    const payload = ["task_" + Date.now(), currentUser.id, taskTitle, taskStatus, dateTime, currentUser.name];
    await fetch(WEB_APP_URL + "?sheet=Tasks", {
        method: "POST",
        body: JSON.stringify(payload)
    });
    alert("Task updated: " + taskTitle);
    document.getElementById("taskTitle").value = "";
}
