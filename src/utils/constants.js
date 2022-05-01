import { toast } from 'react-toastify';

const photoURL = '/static/mock-images/avatars/avatar_default.jpg';

// * Developement URLs
const API_BASE_ORIGIN = `http://localhost:5000`;
const API_BASE_URL = `http://localhost:5000/.netlify/functions/api`;

// * Production URLs
// const API_BASE_ORIGIN = `https://team-task-manager-backend.herokuapp.com`;
// const API_BASE_URL = `https://team-task-manager-backend.herokuapp.com/api`;

const handleCatch = (err) => {
  console.log('**********');
  console.log('**********');
  console.log('**********');
  console.log(`err`, err);
  let errMsg = 'Something Went Wrong';
  if (err.message) errMsg = err.message;
  toast.error(errMsg);
};

const makeReq = (endpoint, { body, ...customConfig } = {}, method = 'GET') => {
  const token = localStorage.getItem('jwt');
  const headers = { 'Content-Type': 'application/json' };

  if (token) {
    console.log(`token`, token);
    headers.Authorization = `Bearer ${token}`;
  }

  const config = {
    method,
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers
    }
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  console.log(`body`, body);
  return fetch(`${API_BASE_URL}${endpoint}`, config).then(async (res) => {
    const data = await res.json();
    console.log(`data`, data);
    return res.ok ? data : Promise.reject(data);
    // if (res.ok) {
    //   return data;
    // } else {
    //   return Promise.reject(data);
    // }
  });
};

export { API_BASE_URL, makeReq, handleCatch, photoURL, API_BASE_ORIGIN };
