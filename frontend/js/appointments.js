// Proteção de rota
const tokenAppt = localStorage.getItem('token');
if (!tokenAppt) {
  window.location.href = 'login.html';
}

// Elementos
const logoutBtnAppt = document.getElementById('logoutBtn');
const addAppointmentBtn = document.getElementById('addAppointmentBtn');
const appointmentFormSection = document.getElementById('appointmentFormSection');
const appointmentFormTitle = document.getElementById('appointmentFormTitle');
const appointmentForm = document.getElementById('appointmentForm');
const closeAppointmentFormBtn = document.getElementById('closeAppointmentFormBtn');
const cancelAppointmentBtn = document.getElementById('cancelAppointmentBtn');
const appointmentsTableBody = document.getElementById('appointmentsTableBody');

const filterDate = document.getElementById('filterDate');
const filterStatus = document.getElementById('filterStatus');
const filterBtn = document.getElementById('filterBtn');
const clearFilterBtn = document.getElementById('clearFilterBtn');

const selTutor = document.getElementById('appointmentTutorId');
const selPet = document.getElementById('appointmentPetId');
const selService = document.getElementById('appointmentServiceId');

let editingAppointmentId = null;
let allAppointments = [];
let tutorsCacheAppt = [];
let petsCacheAppt = [];
let servicesCacheAppt = [];

// Logout
logoutBtnAppt.addEventListener('click', () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = 'login.html';
});

// Abrir formulário
addAppointmentBtn.addEventListener('click', () => {
  editingAppointmentId = null;
  appointmentFormTitle.textContent = 'Adicionar Agendamento';
  appointmentForm.reset();
  appointmentFormSection.classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Fechar formulário
function hideAppointmentForm() {
  appointmentFormSection.classList.add('hidden');
  editingAppointmentId = null;
}
closeAppointmentFormBtn.addEventListener('click', hideAppointmentForm);
cancelAppointmentBtn.addEventListener('click', hideAppointmentForm);

// Carregar dados base (tutores, pets, serviços)
async function loadBaseData() {
  try {
    tutorsCacheAppt = await getData('tutors');
    servicesCacheAppt = await getData('services');
    petsCacheAppt = await getData('pets');

    // preencher selects
    selTutor.innerHTML = '<option value="">Selecione</option>';
    tutorsCacheAppt.forEach(t => {
      const opt = document.createElement('option');
      opt.value = t.id;
      opt.textContent = t.nome;
      selTutor.appendChild(opt);
    });

    selService.innerHTML = '<option value="">Selecione</option>';
    servicesCacheAppt.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s.id;
      opt.textContent = s.nome;
      selService.appendChild(opt);
    });

    fillPetsSelect(); // preenche com todos inicialmente
  } catch (err) {
    console.error(err);
    alert('Erro ao carregar tutores/pets/serviços.');
  }
}

// preencher pets conforme tutor
function fillPetsSelect(tutorId = null) {
  selPet.innerHTML = '<option value="">Selecione</option>';
  let list = petsCacheAppt;
  if (tutorId) {
    list = list.filter(p => p.tutorId === Number(tutorId));
  }
  list.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.id;
    opt.textContent = p.nome;
    selPet.appendChild(opt);
  });
}

selTutor.addEventListener('change', () => {
  const tid = selTutor.value;
  fillPetsSelect(tid || null);
});

// Submit formulário
appointmentForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = {
    tutorId: Number(selTutor.value),
    petId: Number(selPet.value),
    serviceId: Number(selService.value),
    datetime: document.getElementById('appointmentDateTime').value,
    status: document.getElementById('appointmentStatus').value
    // obs: campo extra "obs" não está no model atual
  };

  if (!data.tutorId || !data.petId || !data.serviceId || !data.datetime) {
    alert('Preencha todos os campos obrigatórios.');
    return;
  }

  try {
    if (editingAppointmentId) {
      await putData(`appointments/${editingAppointmentId}`, data);
      alert('Agendamento atualizado com sucesso!');
    } else {
      await postData('appointments', data);
      alert('Agendamento criado com sucesso!');
    }
    hideAppointmentForm();
    await loadAppointments();
  } catch (err) {
    console.error(err);
    alert('Erro ao salvar agendamento.');
  }
});

// Carregar agendamentos
async function loadAppointments() {
  try {
    allAppointments = await getData('appointments');
    renderAppointments(allAppointments || []);
  } catch (err) {
    console.error(err);
    alert('Erro ao carregar agendamentos.');
  }
}

