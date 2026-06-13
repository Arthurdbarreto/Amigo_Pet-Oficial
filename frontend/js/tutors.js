let editingTutorId = null;

// Verificar autenticação
const token = localStorage.getItem('token');
if (!token) {
  window.location.href = 'login.html';
}

// Elementos do DOM
const addBtn = document.getElementById('addTutorBtn');
const formSection = document.getElementById('tutorForm');
const formEl = document.getElementById('tutorFormEl');
const cancelBtn = document.getElementById('cancelBtn');
const logoutBtn = document.getElementById('logoutBtn');
const tutorsBody = document.getElementById('tutorsBody');
@'
// Event listeners
addBtn.addEventListener('click', showAddForm);
cancelBtn.addEventListener('click', hideForm);
formEl.addEventListener('submit', handleSubmit);
logoutBtn.addEventListener('click', logout);

// Carregar tutores ao iniciar
loadTutors();

function showAddForm() {
  document.getElementById('formTitle').textContent = 'Adicionar Tutor';
  formEl.reset();
  editingTutorId = null;
  formSection.style.display = 'block';
}

function showEditForm(tutor) {
  document.getElementById('formTitle').textContent = 'Editar Tutor';
  document.getElementById('tutorName').value = tutor.name;
  document.getElementById('tutorEmail').value = tutor.email;
  document.getElementById('tutorPhone').value = tutor.phone;
  document.getElementById('tutorCpf').value = tutor.cpf;
  document.getElementById('tutorAddress').value = tutor.address;
  editingTutorId = tutor.id;
  formSection.style.display = 'block';
}

function hideForm() {
  formSection.style.display = 'none';
  editingTutorId = null;
}

async function handleSubmit(e) {
  e.preventDefault();
  
  const tutorData = {
    name: document.getElementById('tutorName').value,
    email: document.getElementById('tutorEmail').value,
    phone: document.getElementById('tutorPhone').value,
    cpf: document.getElementById('tutorCpf').value,
    address: document.getElementById('tutorAddress').value
  };

  try {
    if (editingTutorId) {
      await putData(`tutors/${editingTutorId}`, tutorData);
      alert('Tutor atualizado com sucesso!');
    } else {
      await postData('tutors', tutorData);
      alert('Tutor cadastrado com sucesso!');
    }
    hideForm();
    loadTutors();
  } catch (error) {
    alert('Erro ao salvar tutor: ' + error.message);
  }
}

async function loadTutors() {
  try {
    const tutors = await getData('tutors');
    displayTutors(tutors);
  } catch (error) {
    alert('Erro ao carregar tutores: ' + error.message);
  }
}

function displayTutors(tutors) {
  tutorsBody.innerHTML = '';
  
  tutors.forEach(tutor => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${tutor.name}</td>
      <td>${tutor.email}</td>
      <td>${tutor.phone}</td>
      <td>${tutor.cpf}</td>
      <td class="actions">
        <button onclick="showEditForm(${JSON.stringify(tutor)})" class="btn-edit">✏️</button>
        <button onclick="deleteTutor(${tutor.id})" class="btn-delete">🗑️</button>
      </td>
    `;
    tutorsBody.appendChild(row);
  });
}

async function deleteTutor(id) {
  if (confirm('Tem certeza que deseja excluir este tutor?')) {
    try {
      await deleteData(`tutors/${id}`);
      alert('Tutor excluído com sucesso!');
      loadTutors();
    } catch (error) {
      alert('Erro ao excluir tutor: ' + error.message);
    }
  }
}

function logout() {
  localStorage.removeItem('token');
  window.location.href = 'login.html';
}
