import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, cartCount } = useAuth();
  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setShowSidebar(false);
  };

  // Check if user is admin
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';

  return React.createElement(
    React.Fragment,
    null,
    React.createElement(
      'nav',
      { style: styles.nav },
      React.createElement(
        'div',
        { style: styles.container },
        React.createElement(
          'div',
          { style: styles.left },
          React.createElement(Link, { to: isAdmin ? '/admin' : '/', style: styles.logo }, 'SADCO')
        ),
        React.createElement(
          'div',
          { style: styles.center },
          user && !isAdmin && React.createElement(
            React.Fragment,
            null,
            React.createElement(Link, { to: '/', style: styles.homeBtn }, '🏠 Home'),
            React.createElement(Link, { to: '/market', style: styles.navLink }, 'Market'),
            React.createElement(Link, { to: '/services', style: styles.navLink }, 'Services')
          ),
          user && isAdmin && React.createElement(
            React.Fragment,
            null,
            React.createElement(Link, { to: '/admin', style: styles.homeBtn }, '⚙️ Dashboard')
          )
        ),
        React.createElement(
          'div',
          { style: styles.right },
          user && !isAdmin && React.createElement(
            Link,
            { to: '/cart', style: styles.cartIcon },
            '🛒 ',
            React.createElement('span', { style: styles.cartBadge }, cartCount)
          ),
          user && React.createElement(
            'button',
            { onClick: () => setShowSidebar(!showSidebar), style: styles.profileBtn },
            React.createElement(
              'span',
              { style: styles.avatarSmall },
              user?.name?.charAt(0).toUpperCase() || 'U'
            )
          )
        )
      )
    ),
    showSidebar &&
      React.createElement(
        'div',
        { style: styles.sidebar },
        React.createElement(
          'div',
          { style: styles.profile },
          React.createElement('div', { style: styles.avatar }, user?.name?.charAt(0).toUpperCase() || 'U'),
          React.createElement('div', { style: styles.name }, user?.name || 'Guest'),
          React.createElement('div', { style: styles.email }, user?.email || '')
        ),
        !isAdmin && React.createElement(Link, { to: '/', style: styles.menuItem, onClick: () => setShowSidebar(false) }, '🏠 Home'),
        !isAdmin && React.createElement(Link, { to: '/market', style: styles.menuItem, onClick: () => setShowSidebar(false) }, '🏪 Market'),
        !isAdmin && React.createElement(Link, { to: '/services', style: styles.menuItem, onClick: () => setShowSidebar(false) }, '🛠️ Services'),
        !isAdmin && React.createElement(Link, { to: '/chat', style: styles.menuItem, onClick: () => setShowSidebar(false) }, '💬 Chat'),
        !isAdmin && React.createElement(Link, { to: '/orders', style: styles.menuItem, onClick: () => setShowSidebar(false) }, '📦 My Orders'),
        !isAdmin && React.createElement(Link, { to: '/profile', style: styles.menuItem, onClick: () => setShowSidebar(false) }, '👤 Profile'),
        isAdmin && React.createElement(Link, { to: '/admin', style: styles.menuItem, onClick: () => setShowSidebar(false) }, '⚙️ Dashboard'),
        React.createElement(
          'button',
          { onClick: handleLogout, style: styles.logoutBtn },
          '🚪 Logout'
        )
      )
  );
};

const styles = {
  nav: {
    background: '#1a1a2e',
    padding: '12px 20px',
    borderBottom: '1px solid #2a2a4e',
    position: 'sticky',
    top: 0,
    zIndex: 100
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%'
  },
  left: { display: 'flex', alignItems: 'center', minWidth: '80px' },
  center: { display: 'flex', alignItems: 'center', gap: '20px', flex: 1, justifyContent: 'center' },
  right: { display: 'flex', alignItems: 'center', gap: '15px', minWidth: '80px', justifyContent: 'flex-end' },
  logo: { color: '#e94560', fontSize: '20px', fontWeight: 'bold', textDecoration: 'none', letterSpacing: '2px' },
  homeBtn: { color: '#fff', textDecoration: 'none', fontSize: '14px', padding: '5px 12px', borderRadius: '20px', background: 'rgba(233, 69, 96, 0.2)', border: '1px solid #e94560' },
  navLink: { color: '#888', textDecoration: 'none', fontSize: '14px', padding: '5px 12px', borderRadius: '20px' },
  cartIcon: { color: '#fff', textDecoration: 'none', fontSize: '18px', position: 'relative' },
  cartBadge: { background: '#e94560', color: '#fff', borderRadius: '50%', padding: '1px 7px', fontSize: '11px', fontWeight: 'bold', marginLeft: '3px' },
  profileBtn: { background: 'none', border: 'none', cursor: 'pointer', padding: 0 },
  avatarSmall: { width: '35px', height: '35px', borderRadius: '50%', background: '#e94560', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 'bold' },
  sidebar: { position: 'fixed', top: 0, right: 0, width: '280px', height: '100%', background: '#16213e', zIndex: 1000, padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto' },
  profile: { textAlign: 'center', padding: '20px 0', borderBottom: '1px solid #2a2a4e', marginBottom: '15px' },
  avatar: { width: '60px', height: '60px', borderRadius: '50%', background: '#e94560', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', fontWeight: 'bold', margin: '0 auto 10px' },
  name: { color: '#fff', fontSize: '18px', fontWeight: 'bold' },
  email: { color: '#888', fontSize: '14px' },
  menuItem: { color: '#fff', textDecoration: 'none', padding: '12px 15px', borderRadius: '8px', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '10px' },
  logoutBtn: { color: '#e94560', background: 'none', border: 'none', padding: '12px 15px', borderRadius: '8px', fontSize: '16px', cursor: 'pointer', textAlign: 'left', marginTop: 'auto', borderTop: '1px solid #2a2a4e', paddingTop: '15px', display: 'flex', alignItems: 'center', gap: '10px' }
};

export default Navbar;
