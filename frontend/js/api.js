// URL base da API (backend Express)
const API_BASE_URL = 'https://amigo-pet-backend.onrender.com';
// ---------- AUTENTICAÇÃO ----------

// Login: POST /auth/login { email, password }
async function login(email, password) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return res.json();
}

// Registro: POST /auth/register { name, email, password }
async function register(name, email, password) {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });
  return res.json();
}

// ---------- HELPERS DE AUTH ----------

function getToken() {
  return localStorage.getItem('token');
}

function authHeaders() {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}

function handleUnauthorized(status) {
  if (status === 401 || status === 403) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    if (!window.location.pathname.endsWith('login.html')) {
      window.location.href = 'login.html';
    }
  }
}

// ---------- CRUD GENÉRICO ----------

async function getData(endpoint) {
  const res = await fetch(`${API_BASE_URL}/${endpoint}`, {
    headers: authHeaders()
  });
  handleUnauthorized(res.status);
  return res.json();
}

async function postData(endpoint, data) {
  const res = await fetch(`${API_BASE_URL}/${endpoint}`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data)
  });
  handleUnauthorized(res.status);
  return res.json();
}

async function putData(endpoint, data) {
  const res = await fetch(`${API_BASE_URL}/${endpoint}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data)
  });
  handleUnauthorized(res.status);
  return res.json();
}

async function deleteData(endpoint) {
  const res = await fetch(`${API_BASE_URL}/${endpoint}`, {
    method: 'DELETE',
    headers: authHeaders()
  });
  handleUnauthorized(res.status);
  return res.json();
}
