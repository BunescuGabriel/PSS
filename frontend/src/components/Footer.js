import React from 'react';
import '../styles/Footer.css';
import { FaEnvelope, FaFacebook, FaInstagram, FaMapMarkerAlt} from "react-icons/fa";
import logo from "../images/logo.jpg";
import logo2 from "../images/logo2.png";


const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-left">
          <a  href="/"><img src={logo} alt="Home" className="logo-img-footer" /></a>
          <p>Contactați-ne pentru închirierea auto în Bălți prin intermediul rețelelor sociale, telefon, Viber, Facebook sau Telegram.</p>
        </div>
        <div className="footer-right">
          <h4>Linkuri Utile</h4>
          <ul>
            <li><a href="/">Acasă</a></li>
          <li><a href="/about">DESPRE NOI</a></li>
          <li><a href="/conditii">TERMENI ȘI CONDIȚII</a></li>
          </ul>
        </div>
           <div className="footer-right">
          <h4>OFICIUL CENTRAL</h4>
          <ul>
        <p className="contact-info">
                <a  className={"contact-linkk"}  href="https://www.google.com/maps/search/?api=1&query=Balti+str.+Kiev+48A">
                    <FaMapMarkerAlt /> Balti str. Kiev 48A
                        </a>
                </p>
        <p className="contact-info">
          <FaInstagram /> <a className={"contact-linkk"} href="https://www.instagram.com/supreme__rentals/" target="_blank" rel="noopener noreferrer">Supreme Rentals</a>
        </p>
        <p className="contact-info">
          <FaFacebook /> <a className={"contact-linkk"} href="https://www.facebook.com/ChirieAutoBALTI" target="_blank" rel="noopener noreferrer">Supreme Rentals</a>
        </p>
            <p className="contact-info">
              <a className={"contact-linkk"} href="mailto:adresa@email.com" target="_blank" rel="noopener noreferrer"><FaEnvelope />supremerentals.srl@gmail.com</a>
          </p>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Supreme Rentals. Toate drepturile rezervate.</p>
      </div>
    </footer>
  );
};

export default Footer;
