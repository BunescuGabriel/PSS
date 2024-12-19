import React from "react";
import Header from "../components/Header";
import TermeniComponent from "../components/about/Termeni";
import ConditiiComponent from "../components/about/Conditii";
import '../styles/about/termenipage.css';
import Footer from "../components/Footer";


const ConditiiPage = () => {
  return (
    <div>
      <Header />
        <div className="termeni-container">
      <h1 className={"TermeniCondiții"}>Termeni și Condiții</h1>
      <div className="termeni-section">
        <h2 className={"Term"}>Termeni :</h2>
        <ul className={"locatar"}>
          <li className={"locatart"}>Locator - Cel care dă în chirie</li>
          <li className={"locatart"}>Locatar - Cel care închiriază</li>
        </ul>
      </div>
    </div>
      <TermeniComponent/>
      <ConditiiComponent/>
        <Footer/>
    </div>
  );
}

export default ConditiiPage;
