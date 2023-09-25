import React from 'react';
import success from '../assets/success.gif';
import { House } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';

const OrderSuccess = () => {
  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    flexDirection: 'column',
  };

  const successImageStyle = {
    maxWidth: '100%',
    height: 'auto',
    borderRadius: '50%',
    marginTop: '20px',
  };

  const homeLinkStyle = {
    marginTop: '20px',
  };

  const mediaQueryStyle = {
    '@media (max-width: 768px)': {
      successImageStyle: {
        maxWidth: '80%',
      },
      homeIconStyle: {
        height: '30px',
        width: '30px',
      },
    },
  };

  return (
    <div style={containerStyle}>
      <div className='text-center d-flex' style={{flexDirection:'column'}}>
        <h2>Order Placed Successfully!!!</h2>
        <img src={success} alt='Success' style={successImageStyle} />
        <Link to='/' style={homeLinkStyle}>
         <House style={mediaQueryStyle['@media (max-width: 768px)'].homeIconStyle} />
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
