const loginForm = document.getElementById('loginForm');
const errorMsg = document.getElementById('errorMsg');
const loginBtn = document.getElementById('loginBtn');

// If already logged in, skip straight to the dashboard
(async function checkSession() {
  try {
    const res = await fetch('/api/auth/session');
    const data = await res.json();
    if (data.loggedIn) window.location.href = '/index.html';
  } catch (e) { /* server not reachable yet, ignore */ }
})();

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  errorMsg.textContent = '';
  loginBtn.disabled = true;
  loginBtn.textContent = 'Signing in…';

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();

    if (data.success) {
      window.location.href = '/index.html';
    } else {
      errorMsg.textContent = data.message || 'Login failed.';
    }
  } catch (err) {
    errorMsg.textContent = 'Could not reach the server. Is it running?';
  } finally {
    loginBtn.disabled = false;
    loginBtn.textContent = 'Sign in';
  }
});
