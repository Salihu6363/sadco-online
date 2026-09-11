import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return React.createElement(
      'div',
      { style: styles.landingContainer },
      React.createElement(
        'div',
        { style: styles.heroSection },
        React.createElement(
          'div',
          { style: styles.heroContent },
          React.createElement(
            'div',
            { style: styles.heroBadge },
            '🚀 Premium E-Commerce'
          ),
          React.createElement(
            'h1',
            { style: styles.heroTitle },
            'Welcome to ',
            React.createElement('span', { style: styles.heroHighlight }, 'SADCO'),
            ' Online'
          ),
          React.createElement(
            'p',
            { style: styles.heroSubtitle },
            'Your trusted e-commerce platform for quality products, professional services, and seamless shopping experience.'
          ),
          React.createElement(
            'div',
            { style: styles.heroButtons },
            React.createElement(
              'button',
              { 
                onClick: () => navigate('/register'),
                style: styles.heroBtnPrimary 
              },
              '🚀 Get Started'
            ),
            React.createElement(
              'button',
              { 
                onClick: () => navigate('/login'),
                style: styles.heroBtnSecondary 
              },
              '👤 Login'
            )
          ),
          React.createElement(
            'div',
            { style: styles.heroStats },
            React.createElement(
              'div',
              { style: styles.heroStat },
              React.createElement('span', { style: styles.heroStatNumber }, '500+'),
              React.createElement('span', { style: styles.heroStatLabel }, 'Products')
            ),
            React.createElement(
              'div',
              { style: styles.heroStat },
              React.createElement('span', { style: styles.heroStatNumber }, '50+'),
              React.createElement('span', { style: styles.heroStatLabel }, 'Services')
            ),
            React.createElement(
              'div',
              { style: styles.heroStat },
              React.createElement('span', { style: styles.heroStatNumber }, '1000+'),
              React.createElement('span', { style: styles.heroStatLabel }, 'Happy Customers')
            )
          )
        ),
        React.createElement(
          'div',
          { style: styles.heroImage },
          React.createElement('div', { style: styles.heroImagePlaceholder }, '🛍️')
        )
      ),

      React.createElement(
        'div',
        { style: styles.featuresSection },
        React.createElement(
          'h2',
          { style: styles.sectionTitle },
          'Why Choose ',
          React.createElement('span', { style: styles.sectionHighlight }, 'SADCO Online')
        ),
        React.createElement(
          'p',
          { style: styles.sectionSubtitle },
          'We provide the best shopping experience with quality products and professional services'
        ),
        React.createElement(
          'div',
          { style: styles.featuresGrid },
          React.createElement(
            'div',
            { style: styles.featureCard },
            React.createElement('span', { style: styles.featureIcon }, '🛒'),
            React.createElement('h3', { style: styles.featureTitle }, 'Quality Products'),
            React.createElement('p', { style: styles.featureDesc }, 'Shop from a wide range of quality products including sachet water, fresh eggs, cement, blocks, electronics, and more.')
          ),
          React.createElement(
            'div',
            { style: styles.featureCard },
            React.createElement('span', { style: styles.featureIcon }, '💰'),
            React.createElement('h3', { style: styles.featureTitle }, 'Affordable Prices'),
            React.createElement('p', { style: styles.featureDesc }, 'Get the best prices on all products. We offer competitive pricing and discounts on bulk purchases.')
          ),
          React.createElement(
            'div',
            { style: styles.featureCard },
            React.createElement('span', { style: styles.featureIcon }, '🚚'),
            React.createElement('h3', { style: styles.featureTitle }, 'Fast Delivery'),
            React.createElement('p', { style: styles.featureDesc }, 'Quick and reliable delivery to your doorstep. We deliver across Nigeria with tracking.')
          ),
          React.createElement(
            'div',
            { style: styles.featureCard },
            React.createElement('span', { style: styles.featureIcon }, '🛠️'),
            React.createElement('h3', { style: styles.featureTitle }, 'Professional Services'),
            React.createElement('p', { style: styles.featureDesc }, 'Expert services including construction, maintenance, consultancy, and contract management.')
          )
        )
      ),

      React.createElement(
        'footer',
        { style: styles.footer },
        React.createElement(
          'div',
          { style: styles.footerContent },
          React.createElement(
            'div',
            { style: styles.footerGrid },
            React.createElement(
              'div',
              { style: styles.footerCol },
              React.createElement('h3', { style: styles.footerTitle }, 'SADCO Online'),
              React.createElement('p', { style: styles.footerText }, 'Your trusted e-commerce platform for quality products and professional services.')
            ),
            React.createElement(
              'div',
              { style: styles.footerCol },
              React.createElement('h4', { style: styles.footerHeading }, 'Quick Links'),
              React.createElement('a', { href: '/market', style: styles.footerLink }, 'Market'),
              React.createElement('a', { href: '/services', style: styles.footerLink }, 'Services'),
              React.createElement('a', { href: '/contract', style: styles.footerLink }, 'Contracts')
            ),
            React.createElement(
              'div',
              { style: styles.footerCol },
              React.createElement('h4', { style: styles.footerHeading }, 'Contact Us'),
              React.createElement('p', { style: styles.footerText }, '📧 info@sadco.com'),
              React.createElement('p', { style: styles.footerText }, '📞 +234 800 SADCO ON'),
              React.createElement('p', { style: styles.footerText }, '📍 Lagos, Nigeria')
            )
          ),
          React.createElement(
            'div',
            { style: styles.footerBottom },
            React.createElement('p', { style: styles.footerCopy }, '© ' + new Date().getFullYear() + ' SADCO Online. All Rights Reserved.')
          )
        )
      )
    );
  }

  return React.createElement(
    'div',
    { style: styles.container },
    React.createElement(
      'div',
      { style: styles.welcomeSection },
      React.createElement('h1', { style: styles.welcomeTitle }, 'Welcome back, ' + user.name + '! 😊'),
      React.createElement('p', { style: styles.welcomeSubtitle }, 'Discover amazing products and professional services')
    ),

    React.createElement(
      'div',
      { style: styles.section },
      React.createElement(
        'div',
        { style: styles.sectionHeader },
        React.createElement('h2', { style: styles.sectionTitle }, '🏪 Market Place'),
        React.createElement(
          'button',
          { onClick: () => navigate('/market'), style: styles.viewAllBtn },
          'View All →'
        )
      ),
      React.createElement(
        'div',
        { style: styles.infoGrid },
        React.createElement(
          'div',
          { style: styles.infoCard },
          React.createElement('span', { style: styles.infoIcon }, '🛒'),
          React.createElement('h3', { style: styles.infoTitle }, 'Quality Products'),
          React.createElement('p', { style: styles.infoDesc }, 'Shop from a wide range of quality products including sachet water, fresh eggs, cement, blocks, electronics, and more.')
        ),
        React.createElement(
          'div',
          { style: styles.infoCard },
          React.createElement('span', { style: styles.infoIcon }, '💰'),
          React.createElement('h3', { style: styles.infoTitle }, 'Affordable Prices'),
          React.createElement('p', { style: styles.infoDesc }, 'Get the best prices on all products. We offer competitive pricing and discounts on bulk purchases.')
        ),
        React.createElement(
          'div',
          { style: styles.infoCard },
          React.createElement('span', { style: styles.infoIcon }, '🚚'),
          React.createElement('h3', { style: styles.infoTitle }, 'Fast Delivery'),
          React.createElement('p', { style: styles.infoDesc }, 'Quick and reliable delivery to your doorstep. We deliver across Nigeria with tracking.')
        )
      ),
      React.createElement(
        'div',
        { style: styles.centerBtn },
        React.createElement(
          'button',
          { onClick: () => navigate('/market'), style: styles.exploreBtn },
          '🛒 Explore Market'
        )
      )
    ),

    React.createElement(
      'div',
      { style: styles.servicesSection },
      React.createElement(
        'div',
        { style: styles.sectionHeader },
        React.createElement('h2', { style: styles.sectionTitle }, '🛠️ Our Services')
      ),
      React.createElement(
        'div',
        { style: styles.servicesGrid },
        React.createElement(
          'div',
          { style: styles.serviceCard },
          React.createElement('span', { style: styles.serviceIcon }, '🏗️'),
          React.createElement('h3', { style: styles.serviceName }, 'Construction Services'),
          React.createElement('p', { style: styles.serviceDesc }, 'Professional construction services including building materials supply, equipment rental, and project management.')
        ),
        React.createElement(
          'div',
          { style: styles.serviceCard },
          React.createElement('span', { style: styles.serviceIcon }, '📄'),
          React.createElement('h3', { style: styles.serviceName }, 'Contract Proposals'),
          React.createElement('p', { style: styles.serviceDesc }, 'Submit and manage contract proposals for construction projects, maintenance, and other services.')
        ),
        React.createElement(
          'div',
          { style: styles.serviceCard },
          React.createElement('span', { style: styles.serviceIcon }, '🔧'),
          React.createElement('h3', { style: styles.serviceName }, 'Maintenance Services'),
          React.createElement('p', { style: styles.serviceDesc }, 'Equipment maintenance, facility management, and repair services for homes and businesses.')
        ),
        React.createElement(
          'div',
          { style: styles.serviceCard },
          React.createElement('span', { style: styles.serviceIcon }, '📐'),
          React.createElement('h3', { style: styles.serviceName }, 'Consultancy'),
          React.createElement('p', { style: styles.serviceDesc }, 'Expert consultancy services for construction projects, business development, and strategic planning.')
        )
      ),
      React.createElement(
        'div',
        { style: styles.centerBtn },
        React.createElement(
          'button',
          { onClick: () => navigate('/services'), style: styles.exploreBtn },
          '🔧 Explore Services'
        )
      )
    )
  );
};

