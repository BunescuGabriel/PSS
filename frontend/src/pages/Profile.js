import Header from "../components/Header";
import React from "react";
import Profil from "../components/profile/Profil";
import Address from "../components/profile/Address";
import Footer from "../components/Footer";

const Home = () => {
    return (
        <div>
             <Header />
      <Profil />
      {/*<Address />*/}
            <Footer/>
        </div>

    );
}

export default Home;