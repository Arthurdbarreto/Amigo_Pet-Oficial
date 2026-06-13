// Proteção de rota
const token = localStorage.getItem('token');
if (!token) {
  window.location.href = 'login.html';
}

// Elementos
const logoutBtn = document.getElementById('logoutBtn');
const addTutorBtn = document.getElementById('addTutorBtn');
const tutorFormSection = document.getElementById('tutorFormSection');
const tutorFormTitle = document.getElementById('tutorFormTitle');
const tutorForm = document.getElementById('tutorForm');
const closeFormBtn = document.getElementById('closeFormBtn');
const cancelTutorBtn = document.getElementById('cancelTutorBtn');
const tutorsTableBody = document.getElementById('tutorsTableBody');

let editingTutorId = null;

// Logout
logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = 'login.html';
});

// Abrir formulário para novo tutor
addTutorBtn.addEventListener('click', () => {
  editingTutorId = null;
  tutorFormTitle.textContent = 'Adicionar Tutor';
  tutorForm.reset();
  tutorFormSection.classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Fechar formulário
function hideTutorForm() {
  tutorFormSection.classList.add('hidden');
  editingTutorId = null;
}

closeFormBtn.addEventListener('click', hideTutorForm);
cancelTutorBtn.addEventListener('click', hideTutorForm);

// Enviar formulário
tutorForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = {
    // Campos compatíveis com o backend (modelo Tutor)
    nome: document.getElementById('tutorNome').value.trim(),
    contato: document.getElementById('tutorContato').value.trim(),
    endereco: document.getElementById('tutorEndereco').value.trim(),
    telefone: document.getElementById('tutorTelefone').value.trim()
  };

  try {
    if (editingTutorId) {
      await putData(`tutors/${editingTutorId}`, data);
      alert('Tutor atualizado com sucesso!');
    } else {
      await postData('tutors', data);
      alert('Tutor cadastrado com sucesso!');
    }
    hideTutorForm();
    await loadTutors();
  } catch (err) {
    console.error(err);
    alert('Erro ao salvar tutor.');
  }
});

// Carregar lista
async function loadTutors() {
  try {
    const tutors = await getData('tutors');
    renderTutors(tutors);
  } catch (err) {
    console.error(err);
    alert('Erro ao carregar tutores.');
  }
}

function renderTutors(tutors) {
  tutorsTableBody.innerHTML = '';

  if (!tutors || tutors.length === 0) {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td colspan="5" class="px-4 py-4 text-center text-gray-500 text-sm">
      Nenhum tutor cadastrado ainda.
    </td>`;
    tutorsTableBody.appendChild(tr);
    return;
  }

  tutors.forEach((tutor) => {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-gray-50';

    tr.innerHTML = `
      <td class="px-4 py-2 text-sm text-gray-800">${tutor.nome}</td>
      <td class="px-4 py-2 text-sm text-gray-600 break-words">${tutor.contato}</td>
      <td class="px-4 py-2 text-sm text-gray-600 break-words">${tutor.endereco}</td>
      <td class="px-4 py-2 text-sm text-gray-800">${tutor.telefone}</td>
      <td class="px-4 py-2 text-right text-sm">
        <button
          class="inline-flex items-center px-2 py-1 mr-2 rounded bg-yellow-400 hover:bg-yellow-500 text-white text-xs font-semibold"
          onclick="editTutor(${tutor.id})"
        >
          ✏️ Editar
        </button>
        <button
          class="inline-flex items-center px-2 py-1 rounded bg-red-500 hover:bg-red-600 text-white text-xs font-semibold"
          onclick="deleteTutor(${tutor.id})"
        >
          🗑️ Excluir
        </button>
      </td>
    `;

    tutorsTableBody.appendChild(tr);
  });
}

// Editar tutor
window.editTutor = async function (id) {
  try {
    const tutor = await getData(`tutors/${id}`);
    if (!tutor) return;

    editingTutorId = tutor.id;
    tutorFormTitle.textContent = 'Editar Tutor';

    document.getElementById('tutorNome').value = tutor.nome || '';
    document.getElementById('tutorContato').value = tutor.contato || '';
    document.getElementById('tutorEndereco').value = tutor.endereco || '';
    document.getElementById('tutorTelefone').value = tutor.telefone || '';

    tutorFormSection.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (err) {
    console.error(err);
    alert('Erro ao carregar dados do tutor.');
  }
};

// Deletar tutor
window.deleteTutor = async function (id) {
  if (!confirm('Tem certeza que deseja excluir este tutor?')) return;
  try {
    await deleteData(`tutors/${id}`);
    alert('Tutor excluído com sucesso!');
    await loadTutors();
  } catch (err) {
    console.error(err);
    alert('Erro ao excluir tutor.');
  }
};

// Inicialização
loadTutors();

