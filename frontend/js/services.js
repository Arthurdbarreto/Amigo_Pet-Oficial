document.addEventListener('DOMContentLoaded', () => {
  // Proteção de rota
  const tokenServ = localStorage.getItem('token');
  if (!tokenServ) {
    window.location.href = 'login.html';
    return;
  }

  // Elementos
  const logoutBtnServ = document.getElementById('logoutBtn');
  const addServiceBtn = document.getElementById('addServiceBtn');
  const serviceFormSection = document.getElementById('serviceFormSection');
  const serviceFormTitle = document.getElementById('serviceFormTitle');
  const serviceForm = document.getElementById('serviceForm');
  const closeServiceFormBtn = document.getElementById('closeServiceFormBtn');
  const cancelServiceBtn = document.getElementById('cancelServiceBtn');
  const servicesTableBody = document.getElementById('servicesTableBody');

  let editingServiceId = null;

  // Logout
  logoutBtnServ.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
  });

  // Abrir formulário
  addServiceBtn.addEventListener('click', () => {
    editingServiceId = null;
    serviceFormTitle.textContent = 'Adicionar Serviço';
    serviceForm.reset();
    serviceFormSection.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Fechar formulário
  function hideServiceForm() {
    serviceFormSection.classList.add('hidden');
    editingServiceId = null;
  }
  closeServiceFormBtn.addEventListener('click', hideServiceForm);
  cancelServiceBtn.addEventListener('click', hideServiceForm);

  // Submit formulário
  serviceForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {
      nome: document.getElementById('serviceNome').value.trim(),
      descricao: document.getElementById('serviceDescricao').value.trim(),
      preco: parseFloat(document.getElementById('servicePreco').value)
    };

    if (!data.nome || Number.isNaN(data.preco)) {
      alert('Preencha nome e preço corretamente.');
      return;
    }

    try {
      if (editingServiceId) {
        await putData(`services/${editingServiceId}`, data);
        alert('Serviço atualizado com sucesso!');
      } else {
        await postData('services', data);
        alert('Serviço cadastrado com sucesso!');
      }
      hideServiceForm();
      await loadServices();
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar serviço.');
    }
  });

  // Carregar serviços
  async function loadServices() {
    try {
      const services = await getData('services');
      renderServices(services || []);
    } catch (err) {
      console.error(err);
      alert('Erro ao carregar serviços.');
    }
  }

  function renderServices(services) {
    servicesTableBody.innerHTML = '';

    if (!services.length) {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td colspan="4" class="px-4 py-4 text-center text-gray-500 text-sm">
        Nenhum serviço cadastrado ainda.
      </td>`;
      servicesTableBody.appendChild(tr);
      return;
    }

    services.forEach((svc) => {
      const tr = document.createElement('tr');
      tr.className = 'hover:bg-gray-50';
      tr.innerHTML = `
        <td class="px-4 py-2 text-sm text-gray-800">${svc.nome}</td>
        <td class="px-4 py-2 text-sm text-gray-600 break-words">${svc.descricao || '—'}</td>
        <td class="px-4 py-2 text-sm text-gray-800">R$ ${Number(svc.preco).toFixed(2)}</td>
        <td class="px-4 py-2 text-right text-sm">
          <button
            class="inline-flex items-center px-2 py-1 mr-2 rounded bg-yellow-400 hover:bg-yellow-500 text-white text-xs font-semibold"
            onclick="editService(${svc.id})"
          >
            ✏️ Editar
          </button>
          <button
            class="inline-flex items-center px-2 py-1 rounded bg-red-500 hover:bg-red-600 text-white text-xs font-semibold"
            onclick="deleteService(${svc.id})"
          >
            🗑️ Excluir
          </button>
        </td>
      `;
      servicesTableBody.appendChild(tr);
    });
  }

  // Editar
  window.editService = async function (id) {
    try {
      const svc = await getData(`services/${id}`);
      if (!svc) return;

      editingServiceId = svc.id;
      serviceFormTitle.textContent = 'Editar Serviço';

      document.getElementById('serviceNome').value = svc.nome || '';
      document.getElementById('serviceDescricao').value = svc.descricao || '';
      document.getElementById('servicePreco').value = svc.preco || '';

      serviceFormSection.classList.remove('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      alert('Erro ao carregar dados do serviço.');
    }
  };

  // Deletar
  window.deleteService = async function (id) {
    if (!confirm('Tem certeza que deseja excluir este serviço?')) return;
    try {
      await deleteData(`services/${id}`);
      alert('Serviço excluído com sucesso!');
      await loadServices();
    } catch (err) {
      console.error(err);
      alert('Erro ao excluir serviço.');
    }
  };

  // Inicialização
  loadServices();
});

// Inicialização
loadServices();
