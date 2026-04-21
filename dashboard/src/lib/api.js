export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export async function request(path, { method = 'GET', headers = {}, body, skipAuthRedirect = false } = {}) {
  const url = path.startsWith('http') ? path : `${API_URL}${path}`;

  const fetchHeaders = new Headers(headers || {});

  // Add JSON content-type when sending a JSON body
  if (body && !(body instanceof FormData) && !fetchHeaders.has('Content-Type')) {
    fetchHeaders.set('Content-Type', 'application/json');
  }

  const token = localStorage.getItem('token');
  if (token) fetchHeaders.set('Authorization', `Bearer ${token}`);

  const opts = { method, headers: fetchHeaders };
  // Disable browser caching for API requests
  // `no-store` ensures the browser will always request the resource from the network
  opts.cache = 'no-store';
  if (body) opts.body = body instanceof FormData ? body : JSON.stringify(body);

  const res = await fetch(url, opts);

  if (!res.ok) {
    // Security redirect for unauthorized access
    if (!skipAuthRedirect && (res.status === 401 || res.status === 403)) {
      try {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } catch (e) {}
      // Redirect to login page
      window.location.href = '/';
      // stop further execution
      throw new Error('Sessão inválida. Redirecionando para login.');
    }

    // Try to extract message from response
    let errMsg = `Erro na requisição (${res.status})`;
    try {
      const json = await res.json();
      if (json && json.message) errMsg = json.message;
    } catch (e) {}
    throw new Error(errMsg);
  }

  if (res.status === 204) return null;
  try {
    return await res.json();
  } catch (e) {
    return null;
  }
}

export default { request };
