import React, { useState } from 'react';
import Header from '../components/Header';
import Register from '../components/register/Register';
import CreateProfile from "../components/register/CreateProfile";
import '../styles/RegisterPage.css';
import Footer from "../components/Footer";


function RegisterPage() {
  const [userData, setUserData] = useState(null);
  const [step, setStep] = useState(1);

  const handleRegistrationSuccess = (user_id) => {
    console.log('User registered with ID:', user_id);
    setUserData({ id: user_id });

    setStep(2);
  };

  const handleProfileCreationSuccess = () => {
    setStep(2);
  };

  return (
    <div>
      <Header />

      {/* Bara de progres */}
      <div className="progress-bar">
        <div className={`step1 ${step >= 1 ? 'active' : ''}`}>Pasul 1</div>
        <div className={`step2 ${step >= 2 ? 'active' : ''}`}>Pasul 2</div>
      </div>

      {/* Verificați pasul și afișați înregistrarea sau următorul pas (Address sau Profile) */}
      {step === 1 && <Register onRegistrationSuccess={handleRegistrationSuccess} />}

      {step === 2 && (
        <>

          {/* Pasați datele de utilizator către componenta CreateProfile și gestionați trecerea automată */}
          {userData && (
            <CreateProfile userData={userData} onProfileCreationSuccess={handleProfileCreationSuccess} />
          )}
        </>
      )}
        <Footer/>
    </div>
  );
}

export default RegisterPage;
