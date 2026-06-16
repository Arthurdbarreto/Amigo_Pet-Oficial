// Proteção de rota: se o usuário não estiver autenticado retorna ao login
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

// Controla o modo do formulário: null = novo tutor, id = editar tutor existente
let editingTutorId = null;

// Função para aplicar máscara no campo de telefone do formulário
// Usa IMask para exibir um exemplo claro do formato esperado
function applyPhoneMask() {
  const telefoneInput = document.getElementById('tutorTelefone');
  if (telefoneInput && window.IMask) {
    // Garante que não exista uma instância anterior ativa
    if (telefoneInput._imaskInstance) {
      telefoneInput._imaskInstance.destroy();
    }
    // Cria a máscara com placeholder visível para o usuário
    telefoneInput._imaskInstance = IMask(telefoneInput, {
      mask: '(00) 0 0000-0000',
      lazy: false, // Exibe o formato completo mesmo com o campo vazio
      placeholderChar: '0' // Exemplo de dígitos no padrão
    });
  }
}

// Evento de logout: limpa o token e redireciona para a tela de login
logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = 'login.html';
});

// Abre o formulário para criar um novo tutor
// Define o modo como criação e aplica máscara ao campo de telefone
addTutorBtn.addEventListener('click', () => {
  editingTutorId = null;
  tutorFormTitle.textContent = 'Adicionar Tutor';
  tutorForm.reset();
  tutorFormSection.classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  // Aplica máscara ao campo de telefone
  applyPhoneMask();
});

// Fecha o formulário e limpa o modo de edição
function hideTutorForm() {
  tutorFormSection.classList.add('hidden');
  editingTutorId = null;
}

closeFormBtn.addEventListener('click', hideTutorForm);
cancelTutorBtn.addEventListener('click', hideTutorForm);

// Tratamento do envio do formulário de tutor
// Se editingTutorId existir, atualiza tutor; caso contrário, cadastra novo tutor
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

// Busca todos os tutores via API e renderiza a tabela
async function loadTutors() {
  try {
    const tutors = await getData('tutors');
    renderTutors(tutors);
  } catch (err) {
    console.error(err);
    alert('Erro ao carregar tutores.');
  }
}

// Renderiza a lista de tutores na tabela do frontend
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
    // Aplica máscara ao campo de telefone após carregar dados
    applyPhoneMask();
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

