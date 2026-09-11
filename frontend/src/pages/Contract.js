import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';

const Contract = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [contracts, setContracts] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    serviceId: '',
    proposedBy: '',
    proposedEmail: '',
    proposedPhone: ''
  });

  useEffect(() => {
    if (user) {
      fetchContracts();
      fetchServices();
    } else {
      navigate('/login');
    }
  }, [user]);

  const fetchContracts = async () => {
    try {
      const response = await API.get('/contracts/my-contracts');
      setContracts(response.data.contracts || []);
    } catch (error) {
      console.error('Error fetching contracts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await API.get('/services');
      setServices(response.data.services || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/contracts', formData);
      alert('✅ Contract proposed successfully!');
      setShowForm(false);
      setFormData({
        title: '',
        description: '',
        budget: '',
        serviceId: '',
        proposedBy: '',
        proposedEmail: '',
        proposedPhone: ''
      });
      fetchContracts();
    } catch (error) {
      alert('Error proposing contract: ' + (error.response?.data?.message || 'Unknown error'));
    }
  };

  const priceInNaira = (price) => {
    const rate = 1600;
    return (price * rate).toLocaleString();
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return '#ffc107';
      case 'approved': return '#28a745';
      case 'rejected': return '#dc3545';
      case 'completed': return '#17a2b8';
      default: return '#6c757d';
    }
  };

  if (loading) {
    return React.createElement('div', { style: { color: '#fff', textAlign: 'center', padding: '50px' } }, 'Loading...');
  }

  return React.createElement(
    'div',
    { style: { maxWidth: '900px', margin: '0 auto', padding: '20px', background: '#0a0a1a', minHeight: '80vh' } },
    React.createElement(
      'div',
      { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' } },
      React.createElement('h1', { style: { color: '#fff' } }, '📄 Contract Proposals'),
      React.createElement(
        'button',
        {
          onClick: () => setShowForm(!showForm),
          style: { padding: '10px 20px', background: '#e94560', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }
        },
        showForm ? '✕ Close' : '➕ New Contract'
      )
    ),

    // Contract Form
    showForm && React.createElement(
      'div',
      { style: { background: '#16213e', borderRadius: '12px', padding: '20px', marginBottom: '20px' } },
      React.createElement('h3', { style: { color: '#fff', marginBottom: '15px' } }, 'Propose New Contract'),
      React.createElement(
        'form',
        { onSubmit: handleSubmit, style: { display: 'flex', flexDirection: 'column', gap: '12px' } },
        React.createElement('input', {
          type: 'text',
          name: 'title',
          placeholder: 'Contract Title',
          value: formData.title,
          onChange: handleChange,
          style: { padding: '10px', borderRadius: '6px', border: '1px solid #2a2a4e', background: '#0a0a1a', color: '#fff' },
          required: true
        }),
        React.createElement('textarea', {
          name: 'description',
          placeholder: 'Contract Description',
          value: formData.description,
          onChange: handleChange,
          style: { padding: '10px', borderRadius: '6px', border: '1px solid #2a2a4e', background: '#0a0a1a', color: '#fff', minHeight: '100px' },
          required: true
        }),
        React.createElement(
          'div',
          { style: { display: 'flex', gap: '12px' } },
          React.createElement('input', {
            type: 'number',
            name: 'budget',
            placeholder: 'Budget (₦)',
            value: formData.budget,
            onChange: handleChange,
            style: { flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #2a2a4e', background: '#0a0a1a', color: '#fff' },
            required: true
          }),
          React.createElement(
            'select',
            {
              name: 'serviceId',
              value: formData.serviceId,
              onChange: handleChange,
              style: { flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #2a2a4e', background: '#0a0a1a', color: '#fff' }
            },
            React.createElement('option', { value: '' }, 'Select Service (Optional)'),
            services.map((service) =>
              React.createElement('option', { key: service.id, value: service.id }, service.name)
            )
          )
        ),
        React.createElement(
          'div',
          { style: { display: 'flex', gap: '12px' } },
          React.createElement('input', {
            type: 'text',
            name: 'proposedBy',
            placeholder: 'Your Name',
            value: formData.proposedBy || user?.name || '',
            onChange: handleChange,
            style: { flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #2a2a4e', background: '#0a0a1a', color: '#fff' },
            required: true
          }),
          React.createElement('input', {
            type: 'email',
            name: 'proposedEmail',
            placeholder: 'Your Email',
            value: formData.proposedEmail || user?.email || '',
            onChange: handleChange,
            style: { flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #2a2a4e', background: '#0a0a1a', color: '#fff' },
            required: true
          })
        ),
        React.createElement('input', {
          type: 'tel',
          name: 'proposedPhone',
          placeholder: 'Phone Number',
          value: formData.proposedPhone || user?.phone || '',
          onChange: handleChange,
          style: { padding: '10px', borderRadius: '6px', border: '1px solid #2a2a4e', background: '#0a0a1a', color: '#fff' },
          required: true
        }),
        React.createElement(
          'button',
          { type: 'submit', style: { padding: '12px', background: '#e94560', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' } },
          '✅ Submit Contract'
        )
      )
    ),

    // Contract List
    React.createElement(
      'div',
      { style: { display: 'flex', flexDirection: 'column', gap: '16px' } },
      contracts.length === 0 ? (
        React.createElement(
          'div',
          { style: { background: '#16213e', borderRadius: '12px', padding: '40px', textAlign: 'center' } },
          React.createElement('span', { style: { fontSize: '48px', display: 'block' } }, '📄'),
          React.createElement('p', { style: { color: '#888', fontSize: '18px' } }, 'No contract proposals yet'),
          React.createElement('p', { style: { color: '#555', fontSize: '14px' } }, 'Click "New Contract" to propose one')
        )
      ) : (
        contracts.map((contract) =>
          React.createElement(
            'div',
            { key: contract.id, style: { background: '#16213e', borderRadius: '12px', padding: '16px', border: '1px solid #2a2a4e' } },
            React.createElement(
              'div',
              { style: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' } },
              React.createElement('h3', { style: { color: '#fff', margin: 0 } }, contract.title),
              React.createElement(
                'span',
                { style: { color: getStatusColor(contract.status), fontWeight: 'bold', textTransform: 'capitalize' } },
                contract.status
              )
            ),
            React.createElement('p', { style: { color: '#888', marginBottom: '8px' } }, contract.description),
            React.createElement(
              'div',
              { style: { display: 'flex', justifyContent: 'space-between', fontSize: '14px' } },
              React.createElement(
                'span',
                { style: { color: '#e94560', fontWeight: 'bold' } },
                '₦' + priceInNaira(contract.budget)
              ),
              React.createElement(
                'span',
                { style: { color: '#555' } },
                'Proposed by: ', contract.proposedBy
              )
            ),
            React.createElement(
              'div',
              { style: { display: 'flex', gap: '8px', marginTop: '8px', fontSize: '12px', color: '#555' } },
              React.createElement('span', null, '📧 ', contract.proposedEmail),
              React.createElement('span', null, '📞 ', contract.proposedPhone)
            )
          )
        )
      )
    )
  );
};

export default Contract;
