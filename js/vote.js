document.addEventListener("DOMContentLoaded", () => {
  const candidates = ["Candidate A", "Candidate B", "Candidate C"];
  const candidatesList = document.getElementById("candidates-list");
  const resultsDiv = document.getElementById("results");
  const totalVotesSpan = document.getElementById("total-votes");

  const modal = document.getElementById("voteModal");
  const modalText = document.getElementById("modalText");
  const confirmVoteBtn = document.getElementById("confirmVote");
  const cancelVoteBtn = document.getElementById("cancelVote");

  let selectedCandidate = null;
  let votes = JSON.parse(localStorage.getItem("votes")) || {};

  function renderCandidates() {
    candidatesList.innerHTML = "";
    candidates.forEach(name => {
      const btn = document.createElement("button");
      btn.textContent = `Vote for ${name}`;
      btn.className = "btn-primary";
      btn.onclick = () => {
        selectedCandidate = name;
        modalText.textContent = `Are you sure you want to vote for ${name}?`;
        modal.style.display = "flex";
      };
      candidatesList.appendChild(btn);
    });
  }

  function renderResults() {
    resultsDiv.innerHTML = "";
    let total = 0;
    candidates.forEach(name => {
      const count = votes[name] || 0;
      total += count;
      const p = document.createElement("p");
      p.textContent = `${name}: ${count} votes`;
      resultsDiv.appendChild(p);
    });
    totalVotesSpan.textContent = total;
  }

  confirmVoteBtn.addEventListener("click", () => {
    if (selectedCandidate) {
      votes[selectedCandidate] = (votes[selectedCandidate] || 0) + 1;
      localStorage.setItem("votes", JSON.stringify(votes));
      renderResults();
      modal.style.display = "none";
    }
  });

  cancelVoteBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("loggedIn");
    window.location.href = "index.html";
  });

  renderCandidates();
  renderResults();
});

