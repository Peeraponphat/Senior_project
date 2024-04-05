import React from 'react';
import { useNavigate } from 'react-router-dom';

const ErrorPage = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/formlogin');
  };

  return (
    <div id='error404' style={{ background: '#eceeee', textAlign: 'center', margin: 'auto', fontWeight: 700, fontSize: 45, fontFamily: 'Ruda, sans-serif', position: 'fixed', width: '100%', height: '100%', lineHeight: '1.25em', zIndex: 9999 }}>
      <div id='error-text' style={{ position: 'relative', fontSize: 40, color: '#666', top: '50%', right: '50%', transform: 'translate(50%,-50%)' }}>
        <span style={{ color: '#008c5f', fontSize: 100 }}>401</span>
        <p>Error Unauthorized Fail</p>
        <button
          className='back'
          onClick={handleLoginClick}
          style={{
            background: '#008c5f',
            color: '#fff',
            padding: '10px 20px',
            fontSize: 20,
            border: 'double #fff',
            WebkitTransform: 'scale(1)',
            MozTransform: 'scale(1)',
            transform: 'scale(1)',
            transition: 'all 0.5s ease-out',
            textDecoration: 'none',
            cursor: 'pointer'
          }}>
          Login
        </button>

      </div>
    </div>
  );
};

export default ErrorPage;
