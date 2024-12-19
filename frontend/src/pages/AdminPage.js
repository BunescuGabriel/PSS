import React from "react";
import Header from "../components/Header";
import Meniul from "../components/admin/Meniul";
import Footer from "../components/Footer";


const AdminPage = () => {
  return (
    <div>
      <Header />
        <Meniul/>
        <Footer/>
    </div>
  );
}

export default AdminPage;
