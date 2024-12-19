import React from 'react';
import Login from '../components/login/Login';
import Header from "../components/Header";

import "../styles/LoginPage.css";
import Footer from "../components/Footer";

function LoginPage() {
  return (
    <div className="background">
        <Header />
      <Login />
        <Footer/>
    </div>
  );
}

export default LoginPage;
