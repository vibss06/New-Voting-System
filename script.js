// === Candidate List ===
// Change names & descriptions here. Save & push to GitHub for instant update.

const candidates = [
    { id: 1, name: "Alice Johnson", desc: "Passionate about community development and youth programs." },
    { id: 2, name: "Bob Smith", desc: "Advocates for clean energy and better public transport." },
    { id: 3, name: "Charlie Lee", desc: "Focused on education reform and digital literacy." }
];

// Load votes
let votes = JSON.parse(localStorage.getItem("votes")) || {};

function saveVotes() {
    localStorage.setItem("votes", JSON.stringify(votes));
}

// Render candidate list
function renderCandidates() {
    const container = document.getElementById("candidates-list");
    container.innerHTML = "";
    candidates.forEach(c => {
        const card = document.createElement("div");
        card.className = "candidate-card";
        card.innerHTML = `
            <h3>${c.name}</h3>
            <p class="candidate-desc">${c.desc}</p>
            <button class="btn" onclick="vote(${c.id})">Vote for ${c.name}</button>
        `;
        container.appendChild(card);
    });
}

// Voting logic
function vote(id) {
    votes[id] = (votes[id] || 0) + 1;
    saveVotes();
    renderResults();
}

// Render results
function renderResults() {
    const results = document.getElementById("results");
    results.innerHTML = "";
    let total = 0;
    candidates.forEach(c => {
        const count = votes[c.id] || 0;
        total += count;
        results.innerHTML += `<div><strong>${c.name}</strong>: ${count} votes</div>`;
    });
    document.getElementById("total-votes").textContent = total;
}

// Clear votes
document.getElementById("clear-votes").onclick = () => {
    votes = {};
    saveVotes();
    renderResults();
};

// Export votes
document.getElementById("export-data").onclick = () => {
    const blob = new Blob([JSON.stringify(votes)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "votes.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
};

// Import votes
document.getElementById("import-data").onclick = () => {
    document.getElementById("import-file").click();
};

document.getElementById("import-file").onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
        votes = JSON.parse(reader.result);
        saveVotes();
        renderResults();
    };
    reader.readAsText(file);
};

// Initialize
renderCandidates();
renderResults();

