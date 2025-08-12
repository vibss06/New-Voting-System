// Your default candidate list (edit here and push to GitHub to update site)
const candidates = [
    { id: 1, name: "Vibhanshu" },
    { id: 2, name: "Sharayu" },
    { id: 3, name: "XYZ" }
];

// Load votes from localStorage, but not candidate names
let votes = JSON.parse(localStorage.getItem("votes")) || {};

// Function to save votes
function saveVotes() {
    localStorage.setItem("votes", JSON.stringify(votes));
}

// Render candidates
function renderCandidates() {
    const container = document.getElementById("candidates-list");
    container.innerHTML = "";
    candidates.forEach(c => {
        const btn = document.createElement("button");
        btn.textContent = `Vote for ${c.name}`;
        btn.className = "btn";
        btn.onclick = () => {
            votes[c.id] = (votes[c.id] || 0) + 1;
            saveVotes();
            renderResults();
        };
        container.appendChild(btn);
    });
}

// Render results
function renderResults() {
    const results = document.getElementById("results");
    results.innerHTML = "";
    let total = 0;
    candidates.forEach(c => {
        const count = votes[c.id] || 0;
        total += count;
        results.innerHTML += `<div>${c.name}: ${count}</div>`;
    });
    document.getElementById("total-votes").textContent = total;
}

// Clear votes
document.getElementById("clear-votes").onclick = () => {
    votes = {};
    saveVotes();
    renderResults();
};

// Init
renderCandidates();
renderResults();
