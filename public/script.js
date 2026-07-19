let products = [];
let deleteTargetId = null;

const tableBody = document.getElementById('productTableBody');
const emptyState = document.getElementById('emptyState');
const modalOverlay = document.getElementById('modalOverlay');
const deleteOverlay = document.getElementById('deleteOverlay');
const productForm = document.getElementById('productForm');
const modalTitle = document.getElementById('modalTitle');
const toast = document.getElementById('toast');

// ---------- Auth guard ----------
(async function checkSession() {
  try {
    const res = await fetch('/api/auth/session');
    const data = await res.json();
    if (!data.loggedIn) {
      window.location.href = '/login.html';
    } else {
      document.getElementById('welcomeText').textContent = `Hi, ${data.username}`;
      loadProducts();
    }
  } catch (e) {
    window.location.href = '/login.html';
  }
})();

document.getElementById('logoutBtn').addEventListener('click', async () => {
  await fetch('/api/auth/logout', { method: 'POST' });
  window.location.href = '/login.html';
});

// ---------- Load & render products ----------
async function loadProducts() {
  try {
    const res = await fetch('/api/products');
    const data = await res.json();
    if (data.success) {
      products = data.data;
      renderTable(products);
      updateStats(products);
    }
  } catch (e) {
    showToast('Could not load products.', 'error');
  }
}

function stockBadge(qty) {
  if (qty === 0) return '<span class="badge badge-out">Out of stock</span>';
  if (qty < 10) return '<span class="badge badge-low">Low stock</span>';
  return '<span class="badge badge-in">In stock</span>';
}

function renderTable(list) {
  tableBody.innerHTML = '';
  emptyState.style.display = list.length === 0 ? 'block' : 'none';

  list.forEach(p => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>#${p.id}</td>
      <td>${escapeHtml(p.name)}</td>
      <td>৳${Number(p.price).toFixed(2)}</td>
      <td>${p.quantity}</td>
      <td>${stockBadge(p.quantity)}</td>
      <td class="row-actions">
        <button class="edit-link" onclick="openEditModal(${p.id})">Edit</button>
        <button class="delete-link" onclick="openDeleteModal(${p.id})">Delete</button>
      </td>
    `;
    tableBody.appendChild(tr);
  });
}

function updateStats(list) {
  const total = list.length;
  const units = list.reduce((sum, p) => sum + Number(p.quantity), 0);
  const value = list.reduce((sum, p) => sum + Number(p.price) * Number(p.quantity), 0);
  const low = list.filter(p => p.quantity < 10).length;

  document.getElementById('statTotal').textContent = total;
  document.getElementById('statUnits').textContent = units;
  document.getElementById('statValue').textContent = `৳${value.toLocaleString(undefined, {maximumFractionDigits: 0})}`;
  document.getElementById('statLow').textContent = low;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ---------- Search ----------
document.getElementById('searchInput').addEventListener('input', (e) => {
  const term = e.target.value.toLowerCase();
  const filtered = products.filter(p => p.name.toLowerCase().includes(term));
  renderTable(filtered);
});

// ---------- Add / Edit modal ----------
document.getElementById('addProductBtn').addEventListener('click', () => {
  modalTitle.textContent = 'Add Product';
  productForm.reset();
  document.getElementById('productId').value = '';
  modalOverlay.classList.add('active');
});

window.openEditModal = function (id) {
  const p = products.find(p => p.id === id);
  if (!p) return;
  modalTitle.textContent = 'Edit Product';
  document.getElementById('productId').value = p.id;
  document.getElementById('name').value = p.name;
  document.getElementById('price').value = p.price;
  document.getElementById('quantity').value = p.quantity;
  modalOverlay.classList.add('active');
};

document.getElementById('cancelBtn').addEventListener('click', () => {
  modalOverlay.classList.remove('active');
});

productForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('productId').value;
  const payload = {
    name: document.getElementById('name').value.trim(),
    price: parseFloat(document.getElementById('price').value),
    quantity: parseInt(document.getElementById('quantity').value, 10)
  };

  try {
    const res = await fetch(id ? `/api/products/${id}` : '/api/products', {
      method: id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (data.success) {
      modalOverlay.classList.remove('active');
      showToast(id ? 'Product updated.' : 'Product added.', 'success');
      loadProducts();
    } else {
      showToast(data.message || 'Something went wrong.', 'error');
    }
  } catch (e) {
    showToast('Could not save the product.', 'error');
  }
});

// ---------- Delete modal ----------
window.openDeleteModal = function (id) {
  deleteTargetId = id;
  deleteOverlay.classList.add('active');
};

document.getElementById('cancelDeleteBtn').addEventListener('click', () => {
  deleteOverlay.classList.remove('active');
  deleteTargetId = null;
});

document.getElementById('confirmDeleteBtn').addEventListener('click', async () => {
  if (!deleteTargetId) return;
  try {
    const res = await fetch(`/api/products/${deleteTargetId}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) {
      showToast('Product deleted.', 'success');
      loadProducts();
    } else {
      showToast(data.message || 'Could not delete product.', 'error');
    }
  } catch (e) {
    showToast('Could not delete product.', 'error');
  } finally {
    deleteOverlay.classList.remove('active');
    deleteTargetId = null;
  }
});

// ---------- Toast ----------
function showToast(message, type = 'success') {
  toast.textContent = message;
  toast.className = `toast show ${type}`;
  setTimeout(() => { toast.className = 'toast'; }, 2500);
}
