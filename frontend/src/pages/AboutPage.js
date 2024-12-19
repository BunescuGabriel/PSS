import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AboutComponent from "../components/about/DespreNoi";
import ContactComponent from "../components/about/Contact";
import Intro from "../components/about/Harta";

const AboutPage = () => {
  return (
    <div>
      <Header />
      <AboutComponent />
        <ContactComponent/>
        {/*<Intro/>*/}
        <Footer/>
    </div>
  );
}

export default AboutPage;
