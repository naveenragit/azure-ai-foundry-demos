import React from 'react';

const SimpleTest: React.FC = () => {
  console.log('SimpleTest component rendering');
  
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#f0f0f0',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <h1 style={{ color: '#333', marginBottom: '10px' }}>Authentication Test</h1>
        <p style={{ color: '#666' }}>This is a simple test to verify rendering works.</p>
        <button 
          onClick={() => console.log('Test button clicked')}
          style={{
            backgroundColor: '#0066cc',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Test Button
        </button>
      </div>
    </div>
  );
};

export default SimpleTest;