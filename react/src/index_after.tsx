import React, { useState } from 'react';
import { render } from 'react-dom';
import { client, session, collections } from './mtspace/sample';
import { useExperience, useSection } from '@mtribes/client-react';

// fake known user we'll use when signed in
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

function App() {
  const [user, setUser] = useState(undefined);

  async function onLogin(member) {
    await session.start({
      userId: member.id,
      fields: {
        subscription: member.subscription,
      },
    });
    setUser(member);
  }
  async function onLogout() {
    await session.start();
    setUser(undefined);
  }

  return (
    <>
      <Header user={user} onLogin={onLogin} onLogout={onLogout} />
      <main>
        <Body user={user} />
      </main>
    </>
  );
}

function Header({ user, onLogin, onLogout }): any {
  const header = useExperience(homepage.header);
  if (!header.enabled) return null;

  // override the bg color if we have one defined
  const bgColor = homepage.header.data.backgroundColor?.value;
  const bgGrad = homepage.header.data.gradientColor?.value;
  return (
    <header
      className="header"
      style={{
        backgroundColor: bgColor,
        background: `linear-gradient(91deg, ${bgColor}, ${bgGrad})`,
      }}
    >
      <div className="logo" />
      {user && <h4 className="welcome">{user.name}</h4>}
      <button
        className="btn-auth"
        onClick={() => (user ? onLogout() : onLogin(FAKE_USER))}
      >
        {user ? 'Sign-out' : 'Sign-in'}
      </button>
    </header>
  );
}

function Body({ user }): any {
  const body = useSection(homepage.body);
  return body.children.reduce<any[]>((children, exp) => {
    // skip any children that are off
    if (!exp.enabled) return children;

    switch (exp.kind) {
      case body.supported.Hero:
        const { source } = exp.data;
        children.push(<img key={exp.id} className="hero" src={source} />);
        break;
      case body.supported.Banner:
        const { label } = exp.data;
        const text = label || exp.defaultData.label!;
        children.push(
          <div key={exp.id} className="banner">
            <button
              className="btn-secondary"
              onClick={() => exp.track('item/clicked')}
            >
              {text}
            </button>
          </div>
        );
        break;
    }
    return children;
  }, []);
}

render(<App />, document.getElementById('root'));
