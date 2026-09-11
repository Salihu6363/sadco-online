import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return React.createElement(
    'nav',
    { style: { background: '#1a1a2e', padding: '15px 20px', display: 'flex', gap: '20px' } },
    React.createElement(Link, { to: '/', style: { color: '#fff' } }, 'Home'),
    React.createElement(Link, { to: '/login', style: { color: '#fff' } }, 'Login'),
    React.createElement(Link, { to: '/register', style: { color: '#fff' } }, 'Register')
  );
};

export default Navbar;
