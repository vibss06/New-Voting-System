const candidates = [
  { id: 'c1', name: 'Abhay Kumar', description: 'Focus on education & community programs' },
  { id: 'c2', name: 'Sharayu Singh', description: 'Tech-forward, infrastructure & jobs' },
  { id: 'c3', name: 'Vibhanshu  Patel', description: 'Environment, healthcare, transparency' }
];

const STORAGE_KEY = 'voting_demo_votes_v2';

function loadVotes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveVotes(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

const listEl = document.getElementById('candidates-list');
const resultsEl = document.getElementById('results');
const totalVotesEl = document.getElementById('total-votes');

function renderCandidates() {
  const votes = loadVotes();
  listEl.innerHTML = '';
  candidates.forEach(c => {
    const count = votes[c.id] || 0;
    const item = document.createElement('div');
    item.className = 'candidate';

    const thumb = document.createElement('div');
    thumb.className = 'cand-thumb';
    thumb.textContent = c.name.split(' ').map(s => s[0]).slice(0, 2).join('');

    const meta = document.createElement('div');
    meta.className = 'cand-meta';
    meta.innerHTML = `<p class="cand-name">${c.name}</p><p class="cand-desc">${c.description}</p>`;

    const action = document.createElement('div');
    const btn = document.createElement('button');
    btn.className = 'btn btn-primary';
    btn.textContent = 'Vote';
    btn.onclick = () => { castVote(c.id); };

    const badge = document.createElement('div');
    badge.className = 'small';
    badge.style.marginLeft = '12px';
    badge.textContent = `${count} votes`;

    action.appendChild(btn);
    action.appendChild(badge);

    item.appendChild(thumb);
    item.appendChild(meta);
    item.appendChild(action);
    listEl.appendChild(item);
  });
}

function castVote(candidateId) {
  const votes = loadVotes();
  votes[candidateId] = (votes[candidateId] || 0) + 1;
  saveVotes(votes);
  renderCandidates();
  renderResults();
  toast('✅ Vote counted — thank you!');
}

function renderResults() {
  const votes = loadVotes();
  const total = Object.values(votes).reduce((a, b) => a + (b || 0), 0);
  resultsEl.innerHTML = '';
  totalVotesEl.textContent = total;

  candidates.forEach(c => {
    const count = votes[c.id] || 0;
    const pct = total > 0 ? Math.round((count / total) * 100) : 0;

    const wrapper = document.createElement('div');
    const top = document.createElement('div');
    top.style.display = 'flex';
    top.style.justifyContent = 'space-between';
    top.innerHTML = `<div>${c.name}</div><div class="small">${pct}%</div>`;

    const bar = document.createElement('div');
    bar.className = 'bar';
    const inner = document.createElement('div');
    inner.className = 'bar-inner';
    inner.style.width = pct + '%';
    bar.appendChild(inner);

    wrapper.appendChild(top);
    wrapper.appendChild(bar);
    resultsEl.appendChild(wrapper);
  });
}

function toast(msg) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 1500);
}

document.getElementById('clear-votes').addEventListener('click', () => {
  if (!confirm('Clear all saved votes in this browser?')) return;
  localStorage.removeItem(STORAGE_KEY);
  renderCandidates();
  renderResults();
});

document.getElementById('export-data').addEventListener('click', () => {
  const data = loadVotes();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'votes.json';
  a.click();
  URL.revokeObjectURL(url);
});

const importFile = document.getElementById('import-file');
document.getElementById('import-data').addEventListener('click', () => importFile.click());
importFile.addEventListener('change', async (ev) => {
  const f = ev.target.files[0];
  if (!f) return;
  try {
    const txt = await f.text();
    const parsed = JSON.parse(txt);
    if (confirm('Replace current voting data with imported data?')) {
      saveVotes(parsed);
      renderCandidates();
      renderResults();
      toast('📂 Imported votes');
    }
  } catch {
    alert('Invalid file format');
  }
  importFile.value = '';
});

renderCandidates();
renderResults();
