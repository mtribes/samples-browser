import { el, setChildren, setAttr, mount, place, text } from 'redom';

// fake known user we'll use when signed in
const FAKE_USER = {
  id: '2id2f459d2s5',
  name: 'Olivia',
  subscription: 'gold',
};

// Sign in/out action handlers
// -----

function onLogin(user) {
  render({ user });
}
function onLogout() {
  render({});
}

// Render html elements with latest state
// -----

function render(props) {
  renderHeader(props);
  renderBody(props);
}

function renderHeader({ user }) {
  const { header, welcome, authBtn } = elements;

  if (user) {
    authBtn.onclick = () => onLogout();
    authBtn.innerText = 'Sign-out';
    welcome.update(true);
    setChildren(welcome, [text(user.name)]);
  } else {
    authBtn.onclick = () => onLogin(FAKE_USER);
    authBtn.innerText = 'Sign-in';
    welcome.update(false);
  }

  header.update(true);
}

function renderBody({ user }) {
  const children: HTMLElement[] = [];

  // present a different hero image for anonymous and known user
  const heroImageUrl = user
    ? 'https://images.unsplash.com/photo-1511988617509-a57c8a288659?&q=80&fm=jpg&crop=entropy&cs=tinysrgb&dl=helena-lopes-e3OUQGT9bWU-unsplash.jpg&w=800'
    : 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&fm=jpg&crop=entropy&cs=tinysrgb&dl=simon-maage-tXiMrX3Gc-g-unsplash.jpg&w=800';

  const hero = getRowElement('hero1', 'hero');
  setAttr(hero, { src: heroImageUrl });
  children.push(hero);

  const banner = getRowElement('banner1', 'banner');
  const btn = banner.firstChild as HTMLElement;
  btn.innerText = user ? 'Member' : 'Visitor';
  children.push(banner);

  elements.rows.update(children.length > 0);
  setChildren(elements.rows, children);
}

function getRowElement(id: string, type: 'hero' | 'banner'): HTMLElement {
  if (elements[id]) {
    return elements[id];
  }
  switch (type) {
    case 'hero':
      return (elements[id] = el('img.hero'));
    case 'banner':
      const btn = el('button.btn-secondary');
      const banner = el('div.banner', btn);
      return (elements[id] = banner);
  }
}

// Create initial HTML elements
// -----

function createElements() {
  const elements: { [id: string]: any } = {};

  const logo = el('div.logo');
  const welcome = place(el('h4.welcome') as any);
  const authBtn = el('button.btn-auth');

  elements.authBtn = authBtn;
  elements.welcome = welcome;
  elements.header = place(el('header', logo, welcome, authBtn) as any);
  elements.rows = place(el('main.#content') as any);

  return elements;
}

// cache of html elements
// NOTE: no cache pruning for this basic example
const elements = createElements();

// Attach elements to DOM
// -----

const root: any = document.getElementById('root');
mount(root, elements.rows);
mount(root, elements.header, elements.rows);

// start in logged out state
onLogout();
