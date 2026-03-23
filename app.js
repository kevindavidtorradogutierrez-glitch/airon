let currentTab = 'posts';

// ── Tab switching ──────────────────────────────────────────
function switchTab(tab) {
  currentTab = tab;
  document.querySelectorAll('.tab').forEach((t, i) => {
    t.classList.toggle('active',
      (i === 0 && tab === 'posts') || (i === 1 && tab === 'users')
    );
  });
  loadCurrent();
}

function loadCurrent() {
  currentTab === 'posts' ? loadPosts() : loadUsers();
}

// ── Fetch Posts ────────────────────────────────────────────
async function loadPosts() {
  showLoader();
  try {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts');
    if (!res.ok) throw new Error('Error HTTP: ' + res.status);
    const posts = await res.json();
    renderPosts(posts);
  } catch (e) {
    showError(e.message);
  }
}

// ── Fetch Users ────────────────────────────────────────────
async function loadUsers() {
  showLoader();
  try {
    const res = await fetch('https://jsonplaceholder.typicode.com/users');
    if (!res.ok) throw new Error('Error HTTP: ' + res.status);
    const users = await res.json();
    renderUsers(users);
  } catch (e) {
    showError(e.message);
  }
}

// ── Render Posts ───────────────────────────────────────────
function renderPosts(posts) {
  const main = document.getElementById('main-content');
  main.innerHTML = `
    <p class="section-title">Posts</p>
    <div class="count-chip"><b>${posts.length}</b> resultados</div>
    <div class="cards-list">
      ${posts.map((p, i) => `
        <div class="card" style="animation-delay:${Math.min(i * 0.04, 0.6)}s"
             onclick='showModal("POST #${p.id}","${esc(p.title)}","${esc(p.body)}")'>
          <div class="card-num">POST #${p.id}</div>
          <div class="card-title">${esc(p.title)}</div>
          <div class="card-body">${esc(p.body)}</div>
        </div>`).join('')}
    </div>`;
}

// ── Render Users ───────────────────────────────────────────
function renderUsers(users) {
  const main = document.getElementById('main-content');
  main.innerHTML = `
    <p class="section-title">Usuarios</p>
    <div class="count-chip"><b>${users.length}</b> resultados</div>
    <div class="cards-list">
      ${users.map((u, i) => `
        <div class="user-card" style="animation-delay:${i * 0.06}s">
          <div class="avatar">${u.name.charAt(0)}</div>
          <div class="user-info">
            <div class="user-name">${esc(u.name)}</div>
            <div class="user-email">${esc(u.email)}</div>
            <div class="user-company">@ ${esc(u.company.name)}</div>
          </div>
        </div>`).join('')}
    </div>`;
}

// ── UI helpers ─────────────────────────────────────────────
function showLoader() {
  document.getElementById('main-content').innerHTML =
    '<div class="loader"><div class="spinner"></div>Cargando datos…</div>';
}

function showError(msg) {
  document.getElementById('main-content').innerHTML =
    `<div class="error-box">⚠️ Error al cargar<br><small>${msg}</small></div>`;
}

// ── Modal ──────────────────────────────────────────────────
function showModal(label, title, body) {
  document.getElementById('modal-id').textContent = label;
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-body').textContent = body;
  document.getElementById('modal').classList.add('open');
}

function closeModal(e) {
  if (e.target.id === 'modal') closeModalDirect();
}

function closeModalDirect() {
  document.getElementById('modal').classList.remove('open');
}

// ── Sanitize HTML ──────────────────────────────────────────
function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ── Init ───────────────────────────────────────────────────
loadPosts();