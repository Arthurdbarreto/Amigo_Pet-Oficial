let editingPetId = null;

// Verificar autenticação
const token = localStorage.getItem('token');
if (!token) {
  window.location.href = 'login.html';
}

// Elementos do DOM
const addBtn = document.getElementById('addPetBtn');
const formSection = document.getElementById('petForm');
const formEl = document.getElementById('petFormEl');
const cancelBtn = document.getElementById('cancelBtn');
const logoutBtn = document.getElementById('logoutBtn');
const petsBody = document.getElementById('petsBody');
const tutorSelect = document.getElementById('petTutorId');

// Event listeners
addBtn.addEventListener('click', showAddForm);
cancelBtn.addEventListener('click', hideForm);
formEl.addEventListener('submit', handleSubmit);
logoutBtn.addEventListener('click', logout);

// Carregar dados ao iniciar
loadPets();
loadTutors();

function showAddForm() {
  document.getElementById('formTitle').textContent = 'Adicionar Pet';
  formEl.reset();
  editingPetId = null;
  formSection.style.display = 'block';
}

function showEditForm(pet) {
  document.getElementById('formTitle').textContent = 'Editar Pet';
  document.getElementById('petName').value = pet.name;
  document.getElementById('petSpecies').value = pet.species;
  document.getElementById('petBreed').value = pet.breed;
  document.getElementById('petBirthDate').value = pet.birth_date.split('T')[0];
  document.getElementById('petGender').value = pet.gender;
  document.getElementById('petWeight').value = pet.weight;
  document.getElementById('petTutorId').value = pet.tutor_id;
  document.getElementById('petColor').value = pet.color;
  document.getElementById('petNotes').value = pet.notes || '';
  editingPetId = pet.id;
  formSection.style.display = 'block';
}

function hideForm() {
  formSection.style.display = 'none';
  editingPetId = null;
}

async function handleSubmit(e) {
  e.preventDefault();
  
  const petData = {
    name: document.getElementById('petName').value,
    species: document.getElementById('petSpecies').value,
    breed: document.getElementById('petBreed').value,
    birth_date: document.getElementById('petBirthDate').value,
    gender: document.getElementById('petGender').value,
    weight: document.getElementById('petWeight').value,
    tutor_id: document.getElementById('petTutorId').value,
    color: document.getElementById('petColor').value,
    notes: document.getElementById('petNotes').value
  };

  try {
    if (editingPetId) {
      await putData(`pets/${editingPetId}`, petData);
      alert('Pet atualizado com sucesso!');
    } else {
      await postData('pets', petData);
      alert('Pet cadastrado com sucesso!');
    }
    hideForm();
    loadPets();
  } catch (error) {
    alert('Erro ao salvar pet: ' + error.message);
  }
}

async function loadPets() {
  try {
    const pets = await getData('pets');
    displayPets(pets);
  } catch (error) {
    alert('Erro ao carregar pets: ' + error.message);
  }
}

async function loadTutors() {
  try {
    const tutors = await getData('tutors');
    tutorSelect.innerHTML = '<option value="">Selecione o tutor</option>';
    tutors.forEach(tutor => {
      tutorSelect.innerHTML += `<option value="${
@'
      tutorSelect.innerHTML += `<option value="${tutor.id}">${tutor.name}</option>`;
    });
  } catch (error) {
    console.error('Erro ao carregar tutores:', error);
  }
}

function displayPets(pets) {
  petsBody.innerHTML = '';
  
  pets.forEach(pet => {
    const age = calculateAge(pet.birth_date);
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${pet.name}</td>
      <td>${pet.species}</td>
      <td>${pet.breed}</td>
      <td>${age}</td>
      <td>${pet.tutor_name || 'N/A'}</td>
      <td class="actions">
        <button onclick="showEditForm(${JSON.stringify(pet).replace(/"/g, '&quot;')})" class="btn-edit">✏️</button>
        <button onclick="deletePet(${pet.id})" class="btn-delete">🗑️</button>
      </td>
    `;
    petsBody.appendChild(row);
  });
}

function calculateAge(birthDate) {
  const birth = new Date(birthDate);
  const now = new Date();
  const diffTime = Math.abs(now - birth);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return months > 0 ? `${months} mês(es)` : `${diffDays} dias`;
  } else {
    const years = Math.floor(diffDays / 365);
    return `${years} ano(s)`;
  }
}

async function deletePet(id) {
  if (confirm('Tem certeza que deseja excluir este pet?')) {
    try {
      await deleteData(`pets/${id}`);
      alert('Pet excluído com sucesso!');
      loadPets();
    } catch (error) {
      alert('Erro ao excluir pet: ' + error.message);
    }
  }
}

function logout() {
  localStorage.removeItem('token');
  window.location.href = 'login.html';
}
