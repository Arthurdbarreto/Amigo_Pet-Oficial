// Proteção de rota
const tokenPet = localStorage.getItem('token');
if (!tokenPet) {
  window.location.href = 'login.html';
}

// Elementos
const logoutBtnPet = document.getElementById('logoutBtn');
const addPetBtn = document.getElementById('addPetBtn');
const petFormSection = document.getElementById('petFormSection');
const petFormTitle = document.getElementById('petFormTitle');
const petForm = document.getElementById('petForm');
const closePetFormBtn = document.getElementById('closePetFormBtn');
const cancelPetBtn = document.getElementById('cancelPetBtn');
const petsTableBody = document.getElementById('petsTableBody');
const petTutorSelect = document.getElementById('petTutorId');

let editingPetId = null;
let tutorsCache = [];

// Logout
logoutBtnPet.addEventListener('click', () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = 'login.html';
});

// Abrir formulário
addPetBtn.addEventListener('click', () => {
  editingPetId = null;
  petFormTitle.textContent = 'Adicionar Pet';
  petForm.reset();
  petFormSection.classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Fechar form
function hidePetForm() {
  petFormSection.classList.add('hidden');
  editingPetId = null;
}
closePetFormBtn.addEventListener('click', hidePetForm);
cancelPetBtn.addEventListener('click', hidePetForm);

// Carregar tutores para select
async function loadTutorsToSelect() {
  try {
    const tutors = await getData('tutors');
    tutorsCache = tutors || [];
    petTutorSelect.innerHTML = '<option value="">Selecione o tutor</option>';
    tutorsCache.forEach((t) => {
      const opt = document.createElement('option');
      opt.value = t.id;
      opt.textContent = t.nome;
      petTutorSelect.appendChild(opt);
    });
  } catch (err) {
    console.error(err);
    alert('Erro ao carregar tutores para o select.');
  }
}

// Submit form
petForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = {
    nome: document.getElementById('petNome').value.trim(),
    especie: document.getElementById('petEspecie').value,
    raca: document.getElementById('petRaca').value.trim(),
    sexo: document.getElementById('petSexo').value,
    tutorId: Number(document.getElementById('petTutorId').value),
    // obs não está no model, mas se quiser pode adicionar campo no backend depois
  };

  if (!data.tutorId) {
    alert('Selecione um tutor para o pet.');
    return;
  }

  try {
    if (editingPetId) {
      await putData(`pets/${editingPetId}`, data);
      alert('Pet atualizado com sucesso!');
    } else {
      await postData('pets', data);
      alert('Pet cadastrado com sucesso!');
    }
    hidePetForm();
    await loadPets();
  } catch (err) {
    console.error(err);
    alert('Erro ao salvar pet.');
  }
});

// Carregar lista de pets
async function loadPets() {
  try {
    const pets = await getData('pets');
    renderPets(pets || []);
  } catch (err) {
    console.error(err);
    alert('Erro ao carregar pets.');
  }
}

function renderPets(pets) {
  petsTableBody.innerHTML = '';

  if (!pets.length) {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td colspan="6" class="px-4 py-4 text-center text-gray-500 text-sm">
      Nenhum pet cadastrado ainda.
    </td>`;
    petsTableBody.appendChild(tr);
    return;
  }

  pets.forEach((pet) => {
    const tutor = tutorsCache.find((t) => t.id === pet.tutorId);
    const tutorNome = tutor ? tutor.nome : '—';

    const tr = document.createElement('tr');
    tr.className = 'hover:bg-gray-50';
    tr.innerHTML = `
      <td class="px-4 py-2 text-sm text-gray-800">${pet.nome}</td>
      <td class="px-4 py-2 text-sm text-gray-600">${pet.especie}</td>
      <td class="px-4 py-2 text-sm text-gray-600">${pet.raca || '—'}</td>
      <td class="px-4 py-2 text-sm text-gray-600">${pet.sexo}</td>
      <td class="px-4 py-2 text-sm text-gray-800">${tutorNome}</td>
      <td class="px-4 py-2 text-right text-sm">
        <button
          class="inline-flex items-center px-2 py-1 mr-2 rounded bg-yellow-400 hover:bg-yellow-500 text-white text-xs font-semibold"
          onclick="editPet(${pet.id})"
        >
          ✏️ Editar
        </button>
        <button
          class="inline-flex items-center px-2 py-1 rounded bg-red-500 hover:bg-red-600 text-white text-xs font-semibold"
          onclick="deletePet(${pet.id})"
        >
          🗑️ Excluir
        </button>
      </td>
    `;
    petsTableBody.appendChild(tr);
  });
}

// Editar
window.editPet = async function (id) {
  try {
    const pet = await getData(`pets/${id}`);
    if (!pet) return;

    editingPetId = pet.id;
    petFormTitle.textContent = 'Editar Pet';

    document.getElementById('petNome').value = pet.nome || '';
    document.getElementById('petEspecie').value = pet.especie || '';
    document.getElementById('petRaca').value = pet.raca || '';
    document.getElementById('petSexo').value = pet.sexo || '';
    document.getElementById('petTutorId').value = pet.tutorId || '';

    petFormSection.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (err) {
    console.error(err);
    alert('Erro ao carregar dados do pet.');
  }
};

// Deletar
window.deletePet = async function (id) {
  if (!confirm('Tem certeza que deseja excluir este pet?')) return;
  try {
    await deleteData(`pets/${id}`);
    alert('Pet excluído com sucesso!');
    await loadPets();
  } catch (err) {
    console.error(err);
    alert('Erro ao excluir pet.');
  }
};

// Inicialização
(async function initPets() {
  await loadTutorsToSelect();
  await loadPets();
})();
