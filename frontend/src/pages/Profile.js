import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    setFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || ''
    });
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await API.put('/auth/update', formData);
      setMessage('✅ Profile updated successfully!');
      // Update user in context
      logout();
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      setMessage('❌ Error updating profile: ' + (error.response?.data?.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return React.createElement(
      'div',
      { style: { maxWidth: '800px', margin: '0 auto', padding: '20px', background: '#0a0a1a', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' } },
      React.createElement(
        'div',
        { style: { background: '#16213e', borderRadius: '12px', padding: '40px', textAlign: 'center' } },
        React.createElement('span', { style: { fontSize: '48px', display: 'block' } }, '🔒'),
        React.createElement('p', { style: { color: '#888', fontSize: '18px' } }, 'Please login to view your profile'),
        React.createElement(Link, { to: '/login', style: { display: 'inline-block', padding: '10px 30px', background: '#e94560', color: '#fff', borderRadius: '8px', textDecoration: 'none' } }, 'Login')
      )
    );
  }

  return React.createElement(
    'div',
    { style: { maxWidth: '600px', margin: '0 auto', padding: '20px', background: '#0a0a1a', minHeight: '80vh' } },
    React.createElement(
      'div',
      { style: { background: '#16213e', borderRadius: '12px', overflow: 'hidden' } },
      React.createElement(
        'div',
        { style: { padding: '20px', borderBottom: '1px solid #2a2a4e', textAlign: 'center' } },
        React.createElement(
          'div',
          { style: { width: '80px', height: '80px', borderRadius: '50%', background: '#e94560', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', fontSize: '32px', fontWeight: 'bold', color: '#fff' } },
          user?.name?.charAt(0).toUpperCase() || 'U'
        ),
        React.createElement('h2', { style: { color: '#fff', margin: 0 } }, user?.name || 'User'),
        React.createElement('p', { style: { color: '#888', margin: '5px 0 0 0' } }, user?.email || '')
      ),
      
      React.createElement(
        'form',
        { onSubmit: handleSubmit, style: { padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' } },
        message && React.createElement(
          'div',
          { style: { padding: '10px', borderRadius: '6px', background: message.includes('✅') ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', border: message.includes('✅') ? '1px solid #10b981' : '1px solid #ef4444', color: message.includes('✅') ? '#10b981' : '#ef4444', textAlign: 'center' } },
          message
        ),
        React.createElement(
          'div',
          null,
          React.createElement('label', { style: { color: '#888', fontSize: '14px', display: 'block', marginBottom: '4px' } }, 'Full Name'),
          React.createElement('input', {
            type: 'text',
            name: 'name',
            value: formData.name,
            onChange: handleChange,
            style: { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #2a2a4e', background: '#0a0a1a', color: '#fff', boxSizing: 'border-box' },
            required: true
          })
        ),
        React.createElement(
          'div',
          null,
          React.createElement('label', { style: { color: '#888', fontSize: '14px', display: 'block', marginBottom: '4px' } }, 'Email Address'),
          React.createElement('input', {
            type: 'email',
            name: 'email',
            value: formData.email,
            onChange: handleChange,
            style: { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #2a2a4e', background: '#0a0a1a', color: '#fff', boxSizing: 'border-box' },
            required: true
          })
        ),
        React.createElement(
          'div',
          null,
          React.createElement('label', { style: { color: '#888', fontSize: '14px', display: 'block', marginBottom: '4px' } }, 'Phone Number'),
          React.createElement('input', {
            type: 'tel',
            name: 'phone',
            value: formData.phone,
            onChange: handleChange,
            style: { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #2a2a4e', background: '#0a0a1a', color: '#fff', boxSizing: 'border-box' }
          })
        ),
        React.createElement(
          'div',
          null,
          React.createElement('label', { style: { color: '#888', fontSize: '14px', display: 'block', marginBottom: '4px' } }, 'Address'),
          React.createElement('textarea', {
            name: 'address',
            value: formData.address,
            onChange: handleChange,
            style: { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #2a2a4e', background: '#0a0a1a', color: '#fff', boxSizing: 'border-box', minHeight: '80px' }
          })
        ),
        React.createElement(
          'button',
          { type: 'submit', style: { padding: '12px', background: '#e94560', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }, disabled: loading },
          loading ? 'Updating...' : '💾 Update Profile'
        )
      )
    )
  );
};

export default Profile;
