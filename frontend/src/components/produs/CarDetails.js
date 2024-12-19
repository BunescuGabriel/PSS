import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import "../../styles/produs/CarDetails.css";
import "../../styles/produs/Rezervation.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import {
  faCar,
  faCarSide,
  faCog,
  faGasPump,
  faStar,
  faStarHalf,
  faTachometerAlt,
  faUser,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Carousel } from "react-responsive-carousel";
import ProductComments from "./Comments";
import AddComment from "./AddComments";
import Rating from "./Rating";
import ListRating from "./List_Rating";
import { FaIdBadge, FaPhone } from "react-icons/fa";
import Modal from 'react-modal';

Modal.setAppElement('#root');

const CarDetail = () => {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [totalRating, setTotalRating] = useState(0);
  const [totalVotes, setTotalVotes] = useState(0);
  const [formData, setFormData] = useState({
    prenume: "",
    virsta: "",
    phone: "",
    fromDate: "",
    fromTime: "",
    toDate: "",
    toTime: "",
  });
  const [messageSent, setMessageSent] = useState(false);
  const [error, setError] = useState("");
  const [totalDays, setTotalDays] = useState(0);
  const intervalRef = useRef(null); // Referință către interval
const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const renderStars = (rating) => {
    const stars = [];
    const totalStars = 5;
    const filledStars = Math.floor(rating);
    const hasHalfStar = rating - filledStars !== 0;

    for (let i = 0; i < totalStars; i++) {
      if (i < filledStars) {
        stars.push(
          <FontAwesomeIcon icon={faStar} key={i} color="#FFD700" />
        );
      } else if (hasHalfStar && i === filledStars) {
        stars.push(
          <FontAwesomeIcon icon={faStarHalf} key={i} color="#FFD700" />
        );
      } else {
        stars.push(
          <FontAwesomeIcon icon={faStar} key={i} color="#C0C0C0" />
        );
      }
    }
    return stars;
  };

  const fetchCarData = () => {
    fetch(`http://localhost:8000/api/produs/car/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setCar(data);
        setTotalRating(data.total_rating);
      })
      .catch((error) => {
        console.error("Error fetching car details:", error);
      });
  };

  useEffect(() => {
    const onFocus = () => {
      fetchCarData();
      startInterval(); // Repornim intervalul când fereastra devine activă
    };

    const onBlur = () => {
      stopInterval(); // Oprim intervalul când fereastra devine inactivă
    };

    window.addEventListener("focus", onFocus);
    window.addEventListener("blur", onBlur);

    fetchCarData();
    startInterval(); // Pornim intervalul când componenta este montată

    return () => {
      // Curățăm evenimentele la demontare
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("blur", onBlur);
      stopInterval(); // Oprim intervalul când componenta este demontată
    };
  }, [id]);

  const startInterval = () => {
    intervalRef.current = setInterval(fetchCarData, 5000);
  };

  const stopInterval = () => {
    clearInterval(intervalRef.current);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePhoneChange = (value) => {
    setFormData({
      ...formData,
      phone: value,
    });
  };

  useEffect(() => {
    const calculateTotalDays = () => {
      if (formData.fromDate && formData.toDate) {
        const fromDateTime = new Date(formData.fromDate).getTime();
        const toDateTime = new Date(formData.toDate).getTime();
        const timeDifference = toDateTime - fromDateTime;
        const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
        setTotalDays(daysDifference);
      } else {
        setTotalDays(0);
      }
    };

    calculateTotalDays();
  }, [formData.fromDate, formData.toDate]);


const sendRezervation = async () => {
  if (
    formData.prenume &&
    formData.virsta &&
    formData.phone &&
    formData.fromDate &&
    formData.fromTime &&
    formData.toDate &&
    formData.toTime
  ) {
    try {
      const updatedFormData = {
        ...formData,
        carInfo: {
          id: car.id,
          name: car.name,
          producator: car.producator,
          gaj: car.gaj,
        },
        totalDays: totalDays,
        priceForTotalDays: calculatePrice(),
        Pret_final: calculateFinalPrice().finalPrice,
        noapte_preluare:calculateFinalPrice().fromNightTax,
        noapte_returnare:calculateFinalPrice().toNightTax

      };


      const response = await fetch(
        "http://localhost:8000/api/produs/reservation-email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedFormData),
        }
      );
      if (response.ok) {
        setMessageSent(true);
        setError("");
        setFormData({
          prenume: "",
          virsta: "",
          phone: "",
          fromDate: "",
          fromTime: "",
          toDate: "",
          toTime: "",
        });
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Eroare la trimiterea mesajului");
        setMessageSent(false);
      }
    } catch (error) {
      setError(`Eroare la trimiterea mesajului: ${error}`);
      setMessageSent(false);
    }
  } else {
    setError("Te rog completează toate câmpurile.");
    setMessageSent(false);
  }
};

const isNightTime = (hour, day) => {
  if (day === 0) { // Duminică
    return true;
  } else if (day === 6) { // Sâmbătă
    return hour >= 16 || hour < 8;
  } else {
    return hour >= 18 || hour < 8;
  }
};

const calculateFinalPrice = () => {
  const fromDate = new Date(formData.fromDate + 'T' + formData.fromTime);
  const toDate = new Date(formData.toDate + 'T' + formData.toTime);

  let price = calculatePrice();

  const nightTimeTaxStart = 10;

  const fromNightTax = isNightTime(fromDate.getHours(), fromDate.getDay()) ? nightTimeTaxStart : 0;
  const toNightTax = isNightTime(toDate.getHours(), toDate.getDay()) ? nightTimeTaxStart : 0;

  const finalPrice = price * totalDays + fromNightTax + toNightTax;

  return {
    finalPrice: finalPrice,
    fromNightTax: fromNightTax,
    toNightTax: toNightTax
  };
};




const calculatePrice = () => {
  let price = 0;

  if (totalDays >= 1 && totalDays <= 2) {
    price = car.price1;
  } else if (totalDays >= 3 && totalDays <= 7) {
    price = car.price2;
  } else if (totalDays >= 8 && totalDays <= 20) {
    price = car.price3;
  } else if (totalDays >= 21 && totalDays <= 45) {
    price = car.price4;
  } else if (totalDays >= 46) {
    price = car.price5;
  }

  return price;
};


const openModal = (index) => {
  setCurrentSlide(index);
  setIsModalOpen(true);
};

const closeModal = () => {
  setIsModalOpen(false);
};

const afterOpenModal = () => {
  // Set focus or perform actions after modal opens, if needed
};

  if (!car) {
    return <div>Loading...</div>;
  }

  return (
      <div>
    <div className="car-detail">
      <div className="column1">

        {/*<Carousel showStatus={false} showThumbs={true} infiniteLoop={true}>*/}
        {/*    {car && car.images && car.images.map((image, index) => (*/}
        {/*    <div key={index}>*/}
        {/*        <img src={image.image} alt={`Image`} />*/}
        {/*    </div>*/}
        {/*    ))}*/}
        {/*</Carousel>*/}

          <Carousel
          showStatus={false}
          showThumbs={true}
          infiniteLoop={true}
          onClickItem={openModal}
          selectedItem={currentSlide}
        >
            {car && car.images && car.images.map((image, index) => (
            <div key={index}>
                <img src={image.image} alt={`Image`} />
            </div>
            ))}
        </Carousel>

        <Modal
          isOpen={isModalOpen}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          contentLabel="Image Carousel Modal"
          className="modal-caruseli-image"
          overlayClassName="overlay"
        >
          <button onClick={closeModal} className="close-modal-caruseli-image">X</button>
          <Carousel
            showStatus={false}
            showThumbs={false}
            infiniteLoop={true}
            selectedItem={currentSlide}
          >
              {car && car.images && car.images.map((image, index) => (
              <div key={index}>
                  <img src={image.image} alt={`Image`} />
              </div>
              ))}
          </Carousel>
        </Modal>


        <Rating productId={id} />
          <div className="container-rating-coment">
            <div className="column-totalR">
                <div className={"container-stars"}>
                    <div className="column-totalRating">
                        <p className="car-totalRating">{totalRating}</p>
                    </div>
                    <div className="star-icons">
                        <div className={"renderStars"}>
                            {renderStars(totalRating)}
                        </div>
                        <div className={"Votes"}>
                          <p className={"vot"}>{totalVotes}</p>
                        </div>
                    </div>
                </div>

            </div>
            <div className="column-Rating">
                <ListRating productId={id} onUpdateTotalVotes={(votes) => setTotalVotes(votes)} />
            </div>
          </div>



      </div>

      <div className="column2">
        <p className="car-infoo">
          {car.producator} {car.name}
        </p>

         <div className="car-detail">
      <div className="column-atribute">
        <p className="car-info">
          <FontAwesomeIcon icon={faCar} /> An: {car.an}
        </p>
        <p className="car-info">
          <FontAwesomeIcon icon={faCog} /> Cutia: {car.cutia === 0
            ? "Manual"
            : car.cutia === 1
            ? "Automat"
            : "Unspecified"}
        </p>
        <p className="car-info">
          <FontAwesomeIcon icon={faGasPump} /> Motor: {car.motor === 0
            ? "Diesel"
            : car.motor === 1
            ? "Hybrid"
            : car.motor === 2
            ? "Petrol"
            : car.motor === 3
            ? "Electric"
            : car.motor === 4
            ? "Petrol-Hybrid"
            : car.motor === 5
            ? "Petrol-Gaz"
            : "Unspecified"}
        </p>
        <p className="car-info">
          <FontAwesomeIcon icon={faCog} /> Capacitate cilindrică: {car.capacitate_cilindrica}
        </p>
      </div>
      <div className="column-atribute">
        <p className="car-info">
          <FontAwesomeIcon icon={faCar} /> Numar usi: {car.numar_usi === 0
            ? "3"
            : car.numar_usi === 1
            ? "5"
            : "Unspecified"}
        </p>
        <p className="car-info">
          <FontAwesomeIcon icon={faUsers} /> Numar Pasageri: {car.numar_pasageri === 0
            ? "2"
            : car.numar_pasageri === 1
            ? "4"
            : car.numar_pasageri === 2
            ? "5"
            : car.numar_pasageri === 3
            ? "7"
            : "Unspecified"}
        </p>
        <p className="car-info">
          <FontAwesomeIcon icon={faTachometerAlt} /> Limita de KM: {car.Limita_de_KM}
        </p>
        <p className="car-info">
          <FontAwesomeIcon icon={faCarSide} /> Tip Caroserie: {car.caroserie === 0
            ? "Van"
            : car.caroserie === 1
            ? "Universal"
            : car.caroserie === 2
            ? "Minivan"
            : car.caroserie === 3
            ? "Roadster"
            : car.caroserie === 4
            ? "SUV"
            : car.caroserie === 5
            ? "Cabriolet"
            : car.caroserie === 6
            ? "Microvan"
            : car.caroserie === 7
            ? "Pickup"
            : car.caroserie === 8
            ? "Sedan"
            : car.caroserie === 9
            ? "Crossover"
            : car.caroserie === 10
            ? "Hatchback"
            : car.caroserie === 11
            ? "Combi"
            : car.caroserie === 12
            ? "Coupe"
            : "Unspecified"}
        </p>
      </div>
    </div>
          <p className="car-description">{car.descriere}</p>

          <div className="table-container">
              <p className="car-Preturi">
          Prețuri chirie auto
        </p>
  <table className="car-table">
    <thead>
      <tr>
        <th>1-2 Zile</th>
        <th>3-7 Zile</th>
        <th>8-20 Zile</th>
        <th>21-45 Zile</th>
        <th>46+ Zile</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>{car.price1} €</td>
        <td>{car.price2} €</td>
        <td>{car.price3} €</td>
        <td>{car.price4} €</td>
        <td>{car.price5} €</td>
      </tr>
    </tbody>
  </table>
</div>

            <div className={"Rezervation"}>
  <h2 className="rezervation-title">Crează o rezervare</h2>
  <div className="rezervation-container">
    <input
      type="date"
      name="fromDate"
      className="rezervation-input"
      placeholder="Din data"
      value={formData.fromDate}
      onChange={handleChange}
      min={new Date().toISOString().split("T")[0]}
    />
      <input
  type="time"
  name="fromTime"
  className="rezervation-input"
  placeholder="Ora de la"
  value={formData.fromTime}
  onChange={handleChange}
/>
    <input
      type="date"
      name="toDate"
      className="rezervation-input"
      placeholder="Până în data"
      value={formData.toDate}
      onChange={handleChange}
      min={formData.fromDate || new Date().toISOString().split("T")[0]}
    />
      <input
  type="time"
  name="toTime"
  className="rezervation-input"
  placeholder="Ora până la"
  value={formData.toTime}
  onChange={handleChange}
/>
      <div className={"icon-rezervation"}>
          <FontAwesomeIcon icon={faUser} className="iconnn" />
    <input
      type="text"
      name="prenume"
      className="name-input-rezervation"
      placeholder="Name/Prenume"
      value={formData.prenume}
      onChange={handleChange}
    />
      </div>
      <div className={"icon-rezervation"}>
          < FaIdBadge   className="iconnn" />

    <input
      type="text"
      name="virsta"
      className="email-input-rezervation"
      placeholder="Vîrsta Șofer"
      value={formData.virsta}
      onChange={handleChange}
    />
      </div>

      <div className={"icon-rezervation"}>
                <FaPhone className="iconnn" />
                <PhoneInput
                  country={"md"}
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  inputProps={{
                    name: "phone",
                    className: "phone-input-rezervation",
                    placeholder: "Telefon",
                  }}
                />
              </div>

      <div className={"pret-zile-rezervare"}>
          <p>Gaj:<span className="align-right">{car.gaj} €</span></p>
          <p>Preț pentru o zi <span className="align-right">{calculatePrice()} €</span></p>
          <p>Total zile <span className="align-right">x{totalDays}</span></p>
          <p>Taxa de noapte preluare <span className="align-right">{calculateFinalPrice().fromNightTax} €</span></p>
          <p>Taxa de noapte returnare <span className="align-right">{calculateFinalPrice().toNightTax} €</span></p>

        <p>Preț final <span className="align-right red-text">{calculateFinalPrice().finalPrice} €</span></p>


      </div>


      {error && <p className="error-message-rezervation">{error}</p>}
      {messageSent &&
          <p className="success-message-rezervation">Mesaj trimis cu succes! În scurt timp vă vom telefona.</p>}
      <button className="btn-send-rezervation" onClick={sendRezervation}>
          Trimite
      </button>
  </div>
</div>


      </div>
    </div>
        <div>
            <AddComment productId={id} />
        </div>
          <div>
            <ProductComments productId={id} />
        </div>
          </div>

  );
};


export default CarDetail;
