const API = (process.env.REACT_APP_API || 'http://localhost:5000') + '/api';

export async function authFetch(path, opts = {}) {
  const token = localStorage.getItem('token');
  opts.headers = opts.headers || {};
  opts.headers['ngrok-skip-browser-warning'] = 'true';
  if (token) opts.headers['Authorization'] = 'Bearer ' + token;
  const res = await fetch(API + path, opts);
  const data = await res.json();
  return { ok: res.ok, data, status: res.status };
}
