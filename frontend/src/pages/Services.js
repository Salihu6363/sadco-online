import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await API.get('/services');
      const allServices = response.data.services || [];
      const filteredServices = allServices.filter(s => s.categoryId === 4);
      setServices(filteredServices);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return Number(price).toLocaleString();
  };

  if (loading) {
    return React.createElement('div', { style: styles.loading }, 'Loading services...');
  }

  return React.createElement(
    'div',
    { style: styles.container },
    React.createElement('h1', { style: styles.title }, '🛠️ Our Services'),
    React.createElement('p', { style: styles.subtitle }, 'Professional services offered by SADCO'),
    React.createElement(
      'div',
      { style: styles.grid },
      services.length === 0 ? (
        React.createElement('p', { style: styles.noServices }, 'No services available at the moment.')
      ) : (
        services.map((service) =>
          React.createElement(
            'div',
            { key: service.id, style: styles.card },
            React.createElement('div', { style: styles.iconBox }, '🛠️'),
            React.createElement('h3', { style: styles.serviceName }, service.name),
            React.createElement('p', { style: styles.serviceDesc }, service.description),
            React.createElement(
              'div',
              { style: styles.priceRow },
              React.createElement('span', { style: styles.price }, '₦' + formatPrice(service.price))
            ),
            React.createElement(
              'button',
              {
                onClick: () => navigate('/contract'),
                style: styles.contractBtn
              },
              '📄 Propose Contract'
            )
          )
        )
      )
    )
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    background: '#0a0a1a',
    minHeight: '80vh'
  },
  title: {
    color: '#fff',
    fontSize: '32px',
    marginBottom: '10px',
    textAlign: 'center'
  },
  subtitle: {
    color: '#888',
    fontSize: '18px',
    textAlign: 'center',
    marginBottom: '30px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px'
  },
  card: {
    background: '#16213e',
    borderRadius: '12px',
    padding: '20px',
    textAlign: 'center',
    transition: 'transform 0.3s'
  },
  iconBox: {
    fontSize: '48px',
    marginBottom: '10px'
  },
  serviceName: {
    color: '#fff',
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '8px'
  },
  serviceDesc: {
    color: '#888',
    fontSize: '14px',
    marginBottom: '12px',
    lineHeight: '1.6'
  },
  priceRow: {
    textAlign: 'center',
    marginBottom: '15px'
  },
  price: {
    color: '#e94560',
    fontSize: '22px',
    fontWeight: 'bold'
  },
  contractBtn: {
    width: '100%',
    padding: '10px',
    background: '#e94560',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  noServices: {
    color: '#888',
    textAlign: 'center',
    fontSize: '18px',
    gridColumn: '1 / -1',
    padding: '40px 0'
  },
  loading: {
    color: '#fff',
    textAlign: 'center',
    fontSize: '20px',
    marginTop: '50px'
  }
};

export default Services;
