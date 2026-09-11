import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await login(email, password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return React.createElement(
    'div',
    { style: styles.container },
    React.createElement(
      'div',
      { style: styles.card },
      React.createElement('h2', { style: styles.title }, 'Login'),
      error && React.createElement('div', { style: styles.error }, error),
      React.createElement(
        'form',
        { onSubmit: handleSubmit },
        React.createElement('input', {
          type: 'email',
          placeholder: 'Email',
          value: email,
          onChange: (e) => setEmail(e.target.value),
          style: styles.input,
          required: true
        }),
        React.createElement('input', {
          type: 'password',
          placeholder: 'Password',
          value: password,
          onChange: (e) => setPassword(e.target.value),
          style: styles.input,
          required: true
        }),
        React.createElement(
          'button',
          { type: 'submit', style: styles.button, disabled: loading },
          loading ? 'Loading...' : 'Login'
        )
      ),
      React.createElement(
        'p',
        { style: styles.link },
        "Don't have an account? ",
        React.createElement(Link, { to: '/register' }, 'Register')
      )
    )
  );
};

const styles = {
  container: {
    minHeight: '80vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#0a0a1a',
    padding: '20px'
  },
  card: {
    background: '#16213e',
    padding: '40px',
    borderRadius: '12px',
    width: '100%',
    maxWidth: '400px'
  },
  title: { color: '#fff', textAlign: 'center', marginBottom: '20px' },
  input: { width: '100%', padding: '12px', margin: '8px 0', borderRadius: '8px', border: 'none', background: '#0a0a1a', color: '#fff', fontSize: '16px' },
  button: { width: '100%', padding: '12px', background: '#e94560', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' },
  error: { background: '#ff4444', color: '#fff', padding: '10px', borderRadius: '8px', marginBottom: '10px' },
  link: { color: '#888', textAlign: 'center', marginTop: '15px' }
};

export default Login;
