import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';

const Orders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchOrders();
    } else {
      navigate('/login');
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await API.get('/orders/my-orders');
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return Number(price).toLocaleString();
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return '#ffc107';
      case 'processing': return '#17a2b8';
      case 'shipped': return '#007bff';
      case 'delivered': return '#28a745';
      case 'cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  };

  if (loading) {
    return React.createElement('div', { style: { color: '#fff', textAlign: 'center', padding: '50px' } }, 'Loading your orders...');
  }

  if (orders.length === 0) {
    return React.createElement(
      'div',
      { style: { maxWidth: '800px', margin: '0 auto', padding: '20px', background: '#0a0a1a', minHeight: '80vh' } },
      React.createElement(
        'div',
        { style: { background: '#16213e', borderRadius: '12px', padding: '20px' } },
        React.createElement('h2', { style: { color: '#fff' } }, '📦 My Orders'),
        React.createElement(
          'div',
          { style: { textAlign: 'center', padding: '60px 20px' } },
          React.createElement('span', { style: { fontSize: '64px', display: 'block' } }, '📦'),
          React.createElement('p', { style: { color: '#888', fontSize: '18px' } }, 'You have no orders yet'),
          React.createElement(Link, { to: '/market', style: { display: 'inline-block', padding: '10px 30px', background: '#e94560', color: '#fff', borderRadius: '8px', textDecoration: 'none' } }, 'Start Shopping')
        )
      )
    );
  }

  return React.createElement(
    'div',
    { style: { maxWidth: '800px', margin: '0 auto', padding: '20px', background: '#0a0a1a', minHeight: '80vh' } },
    React.createElement(
      'div',
      { style: { background: '#16213e', borderRadius: '12px', overflow: 'hidden' } },
      React.createElement(
        'div',
        { style: { padding: '16px 20px', borderBottom: '1px solid #2a2a4e' } },
        React.createElement('h2', { style: { color: '#fff', margin: 0 } }, '📦 My Orders')
      ),
      React.createElement(
        'div',
        { style: { padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' } },
        orders.map((order) =>
          React.createElement(
            'div',
            { key: order.id, style: { background: '#0a0a1a', borderRadius: '8px', padding: '16px', border: '1px solid #2a2a4e' } },
            React.createElement(
              'div',
              { style: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' } },
              React.createElement('span', { style: { color: '#e94560', fontWeight: 'bold' } }, '#', order.orderNumber || order.id),
              React.createElement(
                'span',
                { style: { color: getStatusColor(order.status), fontWeight: 'bold', textTransform: 'capitalize' } },
                order.status
              )
            ),
            React.createElement(
              'div',
              { style: { borderBottom: '1px solid #2a2a4e', paddingBottom: '8px', marginBottom: '8px' } },
              (order.orderItems || []).map((item, idx) =>
                React.createElement(
                  'div',
                  { key: idx, style: { display: 'flex', justifyContent: 'space-between', padding: '4px 0' } },
                  React.createElement('span', { style: { color: '#fff' } }, item.name, ' × ', item.quantity),
                  React.createElement('span', { style: { color: '#e94560' } }, '₦', formatPrice(item.price * item.quantity))
                )
              )
            ),
            React.createElement(
              'div',
              { style: { display: 'flex', justifyContent: 'space-between', marginTop: '8px' } },
              React.createElement(
                'div',
                null,
                React.createElement('span', { style: { color: '#888' } }, 'Payment: '),
                React.createElement('span', { style: { color: '#fff' } }, order.paymentMethod || 'N/A')
              ),
              React.createElement(
                'span',
                { style: { color: '#e94560', fontSize: '18px', fontWeight: 'bold' } },
                '₦', formatPrice(order.totalPrice)
              )
            )
          )
        )
      )
    )
  );
};

export default Orders;
