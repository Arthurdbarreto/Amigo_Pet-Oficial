// Proteção de rota
const tokenProd = localStorage.getItem('token');
if (!tokenProd) {
  window.location.href = 'login.html';
}

// Elementos
const logoutBtnProd = document.getElementById('logoutBtn');
const addProductBtn = document.getElementById('addProductBtn');
const productFormSection = document.getElementById('productFormSection');
const productFormTitle = document.getElementById('productFormTitle');
const productForm = document.getElementById('productForm');
const closeProductFormBtn = document.getElementById('closeProductFormBtn');
const cancelProductBtn = document.getElementById('cancelProductBtn');
const productsTableBody = document.getElementById('productsTableBody');

let editingProductId = null;

// Logout
logoutBtnProd.addEventListener('click', () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = 'login.html';
});

// Abrir formulário
addProductBtn.addEventListener('click', () => {
  editingProductId = null;
  productFormTitle.textContent = 'Adicionar Produto';
  productForm.reset();
  productFormSection.classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Fechar formulário
function hideProductForm() {
  productFormSection.classList.add('hidden');
  editingProductId = null;
}
closeProductFormBtn.addEventListener('click', hideProductForm);
cancelProductBtn.addEventListener('click', hideProductForm);

// Enviar formulário
productForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = {
    nome: document.getElementById('productNome').value.trim(),
    descricao: document.getElementById('productDescricao').value.trim(),
    preco: parseFloat(document.getElementById('productPreco').value),
    estoque: parseInt(document.getElementById('productEstoque').value, 10)
  };

  if (Number.isNaN(data.preco) || Number.isNaN(data.estoque)) {
    alert('Preço e estoque devem ser numéricos.');
    return;
  }

  try {
    if (editingProductId) {
      await putData(`products/${editingProductId}`, data);
      alert('Produto atualizado com sucesso!');
    } else {
      await postData('products', data);
      alert('Produto cadastrado com sucesso!');
    }
    hideProductForm();
    await loadProducts();
  } catch (err) {
    console.error(err);
    alert('Erro ao salvar produto.');
  }
});

// Carregar produtos
async function loadProducts() {
  try {
    const products = await getData('products');
    renderProducts(products || []);
  } catch (err) {
    console.error(err);
    alert('Erro ao carregar produtos.');
  }
}

function renderProducts(products) {
  productsTableBody.innerHTML = '';

  if (!products.length) {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td colspan="5" class="px-4 py-4 text-center text-gray-500 text-sm">
      Nenhum produto cadastrado ainda.
    </td>`;
    productsTableBody.appendChild(tr);
    return;
  }

  products.forEach((prod) => {
    const estoqueClass =
      prod.estoque <= 0
        ? 'text-red-600 font-bold'
        : prod.estoque < 5
        ? 'text-yellow-600 font-semibold'
        : 'text-green-700';

    const tr = document.createElement('tr');
    tr.className = 'hover:bg-gray-50';
    tr.innerHTML = `
      <td class="px-4 py-2 text-sm text-gray-800">${prod.nome}</td>
      <td class="px-4 py-2 text-sm text-gray-600">${/*categoria não está no model, usamos descrição como info extra*/ ''}</td>
      <td class="px-4 py-2 text-sm text-gray-800">R$ ${Number(prod.preco).toFixed(2)}</td>
      <td class="px-4 py-2 text-sm ${estoqueClass}">${prod.estoque}</td>
      <td class="px-4 py-2 text-right text-sm">
        <button
          class="inline-flex items-center px-2 py-1 mr-2 rounded bg-yellow-400 hover:bg-yellow-500 text-white text-xs font-semibold"
          onclick="editProduct(${prod.id})"
        >
          ✏️ Editar
        </button>
        <button
          class="inline-flex items-center px-2 py-1 rounded bg-red-500 hover:bg-red-600 text-white text-xs font-semibold"
          onclick="deleteProduct(${prod.id})"
        >
          🗑️ Excluir
        </button>
      </td>
    `;
    productsTableBody.appendChild(tr);
  });
}

// Editar
window.editProduct = async function (id) {
  try {
    const prod = await getData(`products/${id}`);
    if (!prod) return;

    editingProductId = prod.id;
    productFormTitle.textContent = 'Editar Produto';

    document.getElementById('productNome').value = prod.nome || '';
    document.getElementById('productDescricao').value = prod.descricao || '';
    document.getElementById('productPreco').value = prod.preco || '';
    document.getElementById('productEstoque').value = prod.estoque || '';

    productFormSection.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (err) {
    console.error(err);
    alert('Erro ao carregar dados do produto.');
  }
};

// Deletar
window.deleteProduct = async function (id) {
  if (!confirm('Tem certeza que deseja excluir este produto?')) return;
  try {
    await deleteData(`products/${id}`);
    alert('Produto excluído com sucesso!');
    await loadProducts();
  } catch (err) {
    console.error(err);
    alert('Erro ao excluir produto.');
  }
};

// Inicialização
loadProducts();
