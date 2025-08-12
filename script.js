// ===== CONFIG: edit candidate list here =====
const candidates = [
  { id: 'c1', name: 'Alice Kumar', description: 'Focus on education & community programs' },
  { id: 'c2', name: 'Rahul Singh', description: 'Tech-forward, infrastructure & jobs' },
  { id: 'c3', name: 'Neha Patel', description: 'Environment, healthcare, transparency' }
];
// ============================================

// Storage key
const STORAGE_KEY = 'voting_demo_votes_v1';

// load votes from localStorage
function loadVotes(){
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {}
  } catch(e){
    console.error(e);
    return {}
  }
}

function saveVotes(data){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// initialize UI
const listEl = document.getElementById('candidates-list');
const resultsEl = document.getElementById('results');
const totalVotesEl = document.getElementById('total-votes');

function renderCandidates(){
  const votes = loadVotes();
  listEl.innerHTML = '';
  candidates.forEach(c => {
    const count = votes[c.id] || 0;
    const item = document.createElement('div'); item.className = 'candidate';

    const thumb = document.createElement('div'); thumb.className = 'cand-thumb';
    thumb.textContent = c.name.split(' ').map(s=>s[0]).slice(0,2).join('');

    const meta = document.createElement('div'); meta.className = 'cand-meta';
    const name = document.createElement('p'); name.className = 'cand-name'; name.textContent = c.name;
    const desc = document.createElement('p'); desc.className = 'cand-desc'; desc.textContent = c.description;

    meta.appendChild(name); meta.appendChild(desc);

    const action = document.createElement('div');
    const btn = document.createElement('button'); btn.className = 'btn btn-primary'; btn.textContent = 'Vote';
    btn.onclick = ()=>{ castVote(c.id); };

    const badge = document.createElement('div'); badge.style.marginLeft='12px';
    badge.style.fontSize='13px'; badge.style.color='var(--muted)'; badge.textContent = `${count} votes`;

    action.appendChild(btn); action.appendChild(badge);

    item.appendChild(thumb); item.appendChild(meta); item.appendChild(action);
    listEl.appendChild(item);
  });
}

function castVote(candidateId){
  const votes = loadVotes();
  votes[candidateId] = (votes[candidateId] || 0) + 1;
  saveVotes(votes);
  renderCandidates(); renderResults();
  toast('Vote counted — thank you!');
}

function renderResults(){
  const votes = loadVotes();
  const total = Object.values(votes).reduce((a,b)=>a+(b||0),0);
  resultsEl.innerHTML = '';
  totalVotesEl.textContent = total;

  candidates.forEach(c=>{
    const count = votes[c.id]||0;
    const wrapper = document.createElement('div');
    wrapper.style.display='flex'; wrapper.style.flexDirection='column';

    const top = document.createElement('div');
    top.style.display='flex'; top.style.justifyContent='space-between'; top.style.marginBottom='6px';
    const label = document.createElement('div'); label.textContent = c.name;
    const pct = document.createElement('div'); pct.textContent = total>0 ? Math.round(count/total*100)+'%' : '0%';
    pct.className='small';
    top.appendChild(label); top.appendChild(pct);

    const bar = document.createElement('div'); bar.className='bar';
    const inner = document.createElement('div'); inner.className='bar-inner';
    const width = total > 0 ? (count/total*100) : 0; inner.style.width = width + '%';
    bar.appendChild(inner);

    wrapper.appendChild(top); wrapper.appendChild(bar);
    resultsEl.appendChild(wrapper);
  });
}

// Small toast message
function toast(text){
  const t = document.createElement('div');
  t.textContent = text;
  t.style.position='fixed';
  t.style.left='50%';
  t.style.transform='translateX(-50%)';
  t.style.bottom='28px';
  t.style.padding='10px 14px';
  t.style.borderRadius='10px';
  t.style.background='rgba(2,6,23,0.85)';
  t.style.boxShadow='0 6px 20px rgba(2,6,23,0.6)';
  document.body.appendChild(t);
  setTimeout(()=>{ t.style.transition='all 300ms'; t.style.opacity='0'; t.style.transform='translateX(-50%) translateY(6px)'; }, 1200);
  setTimeout(()=>t.remove(),1500);
}

// Clear votes
document.getElementById('clear-votes').addEventListener('click', ()=>{
  if(!confirm('Clear all saved votes in this browser? This cannot be undone.')) return;
  localStorage.removeItem(STORAGE_KEY);
  renderCandidates(); renderResults();
});

// Export votes
document.getElementById('export-data').addEventListener('click', ()=>{
  const data = loadVotes();
  const blob = new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'votes.json';
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
});

// Import votes
const importFile = document.getElementById('import-file');
document.getElementById('import-data').addEventListener('click', ()=> importFile.click());
importFile.addEventListener('change', async (ev)=>{
  const f = ev.target.files[0]; if(!f) return;
  try{
    const txt = await f.text(); const parsed = JSON.parse(txt);
    if(confirm('Replace current voting data with imported data?')){
      saveVotes(parsed); renderCandidates(); renderResults();
      toast('Imported votes');
    }
  }catch(e){ alert('Invalid file'); }
  importFile.value='';
});

// Initial render
renderCandidates(); renderResults();
