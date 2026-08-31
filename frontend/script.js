const API_URL = '/api/bookmarks';

const grid = document.getElementById('bookmarkGrid');
const emptyState = document.getElementById('emptyState');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const addBtn = document.getElementById('addBtn');

const modalOverlay = document.getElementById('modalOverlay');
const modalTitle = document.getElementById('modalTitle');
const bookmarkForm = document.getElementById('bookmarkForm');
const cancelBtn = document.getElementById('cancelBtn');

const bookmarkIdInput = document.getElementById('bookmarkId');
const titleInput = document.getElementById('title');
const urlInput = document.getElementById('url');
const categoryInput = document.getElementById('category');
const descriptionInput = document.getElementById('description');
const isFavoriteInput = document.getElementById('isFavorite');

let allBookmarks = [];

// ---------- API helpers ----------
async function fetchBookmarks() {
  const params = new URLSearchParams();
  if (searchInput.value.trim()) params.set('search', searchInput.value.trim());
  if (categoryFilter.value && categoryFilter.value !== 'All') params.set('category', categoryFilter.value);

  const res = await fetch(`${API_URL}?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch bookmarks');
  return res.json();
}

async function createBookmark(data) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create bookmark');
  return res.json();
}

async function updateBookmark(id, data) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update bookmark');
  return res.json();
}

async function deleteBookmark(id) {
  const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete bookmark');
  return res.json();
}

// ---------- Rendering ----------
function renderBookmarks(bookmarks) {
  grid.innerHTML = '';
  emptyState.hidden = bookmarks.length !== 0;

  bookmarks.forEach((bm) => {
    const card = document.createElement('div');
    card.className = 'bookmark-card';
    card.innerHTML = `
      <span class="favorite-star" data-id="${bm._id}" title="Toggle favorite">
        ${bm.isFavorite ? '⭐' : '☆'}
      </span>
      <span class="tag">${escapeHtml(bm.category || 'General')}</span>
      <h3>${escapeHtml(bm.title)}</h3>
      <a href="${escapeHtml(bm.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(bm.url)}</a>
      ${bm.description ? `<p class="desc">${escapeHtml(bm.description)}</p>` : ''}
      <div class="card-actions">
        <button class="edit-btn" data-id="${bm._id}">Edit</button>
        <button class="delete-btn" data-id="${bm._id}">Delete</button>
      </div>
    `;
    grid.appendChild(card);
  });
}

function updateCategoryOptions(bookmarks) {
  const current = categoryFilter.value;
  const categories = Array.from(new Set(bookmarks.map((b) => b.category || 'General')));
  categoryFilter.innerHTML = '<option value="All">All Categories</option>';
  categories.forEach((cat) => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    categoryFilter.appendChild(opt);
  });
  if (categories.includes(current)) categoryFilter.value = current;
}

function escapeHtml(str = '') {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ---------- Refresh cycle ----------
async function refresh() {
  try {
    allBookmarks = await fetchBookmarks();
    renderBookmarks(allBookmarks);
    updateCategoryOptions(allBookmarks);
  } catch (err) {
    console.error(err);
    grid.innerHTML = `<p style="color:#ef4444">Could not load bookmarks. Is the server running?</p>`;
  }
}

// ---------- Modal handling ----------
function openModal(bookmark = null) {
  bookmarkForm.reset();
  if (bookmark) {
    modalTitle.textContent = 'Edit Bookmark';
    bookmarkIdInput.value = bookmark._id;
    titleInput.value = bookmark.title;
    urlInput.value = bookmark.url;
    categoryInput.value = bookmark.category || '';
    descriptionInput.value = bookmark.description || '';
    isFavoriteInput.checked = !!bookmark.isFavorite;
  } else {
    modalTitle.textContent = 'Add Bookmark';
    bookmarkIdInput.value = '';
  }
  modalOverlay.hidden = false;
}

function closeModal() {
  modalOverlay.hidden = true;
}

// ---------- Event listeners ----------
addBtn.addEventListener('click', () => openModal());
cancelBtn.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});

bookmarkForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = {
    title: titleInput.value.trim(),
    url: urlInput.value.trim(),
    category: categoryInput.value.trim() || 'General',
    description: descriptionInput.value.trim(),
    isFavorite: isFavoriteInput.checked,
  };

  try {
    if (bookmarkIdInput.value) {
      await updateBookmark(bookmarkIdInput.value, data);
    } else {
      await createBookmark(data);
    }
    closeModal();
    await refresh();
  } catch (err) {
    alert(err.message);
  }
});

grid.addEventListener('click', async (e) => {
  const id = e.target.dataset.id;
  if (!id) return;

  if (e.target.classList.contains('edit-btn')) {
    const bookmark = allBookmarks.find((b) => b._id === id);
    openModal(bookmark);
  }

  if (e.target.classList.contains('delete-btn')) {
    if (confirm('Delete this bookmark?')) {
      await deleteBookmark(id);
      await refresh();
    }
  }

  if (e.target.classList.contains('favorite-star')) {
    const bookmark = allBookmarks.find((b) => b._id === id);
    await updateBookmark(id, { ...bookmark, isFavorite: !bookmark.isFavorite });
    await refresh();
  }
});

searchInput.addEventListener('input', debounce(refresh, 300));
categoryFilter.addEventListener('change', refresh);

function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// ---------- Init ----------
refresh();
