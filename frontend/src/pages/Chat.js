import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import io from 'socket.io-client';

const Chat = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Connect to socket
    const socketInstance = io('http://localhost:5000');
    socketRef.current = socketInstance;
    setSocket(socketInstance);

    socketInstance.emit('join', user.id);

    socketInstance.on('newMessage', (data) => {
      setMessages((prev) => [...prev, data]);
    });

    socketInstance.on('users', (users) => {
      setOnlineUsers(users);
    });

    socketInstance.on('userTyping', (data) => {
      if (data.userId !== user.id) {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 3000);
      }
    });

    fetchMessages();

    return () => {
      socketInstance.disconnect();
    };
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const response = await API.get('/messages/my-messages');
      setMessages(response.data.messages || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageData = {
      message: newMessage,
      senderId: user.id,
      senderName: user.name,
      senderEmail: user.email,
      timestamp: new Date().toISOString()
    };

    // Send to socket
    socketRef.current.emit('sendMessage', messageData);

    // Save to database
    try {
      await API.post('/messages', { message: newMessage });
    } catch (error) {
      console.error('Error saving message:', error);
    }

    setMessages((prev) => [...prev, messageData]);
    setNewMessage('');
  };

  const handleTyping = () => {
    socketRef.current.emit('typing', { userId: user.id, name: user.name });
  };

  if (loading) {
    return React.createElement('div', { style: { color: '#fff', textAlign: 'center', padding: '50px' } }, 'Loading chat...');
  }

  return React.createElement(
    'div',
    { style: { maxWidth: '800px', margin: '0 auto', padding: '20px', background: '#0a0a1a', minHeight: '80vh' } },
    React.createElement(
      'div',
      { style: { background: '#16213e', borderRadius: '12px', overflow: 'hidden', height: '70vh', display: 'flex', flexDirection: 'column' } },
      // Header
      React.createElement(
        'div',
        { style: { padding: '15px 20px', borderBottom: '1px solid #2a2a4e', display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
        React.createElement('h2', { style: { color: '#fff', margin: 0 } }, '💬 Live Chat'),
        React.createElement(
          'span',
          { style: { color: '#888', fontSize: '12px' } },
          '👤 ',
          onlineUsers.length,
          ' online'
        )
      ),
      // Messages
      React.createElement(
        'div',
        { style: { flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' } },
        messages.length === 0 ? (
          React.createElement('p', { style: { color: '#888', textAlign: 'center', marginTop: '20px' } }, 'No messages yet. Start chatting!')
        ) : (
          messages.map((msg, index) =>
            React.createElement(
              'div',
              { key: index, style: { alignSelf: msg.senderId === user.id ? 'flex-end' : 'flex-start', maxWidth: '70%' } },
              React.createElement(
                'div',
                { style: { background: msg.senderId === user.id ? '#e94560' : '#2a2a4e', padding: '10px 14px', borderRadius: msg.senderId === user.id ? '12px 12px 0 12px' : '12px 12px 12px 0' } },
                React.createElement('div', { style: { color: '#fff', fontSize: '14px' } }, msg.message),
                React.createElement('div', { style: { color: '#888', fontSize: '10px', marginTop: '4px' } }, msg.senderName || 'User')
              )
            )
          )
        ),
        isTyping && React.createElement(
          'div',
          { style: { color: '#888', fontSize: '12px', fontStyle: 'italic' } },
          'Someone is typing...'
        ),
        React.createElement('div', { ref: messagesEndRef })
      ),
      // Input
      React.createElement(
        'form',
        { onSubmit: handleSendMessage, style: { padding: '12px 16px', borderTop: '1px solid #2a2a4e', display: 'flex', gap: '10px' } },
        React.createElement('input', {
          type: 'text',
          placeholder: 'Type a message...',
          value: newMessage,
          onChange: (e) => setNewMessage(e.target.value),
          onKeyUp: handleTyping,
          style: { flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #2a2a4e', background: '#0a0a1a', color: '#fff' }
        }),
        React.createElement(
          'button',
          { type: 'submit', style: { padding: '10px 20px', background: '#e94560', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' } },
          'Send'
        )
      )
    )
  );
};

export default Chat;
