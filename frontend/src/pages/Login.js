import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginType, setLoginType] = useState('user');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const result = await login(email, password);
    if (result.success) {
      const user = result.user;
      
      // Admin login check
      if (loginType === 'admin') {
        if (user.role === 'admin' || user.role === 'super_admin') {
          navigate('/admin');
        } else {
          setError('❌ This account is not an admin. Please use Customer Login.');
          setLoading(false);
          return;
        }
      } 
      // User login check
      else {
        if (user.role === 'admin' || user.role === 'super_admin') {
          setError('❌ Admin accounts must use Admin Login.');
          setLoading(false);
          return;
        } else {
          navigate('/');
        }
      }
    } else {
      setError(result.error || 'Login failed. Please check your credentials.');
    }
    setLoading(false);
  };

  return React.createElement(
    'div',
    { style: styles.container },
    React.createElement(
      'div',
      { style: styles.card },
      React.createElement('h2', { style: { ...styles.title, color: loginType === 'admin' ? '#dc3545' : '#00a082' } }, 
        loginType === 'admin' ? '🔒 Admin Login' : '👤 Customer Login'
      ),
      React.createElement(
        'div',
        { style: { display: 'flex', gap: '10px', marginBottom: '20px', justifyContent: 'center' } },
        React.createElement(
          'button',
          {
            onClick: () => setLoginType('user'),
            style: {
              padding: '8px 20px',
              borderRadius: '20px',
              border: 'none',
              background: loginType === 'user' ? '#00a082' : '#2a2a4e',
              color: '#fff',
              cursor: 'pointer',
              fontWeight: 'bold'
            }
          },
          '👤 Customer'
        ),
        React.createElement(
          'button',
          {
            onClick: () => setLoginType('admin'),
            style: {
              padding: '8px 20px',
              borderRadius: '20px',
              border: 'none',
              background: loginType === 'admin' ? '#dc3545' : '#2a2a4e',
              color: '#fff',
              cursor: 'pointer',
              fontWeight: 'bold'
            }
          },
          '🔒 Admin'
        )
      ),
      error && React.createElement('div', { style: styles.error }, error),
      React.createElement(
        'form',
        { onSubmit: handleSubmit },
        React.createElement('input', {
          type: 'email',
          placeholder: 'Email Address',
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
          {
            type: 'submit',
            style: { ...styles.button, background: loginType === 'admin' ? '#dc3545' : '#00a082' },
            disabled: loading
          },
          loading ? 'Loading...' : (loginType === 'admin' ? '🔒 Admin Login' : '👤 Customer Login')
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
  title: {
    textAlign: 'center',
    marginBottom: '10px',
    fontSize: '22px'
  },
  input: {
    width: '100%',
    padding: '12px',
    margin: '8px 0',
    borderRadius: '8px',
    border: 'none',
    background: '#0a0a1a',
    color: '#fff',
    fontSize: '16px'
  },
  button: {
    width: '100%',
    padding: '12px',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '10px'
  },
  error: {
    background: '#ff4444',
    color: '#fff',
    padding: '10px',
    borderRadius: '8px',
    marginBottom: '10px',
    textAlign: 'center'
  },
  link: {
    color: '#888',
    textAlign: 'center',
    marginTop: '15px'
  }
};

export default Login;
