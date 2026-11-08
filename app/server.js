// The demo shop: a static site plus a small JSON API, with no dependencies.
// Playwright's webServer setting starts and stops it for you, so you rarely run it by hand.
// If you do want to click around it yourself:  node app/server.js   then open http://localhost:4175
//
// Everything is held in memory. Restarting the server resets every user, cart and order.
// That is deliberate: each test run starts from the same place.

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const PORT = Number(process.env.PORT || 4175);
const PRODUCTS_DELAY_MS = Number(process.env.PRODUCTS_DELAY_MS ?? 1200); // products arrive late, on purpose
const PUBLIC_DIR = path.join(__dirname, 'public');
const seed = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'seed.json'), 'utf8'));

// ---------- state ----------
const products = seed.products;
const users = new Map(); // id -> user
const sessions = new Map(); // session id -> user id
let nextOrder = 1001;

for (const u of seed.users) users.set(u.id, { ...u, cart: new Map(), orders: [] });

const hash = (salt, password) => crypto.createHash('sha256').update(`${salt}:${password}`).digest('hex');
const findByEmail = (email) => [...users.values()].find((u) => u.email.toLowerCase() === String(email).toLowerCase());
const publicUser = (u) => ({ id: u.id, name: u.name, email: u.email });
const money = (cents) => `$${(cents / 100).toFixed(2)}`;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---------- search ----------
// The search looks through the live catalogue AND the archive of every product the shop has
// ever sold, word by word, with no index. Plenty fast for one customer.
// Week 6: find out what it does to fifty -  npm run perf
const ARCHIVE_WORDS = ['steel', 'heavy', 'compact', 'cordless', 'insulated', 'precision', 'folding', 'magnetic', 'adjustable', 'pro'];
const ARCHIVE_TOOLS = ['wrench', 'chisel', 'saw', 'clamp', 'level', 'file', 'rasp', 'punch', 'mallet', 'sander', 'planer', 'trowel'];
const archive = Array.from({ length: 6000 }, (_, i) => `${ARCHIVE_WORDS[i % 10]} ${ARCHIVE_WORDS[(i * 7) % 10]} ${ARCHIVE_TOOLS[i % 12]} ${1000 + i}`);

function distance(a, b) {
  // How many single-letter edits turn a into b. Lets "hamer" still find "hammer".
  const row = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    let prev = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const keep = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = keep;
    }
  }
  return row[b.length];
}

function search(query) {
  const words = String(query).toLowerCase().split(/\s+/).filter(Boolean);
  const matches = (name) => words.every((w) => name.toLowerCase().split(/\s+/).some((n) => distance(w, n) <= 1));
  const archived = archive.filter(matches).length; // counted, not shown: archived products cannot be bought
  return { query, results: products.filter((p) => matches(p.name)).map((p) => ({ id: p.id, name: p.name, price: money(p.priceCents) })), archivedMatches: archived };
}

function cartView(user) {
  const lines = [...user.cart.entries()].map(([productId, quantity]) => {
    const p = products.find((x) => x.id === productId);
    return { productId, name: p.name, price: money(p.priceCents), quantity, lineTotal: money(p.priceCents * quantity), _cents: p.priceCents * quantity };
  });
  const totalCents = lines.reduce((sum, l) => sum + l._cents, 0);
  return {
    lines: lines.map(({ _cents, ...l }) => l),
    count: lines.reduce((n, l) => n + l.quantity, 0),
    total: money(totalCents),
  };
}

// ---------- http helpers ----------
function send(res, status, body, headers = {}) {
  const isJson = body !== undefined && typeof body !== 'string';
  res.writeHead(status, { 'Content-Type': isJson ? 'application/json' : 'text/plain', ...headers });
  res.end(body === undefined ? undefined : isJson ? JSON.stringify(body) : body);
}

function readBody(req) {
  return new Promise((resolve) => {
    let data = '';
    req.on('data', (c) => (data += c));
    req.on('end', () => {
      try { resolve(data ? JSON.parse(data) : {}); } catch { resolve(null); }
    });
  });
}

function sessionUser(req) {
  const cookie = req.headers.cookie || '';
  const match = cookie.match(/(?:^|;\s*)sid=([^;]+)/);
  const userId = match && sessions.get(match[1]);
  return userId ? users.get(userId) : undefined;
}

function startSession(user) {
  const sid = crypto.randomBytes(18).toString('hex');
  sessions.set(sid, user.id);
  return `sid=${sid}; HttpOnly; Path=/; SameSite=Lax`;
}

