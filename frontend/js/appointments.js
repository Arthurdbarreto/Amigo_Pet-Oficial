let editingAppointmentId = null;
let allTutors = [];
let allPets = [];
let allServices = [];

// Verificar autenticação
const token = localStorage.getItem('token');
if (!token) {
  window.location.href = 'login.html';
}

// Elementos do DOM
const addBtn = document.getElementById('addAppointmentBtn');
const formSection = document.getElementById('appointmentForm');
const formEl = document.getElementById('appointmentFormEl');
const cancelBtn = document.getElementById('cancelBtn');
const logoutBtn = document.getElementById('logoutBtn');
const appointmentsBody = document.getElementById('appointmentsBody');
const filterBtn = document.getElementById('filterBtn');
const filterDate = document.getElementById('filterDate');
const filterStatus = document.getElementById('filterStatus');

// Event listeners
addBtn.addEventListener('click', showAddForm);
cancelBtn.addEventListener('click', hideForm);
formEl.addEventListener('submit', handleSubmit);
logoutBtn.addEventListener('click', logout);
filterBtn.addEventListener('click', applyFilters);
document.getElementById('appointmentTutor').addEventListener('change', loadPetsByTutor);

// Carregar dados ao iniciar
loadInitialData();

async function loadInitialData() {
  try {
    allTutors = await getData('tutors');
    allServices = await getData('services');
    loadAppointments();
    populateTutorSelect();
  } catch (error) {
    alert('Erro ao carregar dados: ' + error.message);
  }
}

function populateTutorSelect() {
  const select = document.getElementById('appointmentTutor');
  select.innerHTML = '<option value="">Selecione o Tutor</option>';
  allTutors.forEach(tutor => {
    const option = document.createElement('option');
    option.value = tutor.id;
    option.textContent = tutor.name;
    select.appendChild(option);
  });
}

function populatePetSelect(pets) {
  const select = document.getElementById('appointmentPet');
  select.innerHTML = '<option value="">Selecione o Pet</option>';
  pets.forEach(pet => {
    const option = document.createElement('option');
    option.value = pet.id;
    option.textContent = `${pet.name} (${pet.species})`;
    select.appendChild(option);
  });
}

function populateServiceSelect() {
  const select = document.getElementById('appointmentService');
  select.innerHTML = '<option value="">Selecione o Serviço</option>';
  allServices.forEach(service => {
    const option = document.createElement('option');
    option.value = service.id;
    option.textContent = `${service.name} - R$ ${service.price.toFixed(2)}`;
    select.appendChild(option);
  });
}

async function loadPetsByTutor() {
  const tutorId = document.getElementById('appointmentTutor').value;
  if (tutorId) {
    try {
      const pets = await getData(`tutors/${tutorId}/pets`);
      allPets = pets;
      populatePetSelect(pets);
    } catch (error) {
      alert('Erro ao carregar pets: ' + error.message);
    }
  }
}

function showAddForm() {
  document.getElementById('formTitle').textContent = 'Adicionar Agendamento';
  formEl.reset();
  populateServiceSelect();
  document.getElementById('appointmentStatus').value = 'Agendado';
  editingAppointmentId = null;
  formSection.style.display = 'block';
}

function showEditForm(appointment) {
  document.getElementById('formTitle').textContent = 'Editar Agendamento';
  document.getElementById('appointmentTutor').value = appointment.tutorId;
  loadPetsByTutor().then(() => {
    document.getElementById('appointmentPet').value = appointment.petId;
  });
  populateServiceSelect();
  document.getElementById('appointmentService').value = appointment.serviceId;
  document.getElementById('appointmentDateTime').value = appointment.dateTime.replace(' ', 'T');
  document.getElementById('appointmentStatus').value = appointment.status;
  document.getElementById('appointmentPrice').value = appointment.price || '';
  document.getElementById('appointmentNotes').value = appointment.notes || '';
  editingAppointmentId = appointment.id;
  formSection.style.display = 'block';
}

function hideForm() {
  formSection.style.display = 'none';
  editingAppointmentId = null;
}

async function handleSubmit(e) {
  e.preventDefault();
  
  const appointmentData = {
    tutorId: parseInt(document.getElementById('appointmentTutor').value),
    petId: parseInt(document.getElementById('appointmentPet').value),
    serviceId: parseInt(document.getElementById('appointmentService').value),
    dateTime: document.getElementById('appointmentDateTime').value.replace('T', ' '),
    status: document.getElementById('appointmentStatus').value,
    price: parseFloat(document.getElementById('appointmentPrice').value) || 0,
    notes: document.getElementById('appointmentNotes').value
  };

  try {
    if (editingAppointmentId) {
      await putData(`appointments/${editingAppointmentId}`, appointmentData);
      alert('Agendamento atualizado com sucesso!');
    } else {
      await postData('appointments', appointmentData);
      alert('Agendamento criado com sucesso!');
    }
    hideForm();
    loadAppointments();
  } catch (error) {
    alert('Erro ao salvar agendamento: ' + error.message);
  }
}

async function loadAppointments() {
  try {
    const appointments = await getData('appointments');
    displayAppointments(appointments);
  } catch (error) {
    alert('Erro ao carregar agendamentos: ' + error.message);
  }
}

function displayAppointments(appointments) {
  appointmentsBody.innerHTML = '';
  
  appointments.forEach(appointment => {
    const tutor = allTutors.find(t => t.id === appointment.tutorId);
    const pet = allPets.find(p => p.id === appointment.petId);
    const service = allServices.find(s => s.id === appointment.serviceId);
    
    const row = document.createElement('tr');
    const statusClass = appointment.status.toLowerCase().replace(' ', '-');
    const dateObj = new Date(appointment.dateTime.replace(' ', 'T'));
    const formattedDate = dateObj.toLocaleDateString('pt-BR');
    const formattedTime = dateObj.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'});
    
    row.innerHTML = `
      <td>${formattedDate} ${formattedTime}</td>
      <td>${tutor?.name || '-'}</td>
      <td>${pet?.name || '-'}</td>
      <td>${service?.name || '-'}</td>
      <td><span class="status-badge status-${statusClass}">${appointment.status}</span></td>
      <td>R$ ${appointment.price?.toFixed(2) || '0.00'}</td>
      <td class="actions">
        <button onclick="showEditForm(${JSON.stringify(appointment).replace(/"/g, '&quot;')})" class="btn-edit">✏️</button>
        <button onclick="deleteAppointment(${appointment.id})" class="btn-delete">🗑️</button>
      </td>
    `;
    appointmentsBody.appendChild(row);
  });
}

async function deleteAppointment(id) {
  if (confirm('Tem certeza que deseja cancelar este agendamento?')) {
    try {
      await deleteData(`appointments/${id}`);
      alert('Agendamento cancelado com sucesso!');
      loadAppointments();
    } catch (error) {
      alert('Erro ao cancelar agendamento: ' + error.message);
    }
  }
}

async function applyFilters() {
  try {
    let appointments = await getData('appointments');
    
    if (filterDate.value) {
      const selectedDate = new Date(filterDate.value).toLocaleDateString('pt-BR');
      appointments = appointments.filter(apt => {
        const aptDate = new Date(apt.dateTime.replace(' ', 'T')).toLocaleDateString('pt-BR');
        return aptDate === selectedDate;
      });
    }
    
    if (filterStatus.value) {
      appointments = appointments.filter(apt => apt.status === filterStatus.value);
    }
    
    displayAppointments(appointments);
  } catch (error) {
    alert('Erro ao filtrar: ' + error.message);
  }
}

function logout() {
  localStorage.removeItem('token');
  window.location.href = 'login.html';
}
