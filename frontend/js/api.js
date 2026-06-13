const API_BASE_URL = 'http://localhost:3000';

async function login(email, password) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return response.json();
}

async function register(name, email, password) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });
  return response.json();
}

async function getData(endpoint) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (response.status === 401) {
    window.location.href = 'login.html';
  }
  return response.json();
}

async function postData(endpoint, data) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  if (response.status === 401) {
    window.location.href = 'login.html';
  }
  return response.json();
}

async function putData(endpoint, data) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  if (response.status === 401) {
    window.location.href = 'login.html';
  }
  return response.json();
}

async function deleteData(endpoint) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (response.status === 401) {
    window.location.href = 'login.html';
  }
  return response.json();
}
