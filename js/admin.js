const scriptURL = "https://script.google.com/macros/s/AKfycbwO7rRBaZT_PvPDNVd7HHyTvldn9n3abxFYikvJ_pHoILH27XDWO6hZb88HOH8Xw-Tr/exec";

async function loadAdminData() {
  const period = document.getElementById("period").value;
  const res = await fetch(`${scriptURL}?action=getAdminData&period=${period}`);
  const data = await res.json();

  renderAttendanceChart(data.attendance);
  renderTaskChart(data.tasks);
  renderTable(data.attendance);
}

function renderAttendanceChart(attendance) {
  const ctx = document.getElementById("attendanceChart").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: attendance.map(a => `${a.UserID} - ${a.Name}`),
      datasets: [{
        label: "Attendance Count",
        data: attendance.map(a => a.Count),
        backgroundColor: "rgba(75,192,192,0.6)"
      }]
    }
  });
}

function renderTaskChart(tasks) {
  const ctx = document.getElementById("taskChart").getContext("2d");
  new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Not Started", "In Progress", "Completed"],
      datasets: [{
        data: [
          tasks.notStarted,
          tasks.inProgress,
          tasks.completed
        ],
        backgroundColor: ["#f39c12", "#3498db", "#2ecc71"]
      }]
    }
  });
}

function renderTable(attendance) {
  const table = document.getElementById("adminTable");
  table.innerHTML = "<h3>Attendance Records</h3>" +
    attendance.map(a => `<p>${a.UserID} - ${a.Name}: ${a.Count}</p>`).join("");
}

function exportCSV() {
  window.open(`${scriptURL}?action=exportCSV`);
}

window.onload = loadAdminData;
