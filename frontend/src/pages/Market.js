import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';

const Market = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const { user, fetchCartCount } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await API.get('/products');
      setProducts(response.data.products || []);
      setSearchResults(response.data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await API.get('/categories');
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const addToCart = async (productId) => {
    if (!user) {
      alert('Please login first');
      navigate('/login');
      return;
    }
    try {
      await API.post('/cart/add', { productId, quantity: 1 });
      await fetchCartCount();
      navigate('/cart');
    } catch (error) {
      alert(error.response?.data?.message || 'Error adding to cart');
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (term.trim() === '') {
      const filtered = selectedCategory === 'all' 
        ? products 
        : products.filter(p => p.categoryId === parseInt(selectedCategory));
      setSearchResults(filtered);
    } else {
      let filtered = products.filter(p => 
        p.name.toLowerCase().includes(term) || 
        p.description.toLowerCase().includes(term)
      );
      
      if (selectedCategory !== 'all') {
        filtered = filtered.filter(p => p.categoryId === parseInt(selectedCategory));
      }
      
      setSearchResults(filtered);
    }
  };

  const handleCategoryFilter = (categoryId) => {
    setSelectedCategory(categoryId);
    
    let filtered = products;
    
    if (categoryId !== 'all') {
      filtered = filtered.filter(p => p.categoryId === parseInt(categoryId));
    }
    
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setSearchResults(filtered);
  };

  const filteredProducts = searchResults;
  
  const formatPrice = (price) => {
    return Number(price).toLocaleString();
  };

  if (loading) {
    return React.createElement('div', { style: styles.loading }, 'Loading products...');
  }

  return React.createElement(
    'div',
    { style: styles.container },
    React.createElement('h1', { style: styles.title }, '🏪 Market'),
    
    React.createElement(
      'div',
      { style: styles.searchContainer },
      React.createElement(
        'div',
        { style: styles.searchWrapper },
        React.createElement('span', { style: styles.searchIcon }, '🔍'),
        React.createElement('input', {
          type: 'text',
          placeholder: 'Search products by name or description...',
          value: searchTerm,
          onChange: handleSearch,
          style: styles.searchInput
        }),
        searchTerm && React.createElement(
          'button',
          {
            onClick: () => {
              setSearchTerm('');
              setSearchResults(selectedCategory === 'all' ? products : products.filter(p => p.categoryId === parseInt(selectedCategory)));
            },
            style: styles.clearBtn
          },
          '✕'
        )
      ),
      React.createElement(
        'div',
        { style: styles.searchResultsCount },
        filteredProducts.length === 0 ? 'No products found' : `${filteredProducts.length} products found`
      )
    ),

    React.createElement(
      'div',
      { style: styles.filterContainer },
      React.createElement(
        'button',
        {
          onClick: () => handleCategoryFilter('all'),
          style: {
            ...styles.filterBtn,
            ...(selectedCategory === 'all' ? styles.filterBtnActive : {})
          }
        },
        'All'
      ),
      categories.filter(c => c.type === 'market').map((cat) =>
        React.createElement(
          'button',
          {
            key: cat.id,
            onClick: () => handleCategoryFilter(cat.id.toString()),
            style: {
              ...styles.filterBtn,
              ...(selectedCategory === cat.id.toString() ? styles.filterBtnActive : {})
            }
          },
          cat.name
        )
      )
    ),

    React.createElement(
      'div',
      { style: styles.grid },
      filteredProducts.length === 0 ? (
        React.createElement(
          'div',
          { style: styles.noProducts },
          React.createElement('span', { style: { fontSize: '48px', display: 'block' } }, '🔍'),
          React.createElement('p', null, 'No products found'),
          React.createElement(
            'button',
            {
              onClick: () => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSearchResults(products);
              },
              style: styles.clearFilterBtn
            },
            'Clear Filters'
          )
        )
      ) : (
        filteredProducts.map((product) =>
          React.createElement(
            'div',
            { key: product.id, style: styles.card },
            React.createElement(
              'div',
              { style: styles.imageBox },
              product.images && product.images.length > 0 
                ? React.createElement('img', { 
                    src: product.images[0], 
                    alt: product.name,
                    style: { width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }
                  })
                : React.createElement('span', { style: { fontSize: '48px' } }, '📦')
            ),
            React.createElement('h3', { style: styles.productName }, product.name),
            React.createElement('p', { style: styles.productDesc }, product.description),
            React.createElement(
              'div',
              { style: styles.priceRow },
              React.createElement('span', { style: styles.price }, '₦' + formatPrice(product.price)),
              product.discountPrice && product.discountPrice > 0 &&
                React.createElement('span', { style: styles.oldPrice }, '₦' + formatPrice(product.discountPrice))
            ),
            React.createElement('p', { style: styles.stock }, 'In Stock: ' + product.stock),
            React.createElement(
              'button',
              {
                onClick: () => addToCart(product.id),
                style: styles.buyBtn
              },
              '🛒 Buy'
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
    marginBottom: '20px',
    textAlign: 'center'
  },
  searchContainer: {
    marginBottom: '20px'
  },
  searchWrapper: {
    display: 'flex',
    alignItems: 'center',
    background: '#16213e',
    borderRadius: '10px',
    padding: '0 15px',
    border: '1px solid #2a2a4e'
  },
  searchIcon: {
    color: '#888',
    fontSize: '18px',
    marginRight: '10px'
  },
  searchInput: {
    flex: 1,
    padding: '12px 0',
    background: 'transparent',
    border: 'none',
    color: '#fff',
    fontSize: '16px',
    outline: 'none'
  },
  clearBtn: {
    background: 'none',
    border: 'none',
    color: '#888',
    fontSize: '18px',
    cursor: 'pointer',
    padding: '5px'
  },
  searchResultsCount: {
    color: '#888',
    fontSize: '13px',
    marginTop: '8px',
    paddingLeft: '10px'
  },
  filterContainer: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
    marginBottom: '20px',
    justifyContent: 'center'
  },
  filterBtn: {
    padding: '8px 20px',
    borderRadius: '20px',
    border: '1px solid #2a2a4e',
    background: 'transparent',
    color: '#888',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.3s'
  },
  filterBtnActive: {
    background: '#e94560',
    color: '#fff',
    border: '1px solid #e94560'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px'
  },
  card: {
    background: '#16213e',
    borderRadius: '12px',
    padding: '16px',
    transition: 'transform 0.3s'
  },
  imageBox: {
    width: '100%',
    height: '150px',
    background: '#0a0a1a',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: '10px'
  },
  productName: {
    color: '#fff',
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '6px'
  },
  productDesc: {
    color: '#888',
    fontSize: '14px',
    marginBottom: '10px'
  },
  priceRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '8px'
  },
  price: {
    color: '#e94560',
    fontSize: '20px',
    fontWeight: 'bold'
  },
  oldPrice: {
    color: '#666',
    fontSize: '14px',
    textDecoration: 'line-through'
  },
  stock: {
    color: '#888',
    fontSize: '12px',
    marginBottom: '12px'
  },
  buyBtn: {
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
  noProducts: {
    color: '#888',
    textAlign: 'center',
    fontSize: '18px',
    gridColumn: '1 / -1',
    padding: '40px 0'
  },
  clearFilterBtn: {
    marginTop: '10px',
    padding: '8px 20px',
    background: '#e94560',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  loading: {
    color: '#fff',
    textAlign: 'center',
    fontSize: '20px',
    marginTop: '50px'
  }
};

export default Market;
