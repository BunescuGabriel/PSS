import Header from "../components/Header";
import Banners from "../components/produs/Banners";
import Car from "../components/produs/Car";
import ServiceComponent from "../components/about/Servicii";
import ContactComponent from "../components/about/Contact";
import Footer from "../components/Footer";

const Home = () => {
    return (
        <div>
            <Header />
            <Banners />
            <Car />
            <ServiceComponent/>
            <ContactComponent/>
            <Footer/>

        </div>


    );
}

export default Home;