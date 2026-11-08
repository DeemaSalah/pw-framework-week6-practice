// Shared bits for every page of the demo shop.

async function api(path, options = {}) {
  const res = await fetch(path, {
    method: options.method || 'GET',
    headers: options.body ? { 'Content-Type': 'application/json' } : undefined,
    body: options.body ? JSON.stringify(options.body) : undefined,
    credentials: 'same-origin',
  });
  let data = null;
  try { data = await res.json(); } catch { /* 204 or not JSON */ }
  return { ok: res.ok, status: res.status, data };
}

function setCartCount(count) {
  const badge = document.querySelector('[data-test="cart-count"]');
  if (badge) badge.textContent = String(count);
}

// Pages that need a signed-in customer call this first.
// No session? Straight back to the sign-in page.
async function requireUser() {
  const me = await api('/api/me');
  if (me.status === 401) {
    location.replace('/login');
    return new Promise(() => {}); // never resolves - the page is leaving
  }
  renderHeader(me.data);
  const cart = await api('/api/cart');
  setCartCount(cart.data.count);
  return me.data;
}

function renderHeader(user) {
  const header = document.getElementById('site-header');
  header.className = 'site-header';
  header.innerHTML = `
    <a class="brand" href="/">Toolshop</a>
    <nav aria-label="Main">
      <a href="/">Products</a>
      <a class="cart-link" href="/cart">Cart <span data-test="cart-count">0</span></a>
    </nav>
    <span class="who" data-test="user-email"></span>
    <button type="button" data-test="sign-out">Sign out</button>`;
  header.querySelector('[data-test="user-email"]').textContent = user.email;
  header.querySelector('[data-test="sign-out"]').addEventListener('click', async () => {
    await api('/api/logout', { method: 'POST' });
    location.assign('/login');
  });
}

function showMessage(el, text) {
  el.textContent = text;
  el.hidden = false;
}
