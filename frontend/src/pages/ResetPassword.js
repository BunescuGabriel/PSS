import React from 'react';
import ResetPassword from '../components/login/Reset_Password';
import Header from "../components/Header";
import Footer from "../components/Footer";

function ResetPasswordPage () {
  return (
    <div>
        <Header />

      <ResetPassword />
        <Footer/>
    </div>
  );
}

export default ResetPasswordPage;
