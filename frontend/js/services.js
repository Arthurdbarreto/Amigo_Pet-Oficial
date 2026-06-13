let editingServiceId = null;

// Verificar autenticação
const token = localStorage.getItem('token');
if (!token) {
  window.location.href = 'login.html';
}

// Elementos do DOM
const addBtn = document.getElementById('addServiceBtn');
const formSection = document.getElementById('serviceForm');
const formEl = document.getElementById('serviceFormEl');
const cancelBtn = document.getElementById('cancelBtn');
const logoutBtn = document.getElementById('logoutBtn');
const servicesBody = document.getElementById('servicesBody');

// Event listeners
addBtn.addEventListener('click', showAddForm);
cancelBtn.addEventListener('click', hideForm);
formEl.addEventListener('submit', handleSubmit);
logoutBtn.addEventListener('click', logout);

// Carregar dados ao iniciar
loadServices();

function showAddForm() {
  document.getElementById('formTitle').textContent = 'Adicionar Serviço';
  formEl.reset();
  document.getElementById('serviceActive').checked = true;
  editingServiceId = null;
  formSection.style.display = 'block';
}

function showEditForm(service) {
  document.getElementById('formTitle').textContent = 'Editar Serviço';
  document.getElementById('serviceName').value = service.name;
  document.getElementById('serviceCategory').value
@'
  document.getElementById('serviceCategory').value = service.category;
  document.getElementById('servicePrice').value = service.price;
  document.getElementById('serviceDuration').value = service.duration;
  document.getElementById('serviceDescription').value = service.description || '';
  document.getElementById('serviceActive').checked = service.active;
  editingServiceId = service.id;
  formSection.style.display = 'block';
}

function hideForm() {
  formSection.style.display = 'none';
  editingServiceId = null;
}

async function handleSubmit(e) {
  e.preventDefault();
  
  const serviceData = {
    name: document.getElementById('serviceName').value,
    category: document.getElementById('serviceCategory').value,
    price: parseFloat(document.getElementById('servicePrice').value),
    duration: parseInt(document.getElementById('serviceDuration').value),
    description: document.getElementById('serviceDescription').value,
    active: document.getElementById('serviceActive').checked
  };

  try {
    if (editingServiceId) {
      await putData(`services/${editingServiceId}`, serviceData);
      alert('Serviço atualizado com sucesso!');
    } else {
      await postData('services', serviceData);
      alert('Serviço cadastrado com sucesso!');
    }
    hideForm();
    loadServices();
  } catch (error) {
    alert('Erro ao salvar serviço: ' + error.message);
  }
}

async function loadServices() {
  try {
    const services = await getData('services');
    displayServices(services);
  } catch (error) {
    alert('Erro ao carregar serviços: ' + error.message);
  }
}

function displayServices(services) {
  servicesBody.innerHTML = '';
  
  services.forEach(service => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${service.name}</td>
      <td>${service.category}</td>
      <td>R$ ${service.price.toFixed(2)}</td>
      <td>${service.duration} min</td>
      <td>
        <span class="status ${service.active ? 'active' : 'inactive'}">
          ${service.active ? 'Ativo' : 'Inativo'}
        </span>
      </td>
      <td class="actions">
        <button onclick="showEditForm(${JSON.stringify(service).replace(/"/g, '&quot;')})" class="btn-edit">✏️</button>
        <button onclick="deleteService(${service.id})" class="btn-delete">🗑️</button>
      </td>
    `;
    servicesBody.appendChild(row);
  });
}

async function deleteService(id) {
  if (confirm('Tem certeza que deseja excluir este serviço?')) {
    try {
      await deleteData(`services/${id}`);
      alert('Serviço excluído com sucesso!');
      loadServices();
    } catch (error) {
      alert('Erro ao excluir serviço: ' + error.message);
    }
  }
}

function logout() {
  localStorage.removeItem('token');
  window.location.href = 'login.html';
}
