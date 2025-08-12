// === Candidate List ===
// Edit this list to update names & descriptions.
// When you push changes to GitHub, your site updates automatically.

const candidates = [
    { id: 1, name: "Alice Johnson", desc: "Passionate about community development and youth programs." },
    { id: 2, name: "Bob Smith", desc: "Advocates for clean energy and better public transport." },
    { id: 3, name: "Charlie Lee", desc: "Focused on education reform and digital literacy." }
];

// === Voting Logic ===
let votes = JSON.parse(localStorage.getItem('votes')) || {};

function saveVotes() {
    localStorage.setItem('votes', JSON.stringify(votes));
    renderResults();
}

function vote(candidateId) {
    votes[candidateId] = (votes[candidateId] || 0) + 1;
    saveVotes();
}

function renderCandidates() {
    const list = document.getElementById('candidates-list');
    list.innerHTML = '';
    candidates.forEach(c => {
        const card = document.createElement('div');
        card.className = 'candidate-card';
        card.innerHTML = `
            <div class="candidate-name">${c.name}</div>
            <div class="candidate-desc">${c.desc}</div>
            <button class="btn" onclick="vote(${c.id})">Vote for ${c.name}</button>
        `;
        list.appendChild(card);
    });
}

function renderResults() {
    const resultsDiv = document.getElementById('results');
    let total = 0;
    resultsDiv.innerHTML = candidates.map(c => {
        const count = votes[c.id] || 0;
        total += count;
        return `<div>${c.name}: ${count} votes</div>`;
    }).join('');
    document.getElementById('total-votes').textContent = total;
}

// === Export / Import / Clear ===
document.getElementById('clear-votes').onclick = () => {
    votes = {};
    saveVotes();
};

document.getElementById('export-data').onclick = () => {
    const data = JSON.stringify(votes, null, 2);
    const blob = new Blob([data], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'votes.json';
    a.click();
};

document.getElementById('import-data').onclick = () => {
    document.getElementById('import-file').click();
};

document.getElementById('import-file').onchange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
        votes = JSON.parse(reader.result);
        saveVotes();
    };
    reader.readAsText(file);
};

// === Init ===
renderCandidates();
renderResults();


