// ===== Voting System Logic =====

// Sample candidates
const candidates = [
  { id: 1, name: "Candidate A", votes: 0 },
  { id: 2, name: "Candidate B", votes: 0 },
  { id: 3, name: "Candidate C", votes: 0 }
];

// Load votes from localStorage
function loadVotes() {
  const saved = localStorage.getItem("votes");
  return saved ? JSON.parse(saved) : candidates;
}

// Save votes
function saveVotes(data) {
  localStorage.setItem("votes", JSON.stringify(data));
}

// Render candidates
function renderCandidates() {
  const list = document.getElementById("candidates-list");
  list.innerHTML = "";
  votes.forEach(c => {
    const btn = document.createElement("button");
    btn.textContent = `${c.name} (Votes: ${c.votes})`;
    btn.className = "btn btn-ghost";
    btn.onclick = () => {
      c.votes++;
      saveVotes(votes);
      renderCandidates();
      renderResults();
    };
    list.appendChild(btn);
  });
}

// Render results
function renderResults() {
  const resultsDiv = document.getElementById("results");
  const totalVotes = votes.reduce((sum, c) => sum + c.votes, 0);
  document.getElementById("total-votes").textContent = totalVotes;
  resultsDiv.innerHTML = votes.map(c => `${c.name}: ${c.votes}`).join("<br>");
}

// Clear votes
document.getElementById("clear-votes").addEventListener("click", () => {
  localStorage.removeItem("votes");
  votes = [...candidates];
  renderCandidates();
  renderResults();
});

// Export data
document.getElementById("export-data").addEventListener("click", () => {
  const data = JSON.stringify(votes, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "votes.json";
  a.click();
});

// Import data
document.getElementById("import-data").addEventListener("click", () => {
  document.getElementById("import-file").click();
});

document.getElementById("import-file").addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    votes = JSON.parse(reader.result);
    saveVotes(votes);
    renderCandidates();
    renderResults();
  };
  reader.readAsText(file);
});

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("loggedIn");
  window.location.href = "index.html";
});

// Initialize
let votes = loadVotes();
renderCandidates();
renderResults();

});

