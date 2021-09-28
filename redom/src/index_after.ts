import { el, setChildren, setAttr, mount, place, text, setStyle } from 'redom';

// import code generated based on modeled Space
// see https://developers.mtribes.com/docs/sdk/getting-started#cli-installation
import { client, session, collections } from './mtspace/sample';

const FAKE_USER = {
  id: '2id2f459d2s5',
  name: 'Olivia',
  subscription: 'gold',
};

const { homepage } = collections;

// Enable live updates by disabling the session lock cache.
// NOTE: This should usually only be disabled in development
//       when you want to see published changes from mtribes instantly.
//       **Disabling in production can cause your UI to change
//       under a user during their session.**
client.sessionLock = false;

// Sign in/out action handlers
// -----

async function onLogin(user) {
  await session.start({
    userId: user.id,
    fields: {
      subscription: user.subscription,
    },
  });
  render({ user });
}

async function onLogout() {
  await session.start();
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

  // only show the header if it's enabled
  header.update(homepage.header.enabled);

  // override the background color if we have one defined
  const bgColor = homepage.header.data.backgroundColor?.value;
  const bgGrad = homepage.header.data.gradientColor?.value;
  if (bgColor && bgGrad) {
    setStyle(header, {
      backgroundColor: bgColor,
      background: `linear-gradient(91deg, ${bgColor}, ${bgGrad})`,
    });
  }
}
// re-render the header when changes detected from mtribes
homepage.header.changed.add(() => {
  const user = session.anonymous ? undefined : FAKE_USER;
  renderHeader({ user });
});

function renderBody({ user }) {
  const children: HTMLElement[] = [];
  const { body } = homepage;

  for (const exp of body.children) {
    if (!exp.enabled) continue;

    switch (exp.kind) {
      case body.supported.Hero:
        const { source } = exp.data;
        const hero = getRowElement(exp.id, 'hero');
        setAttr(hero, { src: source });
        children.push(hero);
        break;
      case body.supported.Banner:
        const { label } = exp.data;
        const banner = getRowElement(exp.id, 'banner');
        const btn = banner.firstChild as HTMLElement;
        btn.onclick = () => exp.track('item/clicked');
        btn.innerText = label || exp.defaultData.label!;
        children.push(banner);
        break;
    }
  }

  // only show rows if we have some
  elements.rows.update(children.length > 0);

  setChildren(elements.rows, children);
}
// re-render the body when changes detected from mtribes
homepage.body.changed.add(() => {
  const user = session.anonymous ? undefined : FAKE_USER;
  renderBody({ user });
});

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

// start in signed out state
onLogout();
