import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';

const Cart = () => {
  const { user, fetchCartCount } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [showBankDetails, setShowBankDetails] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      navigate('/login');
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await API.get('/cart');
      const cartData = response.data.cart || {};
      const items = cartData.items || [];
      setCartItems(items);
      setTotal(cartData.totalPrice || 0);
      setTotalItems(cartData.totalQuantity || 0);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, change) => {
    try {
      const item = cartItems.find(i => i.productId === productId);
      if (!item) return;
      
      const newQuantity = item.quantity + change;
      if (newQuantity <= 0) {
        await API.delete(`/cart/remove/${productId}`);
      } else {
        await API.post('/cart/add', { productId, quantity: change });
      }
      await fetchCart();
      await fetchCartCount();
    } catch (error) {
      alert('Error updating cart');
    }
  };

  const clearCart = async () => {
    if (!confirm('Clear your cart?')) return;
    try {
      await API.delete('/cart/clear');
      await fetchCart();
      await fetchCartCount();
    } catch (error) {
      alert('Error clearing cart');
    }
  };

  const formatPrice = (price) => {
    return Number(price).toLocaleString();
  };

  const handlePaymentSelect = (method) => {
    setPaymentMethod(method);
    setShowBankDetails(method === 'Bank Transfer');
  };

  const handlePlaceOrder = async () => {
    if (!paymentMethod) {
      alert('Please select a payment method');
      return;
    }
    try {
      const orderData = {
        items: cartItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        })),
        shippingAddress: {
          street: 'Customer Address',
          city: 'Lagos',
          state: 'Lagos',
          zipCode: '100001',
          country: 'Nigeria'
        },
        paymentMethod: paymentMethod
      };
      await API.post('/orders', orderData);
      await API.delete('/cart/clear');
      await fetchCart();
      await fetchCartCount();
      alert('✅ Order placed successfully!');
      navigate('/orders');
    } catch (error) {
      alert('Error placing order: ' + (error.response?.data?.message || 'Unknown error'));
    }
  };

  if (loading) {
    return React.createElement('div', { style: { color: '#fff', textAlign: 'center', padding: '50px' } }, 'Loading your cart...');
  }

  if (cartItems.length === 0) {
    return React.createElement(
      'div',
      { style: { maxWidth: '800px', margin: '0 auto', padding: '20px', background: '#0a0a1a', minHeight: '80vh' } },
      React.createElement(
        'div',
        { style: { background: '#16213e', borderRadius: '12px', padding: '20px' } },
        React.createElement('h2', { style: { color: '#fff' } }, '🛒 Your Shopping Cart'),
        React.createElement(
          'div',
          { style: { textAlign: 'center', padding: '60px 20px' } },
          React.createElement('span', { style: { fontSize: '64px', display: 'block' } }, '🛒'),
          React.createElement('p', { style: { color: '#888', fontSize: '18px' } }, 'Your cart is empty'),
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
        { style: { padding: '16px 20px', borderBottom: '1px solid #2a2a4e', display: 'flex', justifyContent: 'space-between' } },
        React.createElement('h2', { style: { color: '#fff', margin: 0 } }, '🛒 Your Shopping Cart'),
        React.createElement('span', { style: { color: '#888' } }, cartItems.length, ' items')
      ),
      React.createElement(
        'div',
        { style: { padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' } },
        cartItems.map(function(item) {
          return React.createElement(
            'div',
            { key: item.productId, style: { display: 'flex', alignItems: 'center', gap: '16px', padding: '12px', background: '#0a0a1a', borderRadius: '8px' } },
            React.createElement(
              'div',
              { style: { width: '60px', height: '60px', background: '#2a2a4e', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' } },
              React.createElement('span', { style: { fontSize: '32px' } }, '📦')
            ),
            React.createElement(
              'div',
              { style: { flex: 1 } },
              React.createElement('h4', { style: { color: '#fff', margin: 0 } }, item.name || 'Product'),
              React.createElement('span', { style: { color: '#e94560', fontWeight: 'bold' } }, '₦' + formatPrice(item.price || 0))
            ),
            React.createElement(
              'div',
              { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
              React.createElement('button', { 
                onClick: function() { updateQuantity(item.productId, -1); }, 
                style: { width: '30px', height: '30px', borderRadius: '50%', background: '#2a2a4e', color: '#fff', border: 'none', fontSize: '18px', cursor: 'pointer' } 
              }, '−'),
              React.createElement('span', { style: { color: '#fff', fontSize: '16px', fontWeight: 'bold' } }, item.quantity),
              React.createElement('button', { 
                onClick: function() { updateQuantity(item.productId, 1); }, 
                style: { width: '30px', height: '30px', borderRadius: '50%', background: '#2a2a4e', color: '#fff', border: 'none', fontSize: '18px', cursor: 'pointer' } 
              }, '+')
            )
          );
        })
      ),
      React.createElement(
        'div',
        { style: { padding: '16px 20px', borderTop: '1px solid #2a2a4e', background: '#0a0a1a' } },
        React.createElement(
          'div',
          { style: { display: 'flex', justifyContent: 'space-between', padding: '6px 0' } },
          React.createElement('span', { style: { color: '#888' } }, 'Total Items:'),
          React.createElement('span', { style: { color: '#fff' } }, totalItems)
        ),
        React.createElement(
          'div',
          { style: { display: 'flex', justifyContent: 'space-between', padding: '6px 0' } },
          React.createElement('span', { style: { color: '#888' } }, 'Subtotal:'),
          React.createElement('span', { style: { color: '#e94560', fontSize: '20px', fontWeight: 'bold' } }, '₦' + formatPrice(total))
        ),
        React.createElement(
          'div',
          { style: { marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #2a2a4e' } },
          React.createElement('h4', { style: { color: '#fff' } }, 'Select Payment Method:'),
          React.createElement(
            'div',
            { style: { display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' } },
            React.createElement(
              'div',
              { 
                onClick: function() { handlePaymentSelect('Paystack'); }, 
                style: { border: paymentMethod === 'Paystack' ? '2px solid #e94560' : '2px solid #2a2a4e', borderRadius: '8px', padding: '12px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' } 
              },
              React.createElement('input', { type: 'radio', checked: paymentMethod === 'Paystack', readOnly: true }),
              React.createElement(
                'div',
                null,
                React.createElement('div', { style: { color: '#fff', fontWeight: 'bold' } }, '💳 Paystack'),
                React.createElement('div', { style: { color: '#888', fontSize: '12px' } }, 'Pay with card or bank transfer')
              )
            ),
            React.createElement(
              'div',
              { 
                onClick: function() { handlePaymentSelect('Bank Transfer'); }, 
                style: { border: paymentMethod === 'Bank Transfer' ? '2px solid #e94560' : '2px solid #2a2a4e', borderRadius: '8px', padding: '12px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' } 
              },
              React.createElement('input', { type: 'radio', checked: paymentMethod === 'Bank Transfer', readOnly: true }),
              React.createElement(
                'div',
                null,
                React.createElement('div', { style: { color: '#fff', fontWeight: 'bold' } }, '🏦 Bank Transfer'),
                React.createElement('div', { style: { color: '#888', fontSize: '12px' } }, 'Pay via SADCO corporate account')
              )
            ),
            showBankDetails && React.createElement(
              'div',
              { style: { background: 'rgba(16, 185, 129, 0.1)', border: '1px dashed #10b981', borderRadius: '6px', padding: '12px', marginTop: '-4px', marginBottom: '4px', color: '#fff' } },
              React.createElement('div', { style: { fontWeight: 'bold', color: '#10b981' } }, 'SADCO BANK DETAILS:'),
              React.createElement('div', null, 'Bank Name: ', React.createElement('b', null, 'Zenith Bank')),
              React.createElement('div', null, 'Account No: ', React.createElement('b', null, '1234567890')),
              React.createElement('div', null, 'Account Name: ', React.createElement('b', null, 'SADCO Ventures Ltd'))
            ),
            React.createElement(
              'div',
              { 
                onClick: function() { handlePaymentSelect('Cash on Delivery'); }, 
                style: { border: paymentMethod === 'Cash on Delivery' ? '2px solid #e94560' : '2px solid #2a2a4e', borderRadius: '8px', padding: '12px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' } 
              },
              React.createElement('input', { type: 'radio', checked: paymentMethod === 'Cash on Delivery', readOnly: true }),
              React.createElement(
                'div',
                null,
                React.createElement('div', { style: { color: '#fff', fontWeight: 'bold' } }, '💵 Cash on Delivery'),
                React.createElement('div', { style: { color: '#888', fontSize: '12px' } }, 'Pay with cash during drop-off')
              )
            )
          )
        ),
        React.createElement(
          'div',
          { style: { display: 'flex', gap: '12px', marginTop: '16px' } },
          React.createElement('button', { 
            onClick: clearCart, 
            style: { flex: 1, padding: '10px', background: 'transparent', color: '#ff4444', border: '1px solid #ff4444', borderRadius: '8px', cursor: 'pointer' } 
          }, '🗑️ Clear Cart'),
          React.createElement('button', { 
            onClick: handlePlaceOrder, 
            style: { flex: 2, padding: '10px', background: '#e94560', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' } 
          }, '✅ Place Order')
        )
      )
    )
  );
};

export default Cart;
