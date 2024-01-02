import React from 'react';
import FacebookLogin from '@greatsumini/react-facebook-login';
import './facebookButton.css';

const FacebookButton = ({ onFacebookLogin }) => {
  const responseFacebook = (response) => {
    // Handle the Facebook login response here
    localStorage.setItem("isAuthenticated", true);
    console.log(response);
  };

  return (
    // <FacebookLogin
    //   appId="3651954641706672"
    //   autoLoad={false}
    //   fields="name,email,picture"
    //   callback={responseFacebook}
    //   cssClass="btnFacebook"
    // />
    <FacebookLogin
    appId="3651954641706672"
    initParams={{
      version: 'v10.0',
    }}
    style={{
      backgroundColor: '#4267b2',
      color: '#fff',
      fontSize: '16px',
      padding: '6px 24px',
      border: 'none',
      borderRadius: '4px',
      width: '218px',
      height:'35px'
    }}
  />
  );
};

export default FacebookButton;