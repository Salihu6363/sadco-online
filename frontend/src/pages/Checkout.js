import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';

const Checkout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [total, setTotal] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Nigeria'
  });

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
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return Number(price).toLocaleString();
  };

  const handlePaymentSelect = (method) => {
    setPaymentMethod(method);
    setShowBankDetails(method === 'Bank Transfer');
  };

  const handleAddressChange = (e) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value
    });
  };

  const handlePlaceOrder = async () => {
    if (!paymentMethod) {
      alert('Please select a payment method');
      return;
    }

    if (!address.street || !address.city || !address.state) {
      alert('Please fill in your shipping address');
      return;
    }

    try {
      const orderData = {
        items: cartItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        })),
        shippingAddress: address,
        paymentMethod: paymentMethod
      };

      await API.post('/orders', orderData);
      await API.delete('/cart/clear');
      
      setOrderPlaced(true);
      alert('✅ Order placed successfully!');
      
      setTimeout(() => {
        navigate('/orders');
      }, 3000);
      
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Error placing order: ' + (error.response?.data?.message || 'Unknown error'));
    }
  };

  if (loading) {
    return React.createElement('div', { style: { color: '#fff', textAlign: 'center', padding: '50px' } }, 'Loading...');
  }

  if (cartItems.length === 0 && !orderPlaced) {
    return React.createElement(
      'div',
      { style: { maxWidth: '800px', margin: '0 auto', padding: '20px', background: '#0a0a1a', minHeight: '80vh' } },
      React.createElement(
        'div',
        { style: { background: '#16213e', borderRadius: '12px', padding: '20px' } },
        React.createElement('h2', { style: { color: '#fff' } }, '🛒 Your Cart is Empty'),
        React.createElement(
          'div',
          { style: { textAlign: 'center', padding: '40px 20px' } },
          React.createElement('span', { style: { fontSize: '64px', display: 'block' } }, '🛒'),
          React.createElement('p', { style: { color: '#888', fontSize: '18px' } }, 'Add some products to your cart before checking out'),
          React.createElement(Link, { to: '/market', style: { display: 'inline-block', padding: '10px 30px', background: '#e94560', color: '#fff', borderRadius: '8px', textDecoration: 'none' } }, 'Continue Shopping')
        )
      )
    );
  }

  if (orderPlaced) {
    return React.createElement(
      'div',
      { style: { maxWidth: '800px', margin: '0 auto', padding: '20px', background: '#0a0a1a', minHeight: '80vh' } },
      React.createElement(
        'div',
        { style: { background: '#16213e', borderRadius: '12px', padding: '40px', textAlign: 'center' } },
        React.createElement('span', { style: { fontSize: '64px', display: 'block' } }, '✅'),
        React.createElement('h2', { style: { color: '#10b981' } }, 'Order Placed Successfully!'),
        React.createElement('p', { style: { color: '#888', fontSize: '16px' } }, 'Your order has been received and is being processed.'),
        React.createElement(Link, { to: '/orders', style: { display: 'inline-block', padding: '10px 30px', background: '#e94560', color: '#fff', borderRadius: '8px', textDecoration: 'none', marginTop: '20px' } }, 'View My Orders')
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
        React.createElement('h2', { style: { color: '#fff', margin: 0 } }, '💳 Checkout'),
        React.createElement('span', { style: { color: '#888' } }, cartItems.length, ' items')
      ),
      
      React.createElement(
        'div',
        { style: { padding: '16px 20px', borderBottom: '1px solid #2a2a4e' } },
        React.createElement('h3', { style: { color: '#fff', marginBottom: '12px' } }, 'Order Summary'),
        cartItems.map((item) =>
          React.createElement(
            'div',
            { key: item.productId, style: { display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #2a2a4e' } },
            React.createElement('span', { style: { color: '#fff' } }, item.name, ' × ', item.quantity),
            React.createElement('span', { style: { color: '#e94560' } }, '₦', formatPrice(item.price * item.quantity))
          )
        ),
        React.createElement(
          'div',
          { style: { display: 'flex', justifyContent: 'space-between', padding: '10px 0', marginTop: '8px' } },
          React.createElement('span', { style: { color: '#fff', fontWeight: 'bold' } }, 'Total:'),
          React.createElement('span', { style: { color: '#e94560', fontSize: '20px', fontWeight: 'bold' } }, '₦', formatPrice(total))
        )
      ),

      React.createElement(
        'div',
        { style: { padding: '16px 20px', borderBottom: '1px solid #2a2a4e' } },
        React.createElement('h3', { style: { color: '#fff', marginBottom: '12px' } }, 'Shipping Address'),
        React.createElement(
          'div',
          { style: { display: 'flex', flexDirection: 'column', gap: '10px' } },
          React.createElement('input', {
            type: 'text',
            name: 'street',
            placeholder: 'Street Address',
            value: address.street,
            onChange: handleAddressChange,
            style: { padding: '10px', borderRadius: '6px', border: '1px solid #2a2a4e', background: '#0a0a1a', color: '#fff' }
          }),
          React.createElement(
            'div',
            { style: { display: 'flex', gap: '10px' } },
            React.createElement('input', {
              type: 'text',
              name: 'city',
              placeholder: 'City',
              value: address.city,
              onChange: handleAddressChange,
              style: { flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #2a2a4e', background: '#0a0a1a', color: '#fff' }
            }),
            React.createElement('input', {
              type: 'text',
              name: 'state',
              placeholder: 'State',
              value: address.state,
              onChange: handleAddressChange,
              style: { flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #2a2a4e', background: '#0a0a1a', color: '#fff' }
            })
          ),
          React.createElement('input', {
            type: 'text',
            name: 'zipCode',
            placeholder: 'ZIP Code',
            value: address.zipCode,
            onChange: handleAddressChange,
            style: { padding: '10px', borderRadius: '6px', border: '1px solid #2a2a4e', background: '#0a0a1a', color: '#fff' }
          })
        )
      ),

      React.createElement(
        'div',
        { style: { padding: '16px 20px', borderBottom: '1px solid #2a2a4e' } },
        React.createElement('h3', { style: { color: '#fff', marginBottom: '12px' } }, 'Payment Method'),
        React.createElement(
          'div',
          { style: { display: 'flex', flexDirection: 'column', gap: '8px' } },
          React.createElement(
            'div',
            { 
              onClick: () => handlePaymentSelect('Paystack'), 
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
              onClick: () => handlePaymentSelect('Bank Transfer'), 
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
            { style: { background: 'rgba(16, 185, 129, 0.1)', border: '1px dashed #10b981', borderRadius: '6px', padding: '12px', color: '#fff' } },
            React.createElement('div', { style: { fontWeight: 'bold', color: '#10b981' } }, 'SADCO BANK DETAILS:'),
            React.createElement('div', null, 'Bank Name: ', React.createElement('b', null, 'Zenith Bank')),
            React.createElement('div', null, 'Account No: ', React.createElement('b', null, '1234567890')),
            React.createElement('div', null, 'Account Name: ', React.createElement('b', null, 'SADCO Ventures Ltd'))
          ),
          React.createElement(
            'div',
            { 
              onClick: () => handlePaymentSelect('Cash on Delivery'), 
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
        { style: { padding: '16px 20px', display: 'flex', gap: '12px' } },
        React.createElement(
          'button',
          { onClick: () => navigate('/cart'), style: { flex: 1, padding: '10px', background: 'transparent', color: '#888', border: '1px solid #2a2a4e', borderRadius: '8px', cursor: 'pointer' } },
          '← Back to Cart'
        ),
        React.createElement(
          'button',
          { onClick: handlePlaceOrder, style: { flex: 2, padding: '10px', background: '#e94560', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' } },
          '✅ Place Order'
        )
      )
    )
  );
};

export default Checkout;
