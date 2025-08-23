const candidates = [
  { id: 1, name: "Candidate A", votes: 0 },
  { id: 2, name: "Candidate B", votes: 0 },
  { id: 3, name: "Candidate C", votes: 0 }
];

let selectedCandidate = null;

const candidatesList = document.getElementById("candidates-list");
const results = document.getElementById("results");
const totalVotesSpan = document.getElementById("total-votes");
const modal = document.getElementById("voteModal");
const modalText = document.getElementById("modalText");
const confirmBtn = document.getElementById("confirmVote");
const cancelBtn = document.getElementById("cancelVote");

// Render candidates
function renderCandidates() {
  candidatesList.innerHTML = "";
  candidates.forEach(c => {
    const card = document.createElement("div");
    card.className = "candidate-card";
    card.innerHTML = `
      <h3>${c.name}</h3>
      <button class="vote-btn" onclick="openVoteModal(${c.id})">Vote</button>
    `;
    candidatesList.appendChild(card);
  });
}

// Render results
function renderResults() {
  results.innerHTML = "";
  let total = 0;
  candidates.forEach(c => {
    total += c.votes;
    const item = document.createElement("div");
    item.className = "result-item";
    item.textContent = `${c.name}: ${c.votes} votes`;
    results.appendChild(item);
  });
  totalVotesSpan.textContent = total;
}

// Open modal
function openVoteModal(id) {
  selectedCandidate = candidates.find(c => c.id === id);
  modalText.textContent = `Are you sure you want to vote for ${selectedCandidate.name}?`;
  modal.style.display = "flex";
}

// Confirm / Cancel Vote
confirmBtn.onclick = () => {
  if (selectedCandidate) {
    selectedCandidate.votes++;
    saveData();
    renderResults();
  }
  modal.style.display = "none";
};

cancelBtn.onclick = () => {
  modal.style.display = "none";
};

// Save data
function saveData() {
  localStorage.setItem("candidates", JSON.stringify(candidates));
}

// Load data
function loadData() {
  const saved = localStorage.getItem("candidates");
  if (saved) {
    const arr = JSON.parse(saved);
    arr.forEach((c, i) => candidates[i].votes = c.votes);
  }
}

// Clear votes
document.getElementById("clear-votes").addEventListener("click", () => {
  candidates.forEach(c => c.votes = 0);
  saveData();
  renderResults();
});

// Export
document.getElementById("export-data").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(candidates)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "votes.json";
  link.click();
});

// Import
document.getElementById("import-data").addEventListener("click", () => {
  document.getElementById("import-file").click();
});

document.getElementById("import-file").addEventListener("change", e => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    const arr = JSON.parse(reader.result);
    arr.forEach((c, i) => candidates[i].votes = c.votes);
    saveData();
    renderResults();
  };
  reader.readAsText(file);
});

// Init
loadData();
renderCandidates();
renderResults();