// ---------- API ----------
async function api(req, res, url) {
  const route = `${req.method} ${url.pathname}`;
  const body = ['POST', 'PUT', 'PATCH'].includes(req.method) ? await readBody(req) : {};
  if (body === null) return send(res, 400, { error: 'Request body must be valid JSON' });

  if (route === 'GET /api/health') return send(res, 200, { ok: true });

  if (route === 'GET /api/products') {
    await sleep(PRODUCTS_DELAY_MS);
    return send(res, 200, products.map((p) => ({ id: p.id, name: p.name, price: money(p.priceCents) })));
  }

  if (route === 'GET /api/search') {
    const q = url.searchParams.get('q') || '';
    if (!q.trim()) return send(res, 400, { error: 'Search for something' });
    return send(res, 200, search(q.slice(0, 50)));
  }

  if (route === 'POST /api/users') {
    const { name, email, password } = body;
    if (!name || !String(name).trim()) return send(res, 400, { error: 'Enter your name' });
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return send(res, 400, { error: 'Enter a valid email address' });
    if (!password || String(password).length < 8) return send(res, 400, { error: 'Password must be at least 8 characters' });
    if (String(name).length > 50) return send(res, 400, { error: 'Name must be 50 characters or fewer' });
    if (findByEmail(email)) return send(res, 409, { error: 'An account with this email already exists' });
    const salt = crypto.randomBytes(8).toString('hex');
    const user = { id: `u-${crypto.randomUUID().slice(0, 8)}`, name: String(name).trim(), email, salt, passwordHash: hash(salt, password), cart: new Map(), orders: [] };
    users.set(user.id, user);
    return send(res, 201, publicUser(user));
  }

  if (route === 'POST /api/login') {
    const user = findByEmail(body.email || '');
    if (!user || user.passwordHash !== hash(user.salt, body.password || '')) {
      return send(res, 401, { error: 'Invalid email or password' });
    }
    return send(res, 200, publicUser(user), { 'Set-Cookie': startSession(user) });
  }

  // Everything below needs a signed-in user.
  const user = sessionUser(req);
  if (!user) return send(res, 401, { error: 'Not signed in' });

  if (route === 'GET /api/me') return send(res, 200, publicUser(user));

  if (route === 'POST /api/logout') {
    const sid = (req.headers.cookie || '').match(/(?:^|;\s*)sid=([^;]+)/)[1];
    sessions.delete(sid);
    return send(res, 204, undefined, { 'Set-Cookie': 'sid=; HttpOnly; Path=/; Max-Age=0' });
  }

  if (route === 'DELETE /api/users/me') {
    users.delete(user.id);
    for (const [sid, uid] of sessions) if (uid === user.id) sessions.delete(sid);
    return send(res, 204);
  }

  if (route === 'GET /api/cart') return send(res, 200, cartView(user));

  if (route === 'POST /api/cart') {
    // Most saves are quick; about one in four is slow, the way a real server behaves on a busy day.
    // Web-first assertions do not care. A fixed wait does - see museum/flaky.spec.ts.
    const slow = Math.random() < 0.25;
    await sleep(slow ? 400 + Math.floor(Math.random() * 150) : Math.floor(Math.random() * 120));
    const product = products.find((p) => p.id === body.productId);
    const quantity = body.quantity === undefined ? 1 : Number(body.quantity);
    if (!product) return send(res, 404, { error: `No product with id ${body.productId}` });
    if (!Number.isInteger(quantity) || quantity < 1) return send(res, 400, { error: 'Quantity must be a whole number of at least 1' });
    user.cart.set(product.id, (user.cart.get(product.id) || 0) + quantity);
    return send(res, 200, cartView(user));
  }

  const lineMatch = url.pathname.match(/^\/api\/cart\/(\w+)$/);
  if (lineMatch && req.method === 'PUT') {
    const quantity = Number(body.quantity);
    if (!user.cart.has(lineMatch[1])) return send(res, 404, { error: 'That product is not in your cart' });
    if (!Number.isInteger(quantity) || quantity < 0) return send(res, 400, { error: 'Quantity must be a whole number' });
    if (quantity === 0) user.cart.delete(lineMatch[1]);
    else user.cart.set(lineMatch[1], quantity);
    return send(res, 200, cartView(user));
  }
  if (lineMatch && req.method === 'DELETE') {
    user.cart.delete(lineMatch[1]);
    return send(res, 200, cartView(user));
  }
  if (route === 'DELETE /api/cart') {
    user.cart.clear();
    return send(res, 200, cartView(user));
  }

  if (route === 'POST /api/orders') {
    if (user.cart.size === 0) return send(res, 400, { error: 'Your cart is empty' });
    const view = cartView(user);
    const order = { orderId: `ORD-${nextOrder++}`, customer: { name: user.name, email: user.email }, total: view.total, lines: view.lines };
    user.orders.push(order);
    user.cart.clear();
    return send(res, 201, order);
  }

  if (route === 'GET /api/orders') return send(res, 200, user.orders);

  // One order, by its number - for the order confirmation e-mail and the "Your order" link.
  const orderMatch = url.pathname.match(/^\/api\/orders\/([\w-]+)$/);
  if (orderMatch && req.method === 'GET') {
    const order = [...users.values()].flatMap((u) => u.orders).find((o) => o.orderId === orderMatch[1]);
    if (!order) return send(res, 404, { error: 'No such order' });
    return send(res, 200, order);
  }

  return send(res, 404, { error: `No route for ${route}` });
}

// ---------- static pages ----------
const PAGES = { '/': 'index.html', '/login': 'login.html', '/register': 'register.html', '/cart': 'cart.html' };
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml' };

function serveStatic(res, pathname) {
  const file = PAGES[pathname] || pathname.replace(/^\/+/, '');
  const full = path.join(PUBLIC_DIR, path.normalize(file));
  if (!full.startsWith(PUBLIC_DIR) || !fs.existsSync(full) || fs.statSync(full).isDirectory()) {
    return send(res, 404, 'Not found');
  }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(full)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
  fs.createReadStream(full).pipe(res);
}

http
  .createServer((req, res) => {
    const url = new URL(req.url, `http://localhost:${PORT}`);
    if (url.pathname.startsWith('/api/')) {
      api(req, res, url).catch((err) => send(res, 500, { error: err.message }));
    } else {
      serveStatic(res, url.pathname);
    }
  })
  .listen(PORT, () => console.log(`Toolshop demo running at http://localhost:${PORT}`));
