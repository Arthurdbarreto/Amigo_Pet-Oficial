let editingProductId = null;

// Verificar autenticação
const token = localStorage.getItem('token');
if (!token) {
  window.location.href = 'login.html';
@'
}

// Elementos do DOM
const addBtn = document.getElementById('addProductBtn');
const formSection = document.getElementById('productForm');
const formEl = document.getElementById('productFormEl');
const cancelBtn = document.getElementById('cancelBtn');
const logoutBtn = document.getElementById('logoutBtn');
const productsBody = document.getElementById('productsBody');

// Event listeners
addBtn.addEventListener('click', showAddForm);
cancelBtn.addEventListener('click', hideForm);
formEl.addEventListener('submit', handleSubmit);
logoutBtn.addEventListener('click', logout);

// Carregar dados ao iniciar
loadProducts();

function showAddForm() {
  document.getElementById('formTitle').textContent = 'Adicionar Produto';
  formEl.reset();
  document.getElementById('productActive').checked = true;
  editingProductId = null;
  formSection.style.display = 'block';
}

function showEditForm(product) {
  document.getElementById('formTitle').textContent = 'Editar Produto';
  document.getElementById('productName').value = product.name;
  document.getElementById('productCategory').value = product.category;
  document.getElementById('productPrice').value = product.price;
  document.getElementById('productStock').value = product.stock;
  document.getElementById('productBrand').value = product.brand || '';
  document.getElementById('productBarcode').value = product.barcode || '';
  document.getElementById('productDescription').value = product.description || '';
  document.getElementById('productActive').checked = product.active;
  editingProductId = product.id;
  formSection.style.display = 'block';
}

function hideForm() {
  formSection.style.display = 'none';
  editingProductId = null;
}

async function handleSubmit(e) {
  e.preventDefault();
  
  const productData = {
    name: document.getElementById('productName').value,
    category: document.getElementById('productCategory').value,
    price: parseFloat(document.getElementById('productPrice').value),
    stock: parseInt(document.getElementById('productStock').value),
    brand: document.getElementById('productBrand').value,
    barcode: document.getElementById('productBarcode').value,
    description: document.getElementById('productDescription').value,
    active: document.getElementById('productActive').checked
  };

  try {
    if (editingProductId) {
      await putData(`products/${editingProductId}`, productData);
      alert('Produto atualizado com sucesso!');
    } else {
      await postData('products', productData);
      alert('Produto cadastrado com sucesso!');
    }
    hideForm();
    loadProducts();
  } catch (error) {
    alert('Erro ao salvar produto: ' + error.message);
  }
}

async function loadProducts() {
  try {
    const products = await getData('products');
    displayProducts(products);
  } catch (error) {
    alert('Erro ao carregar produtos: ' + error.message);
  }
}

function displayProducts(products) {
  productsBody.innerHTML = '';
  
  products.forEach(product => {
    const row = document.createElement('tr');
    const stockClass = product.stock < 5 ? 'low-stock' : 'normal-stock';
    row.innerHTML = `
      <td>${product.name}</td>
      <td>${product.category}</td>
      <td>${product.brand || '-'}</td>
      <td>R$ ${product.price.toFixed(2)}</td>
      <td class="${stockClass}">${product.stock} un</td>
      <td>
        <span class="status ${product.active ? 'active' : 'inactive'}">
          ${product.active ? 'Ativo' : 'Inativo'}
        </span>
      </td>
      <td class="actions">
        <button onclick="showEditForm(${JSON.stringify(product).replace(/"/g, '&quot;')})" class="btn-edit">✏️</button>
        <button onclick="deleteProduct(${product.id})" class="btn-
@'
      <td class="actions">
        <button onclick="showEditForm(${JSON.stringify(product).replace(/"/g, '&quot;')})" class="btn-edit">✏️</button>
        <button onclick="deleteProduct(${product.id})" class="btn-delete">🗑️</button>
      </td>
    `;
    productsBody.appendChild(row);
  });
}

async function deleteProduct(id) {
  if (confirm('Tem certeza que deseja excluir este produto?')) {
    try {
      await deleteData(`products/${id}`);
      alert('Produto excluído com sucesso!');
      loadProducts();
    } catch (error) {
      alert('Erro ao excluir produto: ' + error.message);
    }
  }
}

function logout() {
  localStorage.removeItem('token');
  window.location.href = 'login.html';
}
