import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../utils/api';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    totalServices: 0,
    totalContracts: 0,
    unreadMessages: 0
  });
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    discountPrice: '',
    stock: '',
    categoryId: '',
    isFeatured: false,
    unit: 'piece'
  });
  const [newService, setNewService] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '4',
    isActive: true
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingService, setEditingService] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'admin' && user.role !== 'super_admin') {
      navigate('/');
      return;
    }
    fetchAllData();
  }, [user]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [
        statsRes, ordersRes, productsRes, servicesRes, usersRes, messagesRes, contractsRes, categoriesRes
      ] = await Promise.all([
        API.get('/admin/stats'),
        API.get('/orders'),
        API.get('/products'),
        API.get('/services'),
        API.get('/auth/users'),
        API.get('/messages'),
        API.get('/contracts'),
        API.get('/categories')
      ]);
      
      setStats(statsRes.data.stats);
      setOrders(ordersRes.data.orders || []);
      setProducts(productsRes.data.products || []);
      setServices(servicesRes.data.services || []);
      setUsers(usersRes.data.users || []);
      setMessages(messagesRes.data.messages || []);
      setContracts(contractsRes.data.contracts || []);
      setCategories(categoriesRes.data.categories || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const priceInNaira = (price) => {
  return Number(price).toLocaleString();
};
  // Product handlers with image upload
  const handleProductChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('name', newProduct.name);
      formData.append('description', newProduct.description);
      formData.append('price', newProduct.price);
      formData.append('discountPrice', newProduct.discountPrice || '');
      formData.append('stock', newProduct.stock);
      formData.append('categoryId', newProduct.categoryId);
      formData.append('isFeatured', newProduct.isFeatured);
      formData.append('unit', newProduct.unit || 'piece');
      
      imageFiles.forEach(file => {
        formData.append('images', file);
      });

      let response;
      if (editingProduct) {
        formData.append('existingImages', JSON.stringify(newProduct.images || []));
        response = await API.put(`/products/${editingProduct.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert('✅ Product updated successfully!');
      } else {
        response = await API.post('/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert('✅ Product created successfully!');
      }
      
      setNewProduct({
        name: '',
        description: '',
        price: '',
        discountPrice: '',
        stock: '',
        categoryId: '',
        isFeatured: false,
        unit: 'piece'
      });
      setImageFiles([]);
      setImagePreviews([]);
      setEditingProduct(null);
      fetchAllData();
    } catch (error) {
      alert('Error saving product: ' + (error.response?.data?.message || 'Unknown error'));
    } finally {
      setUploading(false);
    }
  };

  const editProduct = (product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      description: product.description,
      price: product.price,
      discountPrice: product.discountPrice || '',
      stock: product.stock,
      categoryId: product.categoryId,
      isFeatured: product.isFeatured || false,
      unit: product.unit || 'piece',
      images: product.images || []
    });
    setImagePreviews(product.images || []);
    setImageFiles([]);
  };

  const deleteProduct = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await API.delete(`/products/${id}`);
      alert('✅ Product deleted!');
      fetchAllData();
    } catch (error) {
      alert('Error deleting product');
    }
  };

  // Service handlers
  const handleServiceChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewService({
      ...newService,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    try {
      const serviceData = {
        name: newService.name,
        description: newService.description,
        price: parseFloat(newService.price),
        categoryId: parseInt(newService.categoryId),
        isActive: newService.isActive !== undefined ? newService.isActive : true
      };

      if (editingService) {
        await API.put(`/services/${editingService.id}`, serviceData);
        alert('✅ Service updated successfully!');
      } else {
        await API.post('/services', serviceData);
        alert('✅ Service created successfully!');
      }
      setNewService({
        name: '',
        description: '',
        price: '',
        categoryId: '4',
        isActive: true
      });
      setEditingService(null);
      fetchAllData();
    } catch (error) {
      alert('Error saving service: ' + (error.response?.data?.message || 'Unknown error'));
    }
  };

  const editService = (service) => {
    setEditingService(service);
    setNewService({
      name: service.name,
      description: service.description,
      price: service.price,
      categoryId: service.categoryId,
      isActive: service.isActive !== undefined ? service.isActive : true
    });
  };

  const deleteService = async (id) => {
    if (!confirm('Delete this service?')) return;
    try {
      await API.delete(`/services/${id}`);
      alert('✅ Service deleted!');
      fetchAllData();
    } catch (error) {
      alert('Error deleting service');
    }
  };

  // Order handlers
  const updateOrderStatus = async (id, status) => {
    try {
      await API.put(`/orders/${id}/status`, { status });
      alert('✅ Order status updated!');
      fetchAllData();
    } catch (error) {
      alert('Error updating order');
    }
  };

  // Contract handlers
  const updateContractStatus = async (id, status) => {
    try {
      await API.put(`/contracts/${id}/status`, { status });
      alert('✅ Contract status updated!');
      fetchAllData();
    } catch (error) {
      alert('Error updating contract');
    }
  };

  // Message handlers
  const sendReply = async () => {
    if (!replyMessage.trim() || !selectedMessage) return;
    try {
      await API.post('/messages', {
        message: replyMessage,
        receiverId: selectedMessage.senderId
      });
      alert('✅ Reply sent!');
      setReplyMessage('');
      setSelectedMessage(null);
      fetchAllData();
    } catch (error) {
      alert('Error sending reply');
    }
  };

  // User handlers - Delete User
  const deleteUser = async (id) => {
    if (!confirm('Delete this user? This action cannot be undone!')) return;
    try {
      await API.delete(`/auth/users/${id}`);
      alert('✅ User deleted successfully!');
      fetchAllData();
    } catch (error) {
      alert('Error deleting user: ' + (error.response?.data?.message || 'Unknown error'));
    }
  };

  if (loading) {
    return React.createElement('div', { style: { color: '#fff', textAlign: 'center', padding: '50px' } }, 'Loading dashboard...');
  }

  return React.createElement(
    'div',
    { style: { maxWidth: '1400px', margin: '0 auto', padding: '20px', background: '#0a0a1a', minHeight: '80vh' } },
    React.createElement(
      'div',
      { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' } },
      React.createElement('h1', { style: { color: '#fff' } }, '⚙️ Admin Dashboard'),
      React.createElement(
        'span',
        { style: { color: '#e94560', fontWeight: 'bold' } },
        '👋 Welcome, ' + (user?.name || 'Admin')
      )
    ),

    // Stats Cards
    React.createElement(
      'div',
      { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px', marginBottom: '25px' } },
      React.createElement(
        'div',
        { style: { background: '#16213e', padding: '12px', borderRadius: '10px', textAlign: 'center' } },
        React.createElement('div', { style: { fontSize: '20px' } }, '👥'),
        React.createElement('div', { style: { color: '#888', fontSize: '11px' } }, 'Users'),
        React.createElement('div', { style: { color: '#fff', fontSize: '18px', fontWeight: 'bold' } }, stats.totalUsers)
      ),
      React.createElement(
        'div',
        { style: { background: '#16213e', padding: '12px', borderRadius: '10px', textAlign: 'center' } },
        React.createElement('div', { style: { fontSize: '20px' } }, '📦'),
        React.createElement('div', { style: { color: '#888', fontSize: '11px' } }, 'Products'),
        React.createElement('div', { style: { color: '#fff', fontSize: '18px', fontWeight: 'bold' } }, stats.totalProducts)
      ),
      React.createElement(
        'div',
        { style: { background: '#16213e', padding: '12px', borderRadius: '10px', textAlign: 'center' } },
        React.createElement('div', { style: { fontSize: '20px' } }, '🛠️'),
        React.createElement('div', { style: { color: '#888', fontSize: '11px' } }, 'Services'),
        React.createElement('div', { style: { color: '#fff', fontSize: '18px', fontWeight: 'bold' } }, stats.totalServices)
      ),
      React.createElement(
        'div',
        { style: { background: '#16213e', padding: '12px', borderRadius: '10px', textAlign: 'center' } },
        React.createElement('div', { style: { fontSize: '20px' } }, '📋'),
        React.createElement('div', { style: { color: '#888', fontSize: '11px' } }, 'Orders'),
        React.createElement('div', { style: { color: '#fff', fontSize: '18px', fontWeight: 'bold' } }, stats.totalOrders)
      ),
      React.createElement(
        'div',
        { style: { background: '#16213e', padding: '12px', borderRadius: '10px', textAlign: 'center' } },
        React.createElement('div', { style: { fontSize: '20px' } }, '💰'),
        React.createElement('div', { style: { color: '#888', fontSize: '11px' } }, 'Revenue'),
        React.createElement('div', { style: { color: '#e94560', fontSize: '16px', fontWeight: 'bold' } }, '₦' + priceInNaira(stats.totalRevenue).slice(0, 10))
      ),
      React.createElement(
        'div',
        { style: { background: '#16213e', padding: '12px', borderRadius: '10px', textAlign: 'center' } },
        React.createElement('div', { style: { fontSize: '20px' } }, '⏳'),
        React.createElement('div', { style: { color: '#888', fontSize: '11px' } }, 'Pending'),
        React.createElement('div', { style: { color: '#ffc107', fontSize: '18px', fontWeight: 'bold' } }, stats.pendingOrders)
      ),
      React.createElement(
        'div',
        { style: { background: '#16213e', padding: '12px', borderRadius: '10px', textAlign: 'center' } },
        React.createElement('div', { style: { fontSize: '20px' } }, '💬'),
        React.createElement('div', { style: { color: '#888', fontSize: '11px' } }, 'Messages'),
        React.createElement('div', { style: { color: '#e94560', fontSize: '18px', fontWeight: 'bold' } }, stats.unreadMessages || 0)
      ),
      React.createElement(
        'div',
        { style: { background: '#16213e', padding: '12px', borderRadius: '10px', textAlign: 'center' } },
        React.createElement('div', { style: { fontSize: '20px' } }, '📄'),
        React.createElement('div', { style: { color: '#888', fontSize: '11px' } }, 'Contracts'),
        React.createElement('div', { style: { color: '#fff', fontSize: '18px', fontWeight: 'bold' } }, stats.totalContracts)
      )
    ),

    // Tabs
    React.createElement(
      'div',
      { style: { display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' } },
      ['overview', 'products', 'services', 'orders', 'users', 'messages', 'contracts'].map((tab) =>
        React.createElement(
          'button',
          {
            key: tab,
            onClick: () => setActiveTab(tab),
            style: { padding: '8px 16px', fontSize: '13px', background: activeTab === tab ? '#e94560' : '#16213e', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', textTransform: 'capitalize' }
          },
          tab === 'overview' ? '📊 Overview' :
          tab === 'products' ? '📦 Products' :
          tab === 'services' ? '🛠️ Services' :
          tab === 'orders' ? '📋 Orders' :
          tab === 'users' ? '👥 Users' :
          tab === 'messages' ? '💬 Messages' :
          '📄 Contracts'
        )
      )
    ),

    // Overview Tab
    activeTab === 'overview' && React.createElement(
      'div',
      { style: { background: '#16213e', borderRadius: '10px', padding: '16px' } },
      React.createElement('h3', { style: { color: '#fff', marginBottom: '12px', fontSize: '16px' } }, '📋 Recent Orders'),
      orders.length === 0 ? (
        React.createElement('p', { style: { color: '#888' } }, 'No orders yet')
      ) : (
        React.createElement(
          'div',
          { style: { display: 'flex', flexDirection: 'column', gap: '8px' } },
          orders.slice(0, 5).map((order) =>
            React.createElement(
              'div',
              { key: order.id, style: { display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#0a0a1a', borderRadius: '6px', fontSize: '13px' } },
              React.createElement('span', { style: { color: '#fff' } }, '#', order.orderNumber || order.id),
              React.createElement('span', { style: { color: '#e94560' } }, '₦' + priceInNaira(order.totalPrice)),
              React.createElement(
                'span',
                { style: { color: order.status === 'pending' ? '#ffc107' : order.status === 'delivered' ? '#28a745' : '#17a2b8', textTransform: 'capitalize' } },
                order.status
              )
            )
          )
        )
      )
    ),

    // Products Tab with Image Upload
    activeTab === 'products' && React.createElement(
      'div',
      { style: { background: '#16213e', borderRadius: '10px', padding: '16px' } },
      React.createElement('h3', { style: { color: '#fff', marginBottom: '12px', fontSize: '16px' } }, '📦 Products Management'),
      React.createElement(
        'form',
        { onSubmit: handleProductSubmit, style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px', background: '#0a0a1a', padding: '12px', borderRadius: '6px' } },
        React.createElement('input', { type: 'text', name: 'name', placeholder: 'Product Name', value: newProduct.name, onChange: handleProductChange, style: { padding: '8px', borderRadius: '6px', border: '1px solid #2a2a4e', background: '#0a0a1a', color: '#fff' }, required: true }),
        React.createElement('input', { type: 'text', name: 'description', placeholder: 'Description', value: newProduct.description, onChange: handleProductChange, style: { padding: '8px', borderRadius: '6px', border: '1px solid #2a2a4e', background: '#0a0a1a', color: '#fff' }, required: true }),
        React.createElement('input', { type: 'number', name: 'price', placeholder: 'Price', value: newProduct.price, onChange: handleProductChange, style: { padding: '8px', borderRadius: '6px', border: '1px solid #2a2a4e', background: '#0a0a1a', color: '#fff' }, required: true, step: '0.01' }),
        React.createElement('input', { type: 'number', name: 'discountPrice', placeholder: 'Discount Price', value: newProduct.discountPrice, onChange: handleProductChange, style: { padding: '8px', borderRadius: '6px', border: '1px solid #2a2a4e', background: '#0a0a1a', color: '#fff' }, step: '0.01' }),
        React.createElement('input', { type: 'number', name: 'stock', placeholder: 'Stock', value: newProduct.stock, onChange: handleProductChange, style: { padding: '8px', borderRadius: '6px', border: '1px solid #2a2a4e', background: '#0a0a1a', color: '#fff' }, required: true }),
        React.createElement(
          'select',
          { name: 'categoryId', value: newProduct.categoryId, onChange: handleProductChange, style: { padding: '8px', borderRadius: '6px', border: '1px solid #2a2a4e', background: '#0a0a1a', color: '#fff' }, required: true },
          React.createElement('option', { value: '' }, 'Select Category'),
          categories.filter(c => c.type === 'market').map(cat =>
            React.createElement('option', { key: cat.id, value: cat.id }, cat.name)
          )
        ),
        React.createElement('input', { type: 'text', name: 'unit', placeholder: 'Unit (piece, kg, etc.)', value: newProduct.unit, onChange: handleProductChange, style: { padding: '8px', borderRadius: '6px', border: '1px solid #2a2a4e', background: '#0a0a1a', color: '#fff' } }),
        React.createElement(
          'div',
          { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
          React.createElement('label', { style: { color: '#fff', fontSize: '13px' } }, 'Featured:'),
          React.createElement('input', { type: 'checkbox', name: 'isFeatured', checked: newProduct.isFeatured, onChange: handleProductChange, style: { width: '18px', height: '18px' } })
        ),
        // Image Upload
        React.createElement(
          'div',
          { style: { gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '8px' } },
          React.createElement('label', { style: { color: '#fff', fontSize: '13px' } }, 'Product Images:'),
          React.createElement('input', {
            type: 'file',
            name: 'images',
            accept: 'image/*',
            multiple: true,
            onChange: handleImageChange,
            style: { padding: '8px', color: '#fff', background: '#0a0a1a', borderRadius: '6px', border: '1px solid #2a2a4e' }
          }),
          imagePreviews.length > 0 && React.createElement(
            'div',
            { style: { display: 'flex', gap: '8px', flexWrap: 'wrap' } },
            imagePreviews.map((preview, index) =>
              React.createElement('img', {
                key: index,
                src: preview,
                alt: 'Preview',
                style: { width: '80px', height: '80px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #2a2a4e' }
              })
            )
          )
        ),
        React.createElement(
          'button',
          { type: 'submit', style: { gridColumn: '1 / -1', padding: '8px', background: '#e94560', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }, disabled: uploading },
          uploading ? 'Uploading...' : (editingProduct ? '✏️ Update Product' : '➕ Add Product')
        )
      ),
      React.createElement(
        'div',
        { style: { display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '300px', overflowY: 'auto' } },
        products.map((product) =>
          React.createElement(
            'div',
            { key: product.id, style: { display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#0a0a1a', borderRadius: '6px', alignItems: 'center', flexWrap: 'wrap', gap: '5px', fontSize: '13px' } },
            React.createElement('span', { style: { color: '#fff' } }, product.name, ' (', product.stock, ')'),
            React.createElement('span', { style: { color: '#e94560' } }, '₦' + priceInNaira(product.price)),
            product.images && product.images.length > 0 && React.createElement(
              'span',
              { style: { fontSize: '12px', color: '#888' } },
              '📷 ' + product.images.length
            ),
            React.createElement(
              'div',
              null,
              React.createElement('button', { onClick: () => editProduct(product), style: { background: '#17a2b8', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', marginRight: '4px', fontSize: '12px' } }, '✏️'),
              React.createElement('button', { onClick: () => deleteProduct(product.id), style: { background: '#dc3545', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' } }, '🗑️')
            )
          )
        )
      )
    ),

    // Services Tab
    activeTab === 'services' && React.createElement(
      'div',
      { style: { background: '#16213e', borderRadius: '10px', padding: '16px' } },
      React.createElement('h3', { style: { color: '#fff', marginBottom: '12px', fontSize: '16px' } }, '🛠️ Services Management'),
      React.createElement(
        'form',
        { onSubmit: handleServiceSubmit, style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px', background: '#0a0a1a', padding: '12px', borderRadius: '6px' } },
        React.createElement('input', { type: 'text', name: 'name', placeholder: 'Service Name', value: newService.name, onChange: handleServiceChange, style: { padding: '8px', borderRadius: '6px', border: '1px solid #2a2a4e', background: '#0a0a1a', color: '#fff' }, required: true }),
        React.createElement('input', { type: 'text', name: 'description', placeholder: 'Description', value: newService.description, onChange: handleServiceChange, style: { padding: '8px', borderRadius: '6px', border: '1px solid #2a2a4e', background: '#0a0a1a', color: '#fff' }, required: true }),
        React.createElement('input', { type: 'number', name: 'price', placeholder: 'Price', value: newService.price, onChange: handleServiceChange, style: { padding: '8px', borderRadius: '6px', border: '1px solid #2a2a4e', background: '#0a0a1a', color: '#fff' }, required: true, step: '0.01' }),
        React.createElement(
          'select',
          { name: 'categoryId', value: newService.categoryId, onChange: handleServiceChange, style: { padding: '8px', borderRadius: '6px', border: '1px solid #2a2a4e', background: '#0a0a1a', color: '#fff' }, required: true },
          categories.filter(c => c.type === 'service').map(cat =>
            React.createElement('option', { key: cat.id, value: cat.id }, cat.name)
          )
        ),
        React.createElement(
          'div',
          { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
          React.createElement('label', { style: { color: '#fff', fontSize: '13px' } }, 'Active:'),
          React.createElement('input', { type: 'checkbox', name: 'isActive', checked: newService.isActive, onChange: handleServiceChange, style: { width: '18px', height: '18px' } })
        ),
        React.createElement(
          'button',
          { type: 'submit', style: { gridColumn: '1 / -1', padding: '8px', background: '#e94560', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' } },
          editingService ? '✏️ Update Service' : '➕ Add Service'
        )
      ),
      React.createElement(
        'div',
        { style: { display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '300px', overflowY: 'auto' } },
        services.length === 0 ? (
          React.createElement('p', { style: { color: '#888', textAlign: 'center' } }, 'No services yet')
        ) : (
          services.map((service) =>
            React.createElement(
              'div',
              { key: service.id, style: { display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#0a0a1a', borderRadius: '6px', alignItems: 'center', flexWrap: 'wrap', gap: '5px', fontSize: '13px' } },
              React.createElement('span', { style: { color: '#fff' } }, service.name),
              React.createElement('span', { style: { color: '#e94560' } }, '₦' + priceInNaira(service.price)),
              React.createElement(
                'span',
                { style: { color: service.isActive ? '#28a745' : '#dc3545', fontSize: '11px' } },
                service.isActive ? '✅ Active' : '❌ Inactive'
              ),
              React.createElement(
                'div',
                null,
                React.createElement('button', { onClick: () => editService(service), style: { background: '#17a2b8', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', marginRight: '4px', fontSize: '12px' } }, '✏️'),
                React.createElement('button', { onClick: () => deleteService(service.id), style: { background: '#dc3545', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' } }, '🗑️')
              )
            )
          )
        )
      )
    ),

    // Orders Tab
    activeTab === 'orders' && React.createElement(
      'div',
      { style: { background: '#16213e', borderRadius: '10px', padding: '16px' } },
      React.createElement('h3', { style: { color: '#fff', marginBottom: '12px', fontSize: '16px' } }, '📋 Orders Management'),
      React.createElement(
        'div',
        { style: { display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '400px', overflowY: 'auto' } },
        orders.map((order) =>
          React.createElement(
            'div',
            { key: order.id, style: { background: '#0a0a1a', padding: '12px', borderRadius: '6px' } },
            React.createElement(
              'div',
              { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '5px' } },
              React.createElement('span', { style: { color: '#fff', fontWeight: 'bold', fontSize: '13px' } }, '#', order.orderNumber || order.id),
              React.createElement('span', { style: { color: '#e94560', fontWeight: 'bold', fontSize: '13px' } }, '₦' + priceInNaira(order.totalPrice)),
              React.createElement(
                'select',
                {
                  value: order.status,
                  onChange: (e) => updateOrderStatus(order.id, e.target.value),
                  style: { padding: '4px 8px', borderRadius: '4px', border: '1px solid #2a2a4e', background: '#0a0a1a', color: '#fff', fontSize: '12px' }
                },
                ['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(status =>
                  React.createElement('option', { key: status, value: status }, status.toUpperCase())
                )
              )
            ),
            React.createElement(
              'div',
              { style: { color: '#888', fontSize: '11px', marginTop: '4px' } },
              'Payment: ', order.paymentMethod,
              ' | Status: ', order.paymentStatus
            ),
            React.createElement(
              'div',
              { style: { color: '#aaa', fontSize: '11px', marginTop: '4px' } },
              (order.orderItems || []).map((item, idx) =>
                React.createElement('span', { key: idx }, item.name, ' (', item.quantity, 'x) ')
              )
            )
          )
        )
      )
    ),

    // Users Tab
    activeTab === 'users' && React.createElement(
      'div',
      { style: { background: '#16213e', borderRadius: '10px', padding: '16px' } },
      React.createElement('h3', { style: { color: '#fff', marginBottom: '12px', fontSize: '16px' } }, '👥 Users Management'),
      React.createElement(
        'div',
        { style: { display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '400px', overflowY: 'auto' } },
        users.map((u) =>
          React.createElement(
            'div',
            { key: u.id, style: { display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#0a0a1a', borderRadius: '6px', alignItems: 'center', flexWrap: 'wrap', gap: '5px', fontSize: '13px' } },
            React.createElement('span', { style: { color: '#fff' } }, u.name),
            React.createElement('span', { style: { color: '#888' } }, u.email),
            React.createElement('span', { style: { color: u.role === 'admin' ? '#e94560' : '#888', fontSize: '11px' } }, u.role),
            u.id !== user.id && React.createElement(
              'button',
              {
                onClick: () => deleteUser(u.id),
                style: { background: '#dc3545', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }
              },
              '🗑️ Delete'
            )
          )
        )
      )
    ),

    // Messages Tab
    activeTab === 'messages' && React.createElement(
      'div',
      { style: { background: '#16213e', borderRadius: '10px', padding: '16px' } },
      React.createElement('h3', { style: { color: '#fff', marginBottom: '12px', fontSize: '16px' } }, '💬 Messages from Users'),
      React.createElement(
        'div',
        { style: { display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '300px', overflowY: 'auto' } },
        messages.length === 0 ? (
          React.createElement('p', { style: { color: '#888' } }, 'No messages yet')
        ) : (
          messages.map((msg) =>
            React.createElement(
              'div',
              { key: msg.id, style: { background: '#0a0a1a', padding: '10px', borderRadius: '6px' } },
              React.createElement(
                'div',
                { style: { display: 'flex', justifyContent: 'space-between' } },
                React.createElement('span', { style: { color: '#fff', fontWeight: 'bold', fontSize: '13px' } }, msg.senderName || 'User'),
                React.createElement('span', { style: { color: '#888', fontSize: '11px' } }, new Date(msg.createdAt).toLocaleString())
              ),
              React.createElement('p', { style: { color: '#ccc', fontSize: '13px', margin: '4px 0' } }, msg.message),
              React.createElement(
                'div',
                { style: { display: 'flex', gap: '8px', marginTop: '4px' } },
                React.createElement(
                  'button',
                  {
                    onClick: () => { setSelectedMessage(msg); setReplyMessage(''); },
                    style: { padding: '4px 12px', background: '#e94560', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }
                  },
                  '💬 Reply'
                )
              )
            )
          )
        )
      ),
      selectedMessage && React.createElement(
        'div',
        { style: { marginTop: '12px', padding: '12px', background: '#0a0a1a', borderRadius: '6px' } },
        React.createElement('h4', { style: { color: '#fff', fontSize: '14px' } }, 'Reply to ', selectedMessage.senderName),
        React.createElement('textarea', {
          value: replyMessage,
          onChange: (e) => setReplyMessage(e.target.value),
          style: { width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #2a2a4e', background: '#0a0a1a', color: '#fff', minHeight: '60px', fontSize: '13px' },
          placeholder: 'Type your reply...'
        }),
        React.createElement(
          'div',
          { style: { display: 'flex', gap: '8px', marginTop: '8px' } },
          React.createElement(
            'button',
            { onClick: sendReply, style: { padding: '6px 16px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' } },
            '📤 Send Reply'
          ),
          React.createElement(
            'button',
            { onClick: () => setSelectedMessage(null), style: { padding: '6px 16px', background: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' } },
            'Cancel'
          )
        )
      )
    ),

    // Contracts Tab
    activeTab === 'contracts' && React.createElement(
      'div',
      { style: { background: '#16213e', borderRadius: '10px', padding: '16px' } },
      React.createElement('h3', { style: { color: '#fff', marginBottom: '12px', fontSize: '16px' } }, '📄 Contracts Management'),
      React.createElement(
        'div',
        { style: { display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '400px', overflowY: 'auto' } },
        contracts.length === 0 ? (
          React.createElement('p', { style: { color: '#888' } }, 'No contracts yet')
        ) : (
          contracts.map((contract) =>
            React.createElement(
              'div',
              { key: contract.id, style: { background: '#0a0a1a', padding: '12px', borderRadius: '6px' } },
              React.createElement(
                'div',
                { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '5px' } },
                React.createElement('span', { style: { color: '#fff', fontWeight: 'bold', fontSize: '13px' } }, contract.title),
                React.createElement('span', { style: { color: '#e94560', fontSize: '13px' } }, '₦' + priceInNaira(contract.budget))
              ),
              React.createElement('p', { style: { color: '#ccc', fontSize: '13px', margin: '4px 0' } }, contract.description),
              React.createElement(
                'div',
                { style: { color: '#888', fontSize: '11px' } },
                'Proposed by: ', contract.proposedBy,
                ' | Email: ', contract.proposedEmail,
                ' | Phone: ', contract.proposedPhone
              ),
              React.createElement(
                'select',
                {
                  value: contract.status,
                  onChange: (e) => updateContractStatus(contract.id, e.target.value),
                  style: { marginTop: '4px', padding: '4px 8px', borderRadius: '4px', border: '1px solid #2a2a4e', background: '#0a0a1a', color: '#fff', fontSize: '12px' }
                },
                ['pending', 'approved', 'rejected', 'completed'].map(status =>
                  React.createElement('option', { key: status, value: status }, status.toUpperCase())
                )
              ),
              React.createElement(
                'div',
                { style: { display: 'flex', gap: '8px', marginTop: '4px' } },
                React.createElement(
                  'button',
                  {
                    onClick: () => window.location.href = 'mailto:' + contract.proposedEmail + '?subject=Contract: ' + contract.title,
                    style: { padding: '4px 12px', background: '#17a2b8', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }
                  },
                  '📧 Email'
                ),
                React.createElement(
                  'button',
                  {
                    onClick: () => window.location.href = 'https://wa.me/234' + contract.proposedPhone.replace(/^0/, ''),
                    style: { padding: '4px 12px', background: '#25D366', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }
                  },
                  '💬 WhatsApp'
                )
              )
            )
          )
        )
      )
    )
  );
};

export default Dashboard;