function renderAppointments(list) {
  appointmentsTableBody.innerHTML = '';

  if (!list.length) {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td colspan="6" class="px-4 py-4 text-center text-gray-500 text-sm">
      Nenhum agendamento encontrado.
    </td>`;
    appointmentsTableBody.appendChild(tr);
    return;
  }

  list.forEach(a => {
    const tutor = tutorsCacheAppt.find(t => t.id === a.tutorId);
    const pet = petsCacheAppt.find(p => p.id === a.petId);
    const svc = servicesCacheAppt.find(s => s.id === a.serviceId);

    const dt = a.datetime || a.dateTime || a.data || '';
    const d = dt ? new Date(dt) : null;
    const dtStr = d ? d.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }) : '—';

    const statusClass =
      a.status === 'Confirmado' ? 'bg-green-100 text-green-700' :
      a.status === 'Concluído' ? 'bg-blue-100 text-blue-700' :
      a.status === 'Cancelado' ? 'bg-red-100 text-red-700' :
      'bg-yellow-100 text-yellow-700';

    const tr = document.createElement('tr');
    tr.className = 'hover:bg-gray-50';
    tr.innerHTML = `
      <td class="px-4 py-2 text-sm text-gray-800">${dtStr}</td>
      <td class="px-4 py-2 text-sm text-gray-800">${tutor?.nome || '—'}</td>
      <td class="px-4 py-2 text-sm text-gray-800">${pet?.nome || '—'}</td>
      <td class="px-4 py-2 text-sm text-gray-800">${svc?.nome || '—'}</td>
      <td class="px-4 py-2 text-sm">
        <span class="inline-flex px-2 py-1 rounded-full text-xs font-semibold ${statusClass}">
          ${a.status}
        </span>
      </td>
      <td class="px-4 py-2 text-right text-sm">
        <button
          class="inline-flex items-center px-2 py-1 mr-2 rounded bg-yellow-400 hover:bg-yellow-500 text-white text-xs font-semibold"
          onclick="editAppointment(${a.id})"
        >
          ✏️ Editar
        </button>
        <button
          class="inline-flex items-center px-2 py-1 rounded bg-red-500 hover:bg-red-600 text-white text-xs font-semibold"
          onclick="deleteAppointment(${a.id})"
        >
          🗑️ Excluir
        </button>
      </td>
    `;
    appointmentsTableBody.appendChild(tr);
  });
}

// Editar
window.editAppointment = async function (id) {
  try {
    const a = await getData(`appointments/${id}`);
    if (!a) return;

    editingAppointmentId = a.id;
    appointmentFormTitle.textContent = 'Editar Agendamento';

    selTutor.value = a.tutorId || '';
    fillPetsSelect(selTutor.value || null);
    selPet.value = a.petId || '';
    selService.value = a.serviceId || '';

    // datetime-local espera formato "YYYY-MM-DDTHH:mm"
    if (a.datetime) {
      const iso = new Date(a.datetime).toISOString().slice(0, 16);
      document.getElementById('appointmentDateTime').value = iso;
    }

    document.getElementById('appointmentStatus').value = a.status || 'Agendado';

    appointmentFormSection.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (err) {
    console.error(err);
    alert('Erro ao carregar dados do agendamento.');
  }
};

// Deletar
window.deleteAppointment = async function (id) {
  if (!confirm('Tem certeza que deseja excluir este agendamento?')) return;
  try {
    await deleteData(`appointments/${id}`);
    alert('Agendamento excluído com sucesso!');
    await loadAppointments();
  } catch (err) {
    console.error(err);
    alert('Erro ao excluir agendamento.');
  }
};

// Filtros
filterBtn.addEventListener('click', () => {
  let list = [...allAppointments];

  if (filterDate.value) {
    const target = new Date(filterDate.value);
    list = list.filter(a => {
      const d = new Date(a.datetime || a.dateTime || '');
      return (
        d.getFullYear() === target.getFullYear() &&
        d.getMonth() === target.getMonth() &&
        d.getDate() === target.getDate()
      );
    });
  }

  if (filterStatus.value) {
    list = list.filter(a => a.status === filterStatus.value);
  }

  renderAppointments(list);
});

clearFilterBtn.addEventListener('click', () => {
  filterDate.value = '';
  filterStatus.value = '';
  renderAppointments(allAppointments);
});

// Inicialização
(async function initAppointments() {
  await loadBaseData();
  await loadAppointments();
})();