const styles = {
  landingContainer: {
    background: '#0a0a1a',
    minHeight: '100vh'
  },
  heroSection: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '60px 20px',
    gap: '40px',
    flexWrap: 'wrap'
  },
  heroContent: {
    flex: 1,
    minWidth: '300px'
  },
  heroBadge: {
    display: 'inline-block',
    background: 'rgba(233, 69, 96, 0.15)',
    color: '#e94560',
    padding: '6px 16px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '20px'
  },
  heroTitle: {
    color: '#fff',
    fontSize: '48px',
    fontWeight: 'bold',
    lineHeight: '1.2',
    marginBottom: '16px'
  },
  heroHighlight: {
    color: '#e94560'
  },
  heroSubtitle: {
    color: '#888',
    fontSize: '18px',
    lineHeight: '1.6',
    marginBottom: '30px',
    maxWidth: '500px'
  },
  heroButtons: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
    marginBottom: '40px'
  },
  heroBtnPrimary: {
    background: '#e94560',
    color: '#fff',
    border: 'none',
    padding: '14px 32px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s'
  },
  heroBtnSecondary: {
    background: 'transparent',
    color: '#fff',
    border: '2px solid #2a2a4e',
    padding: '14px 32px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s'
  },
  heroStats: {
    display: 'flex',
    gap: '40px',
    flexWrap: 'wrap'
  },
  heroStat: {
    display: 'flex',
    flexDirection: 'column'
  },
  heroStatNumber: {
    color: '#fff',
    fontSize: '28px',
    fontWeight: 'bold'
  },
  heroStatLabel: {
    color: '#888',
    fontSize: '14px'
  },
  heroImage: {
    flex: 1,
    minWidth: '300px',
    display: 'flex',
    justifyContent: 'center'
  },
  heroImagePlaceholder: {
    width: '100%',
    maxWidth: '400px',
    height: '350px',
    background: '#16213e',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '100px'
  },
  featuresSection: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '60px 20px'
  },
  sectionTitle: {
    color: '#fff',
    fontSize: '36px',
    textAlign: 'center',
    marginBottom: '12px'
  },
  sectionHighlight: {
    color: '#e94560'
  },
  sectionSubtitle: {
    color: '#888',
    fontSize: '18px',
    textAlign: 'center',
    marginBottom: '40px'
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '24px'
  },
  featureCard: {
    background: '#16213e',
    borderRadius: '12px',
    padding: '30px',
    textAlign: 'center',
    transition: 'transform 0.3s'
  },
  featureIcon: {
    fontSize: '48px',
    display: 'block',
    marginBottom: '16px'
  },
  featureTitle: {
    color: '#fff',
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '8px'
  },
  featureDesc: {
    color: '#888',
    fontSize: '14px',
    lineHeight: '1.6'
  },
  footer: {
    background: '#0f0f1a',
    borderTop: '1px solid #1a1a2e',
    padding: '40px 20px 20px'
  },
  footerContent: {
    maxWidth: '1200px',
    margin: '0 auto'
  },
  footerGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '40px',
    marginBottom: '30px'
  },
  footerCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  footerTitle: {
    color: '#e94560',
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '8px'
  },
  footerHeading: {
    color: '#fff',
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '8px'
  },
  footerText: {
    color: '#888',
    fontSize: '14px',
    lineHeight: '1.6',
    margin: '2px 0'
  },
  footerLink: {
    color: '#888',
    textDecoration: 'none',
    fontSize: '14px',
    margin: '2px 0',
    cursor: 'pointer'
  },
  footerBottom: {
    borderTop: '1px solid #1a1a2e',
    paddingTop: '20px',
    textAlign: 'center'
  },
  footerCopy: {
    color: '#555',
    fontSize: '14px'
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    background: '#0a0a1a',
    minHeight: '80vh'
  },
  welcomeSection: {
    textAlign: 'center',
    padding: '20px 0 30px 0'
  },
  welcomeTitle: {
    color: '#fff',
    fontSize: '32px'
  },
  welcomeSubtitle: {
    color: '#888',
    fontSize: '16px'
  },
  section: {
    marginBottom: '40px'
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  viewAllBtn: {
    color: '#e94560',
    background: 'transparent',
    border: 'none',
    fontSize: '14px',
    cursor: 'pointer'
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '20px'
  },
  infoCard: {
    background: '#16213e',
    borderRadius: '12px',
    padding: '20px',
    textAlign: 'center'
  },
  infoIcon: {
    fontSize: '40px',
    display: 'block',
    marginBottom: '10px'
  },
  infoTitle: {
    color: '#fff',
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '8px'
  },
  infoDesc: {
    color: '#888',
    fontSize: '14px',
    lineHeight: '1.6'
  },
  centerBtn: {
    textAlign: 'center',
    marginTop: '20px'
  },
  exploreBtn: {
    padding: '12px 35px',
    background: '#e94560',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  servicesSection: {
    marginTop: '40px',
    paddingTop: '30px',
    borderTop: '1px solid #2a2a4e'
  },
  servicesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px',
    marginTop: '20px'
  },
  serviceCard: {
    background: '#16213e',
    borderRadius: '12px',
    padding: '20px',
    textAlign: 'center'
  },
  serviceIcon: {
    fontSize: '40px',
    display: 'block',
    marginBottom: '10px'
  },
  serviceName: {
    color: '#fff',
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '8px'
  },
  serviceDesc: {
    color: '#888',
    fontSize: '14px',
    lineHeight: '1.6'
  }
};

export default Home;
