import React, {useState} from 'react';
import '../../styles/about/Contact.css';
import { FaPhone, FaMapMarkerAlt, FaClock, FaInstagram, FaFacebook,FaEnvelope,FaViber  } from 'react-icons/fa';

const ContactComponent = () => {
    const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
    const [messageSent, setMessageSent] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

 const sendMessage = async () => {
  // Verificăm dacă toate câmpurile sunt completate
  if (formData.name && formData.email && formData.phone && formData.message) {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/about/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessageSent(true);
        setError('');
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: '',
        });
        setTimeout(() => {
            setMessageSent(false);
          }, 5000);
      } else {
        setError('Eroare la trimiterea mesajului');
      }
    } catch (error) {
      setError('Eroare la trimiterea mesajului: ' + error.message);
    }
  } else {
    setError('Te rog completează toate câmpurile.');
  }
};


  return (
      <div>
          <h2 className="contact-title">Contacte</h2>
          <div className="contact-container-cont">
      <div className="column-cont1">
          <input
        type="text"
        placeholder="Nume/Prenume"
        className="contact-input contact-name"
        name="name"
        value={formData.name}
        onChange={handleChange}
      />
          <input
        type="Email"
        placeholder="Email"
        className="contact-input contact-email"
        name="email"
        value={formData.email}
        onChange={handleChange}
      />
          <input
        type="tel"
        placeholder="Telefon"
        className="contact-input contact-phone"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
      />
          <textarea
        placeholder="Mesaj"
        className="contact-textarea contact-textarea-message"
        name="message"
        value={formData.message}
        onChange={handleChange}
      ></textarea>
          {error && (
        <p>{error}</p>
      )}
      {messageSent && (
        <p>Mesaj trimis cu succes! În scurt timp vă vom telefona.</p>
      )}
      <button className="btn-send" onClick={sendMessage}>
        Trimite
      </button>

      </div>
      <div className="column-cont2">
        <h2 className="contact-titlee">OFICIUL CENTRAL</h2>
        <p className="contact-info">
          <FaPhone /> <a className={"contact-link"} href="tel:+37378733723" target="_blank" rel="noopener noreferrer">+373 787 33 723</a>
        </p>
        <p className="contact-info">
          <FaViber /> <a className={"contact-link"} href="tel:+37378733723" target="_blank" rel="noopener noreferrer">+373 787 33 723</a>
        </p>
        <p className="contact-info">
                <a  className={"contact-link"}  href="https://www.google.com/maps/search/?api=1&query=Balti+str.+Kiev+48A">
                    <FaMapMarkerAlt /> Balti str. Kiev 48A
                        </a>
                </p>
        <p className="contact-info">
          <FaInstagram /> <a className={"contact-link"} href="https://www.instagram.com/supreme__rentals/" target="_blank" rel="noopener noreferrer">Supreme Rentals</a>
        </p>
        <p className="contact-info">
          <FaFacebook /> <a className={"contact-link"} href="https://www.facebook.com/ChirieAutoBALTI" target="_blank" rel="noopener noreferrer">Supreme Rentals</a>
        </p>
          <p className="contact-info">
              <a className={"contact-link"} href="mailto:adresa@email.com" target="_blank" rel="noopener noreferrer"><FaEnvelope />supremerentals.srl@gmail.com</a>
          </p>
        <p className="contact-info"><FaClock /> Orar de lucru: 24/24</p>
      </div>
    </div>

            {/*<div className={"contact-harta"}>*/}
            {/*    <MapContainer />*/}
            {/*</div>*/}
      </div>

  );
};

export default ContactComponent;
