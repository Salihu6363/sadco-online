import React from 'react';

const Home = () => {
  return React.createElement(
    'div',
    { style: { color: '#fff', textAlign: 'center', padding: '50px' } },
    React.createElement('h1', { style: { color: '#e94560' } }, 'SADCO Online'),
    React.createElement('p', null, 'Welcome to SADCO Online!')
  );
};

export default Home;
