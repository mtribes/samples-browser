import React, { useState } from 'react';
import { render } from 'react-dom';

// fake known user we'll use when signed in
const FAKE_USER = {
  id: '2id2f459d2s5',
  name: 'Olivia',
  subscription: 'gold',
};

function App() {
  const [user, setUser] = useState(undefined);

  function onLogin(member) {
    setUser(member);
  }
  function onSignOut() {
    setUser(undefined);
  }

  return (
    <>
      <Header user={user} onLogin={onLogin} onSignOut={onSignOut} />
      <main>
        <Body user={user} />
      </main>
    </>
  );
}

function Header({ user, onLogin, onSignOut }): any {
  return (
    <header className="header">
      <div className="logo" />
      {user && <h4 className="welcome">{user.name}</h4>}
      <button
        className="btn-auth"
        onClick={() => (user ? onSignOut() : onLogin(FAKE_USER))}
      >
        {user ? 'Sign-out' : 'Sign-in'}
      </button>
    </header>
  );
}

function Body({ user }): any {
  // present a different hero image for anonymous and known user
  const heroImageUrl = user
    ? 'https://images.unsplash.com/photo-1511988617509-a57c8a288659?&q=80&fm=jpg&crop=entropy&cs=tinysrgb&dl=helena-lopes-e3OUQGT9bWU-unsplash.jpg&w=800'
    : 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&fm=jpg&crop=entropy&cs=tinysrgb&dl=simon-maage-tXiMrX3Gc-g-unsplash.jpg&w=800';

  const bannerMsg = user ? 'Member' : 'Visitor';

  return (
    <>
      {/* HERO */}
      <img className="hero" src={heroImageUrl} />

      {/* BANNER */}
      <div className="banner">
        <button className="btn-secondary">{bannerMsg}</button>
      </div>
    </>
  );
}

render(<App />, document.getElementById('root'));
