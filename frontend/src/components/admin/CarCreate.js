import React, {useEffect, useState} from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

const CarsCreate = (onCreateProduct  ) => {
  const [produsData, setProdusData] = useState({
    name: '',
    producator: '',
    uploaded_images: [], // Array pentru a stoca imaginile încărcate
    cutia: 2,
    motor:6,
    numar_usi: 2,
    numar_pasageri: 4,
    Limita_de_KM: 'fără limită',
    descriere: '',
    caroserie: 13,
    price1: 0,
    price2: 0,
    price3: 0,
    price4: 0,
    price5: 0,
    an: new Date().getFullYear(),
    capacitate_cilindrica: 1.0,
  });
    const [userIsSuperUser, setUserIsSuperUser] = useState(false);


  const fetchUserAccess = async () => {
    try {
      const storedAccessToken = sessionStorage.getItem('accessToken');
      if (storedAccessToken) {
        const response = await axios.get('http://localhost:8000/api/users/users-profile', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${storedAccessToken}`,
          },
        });
        if (response.status === 200 && response.data.length > 0) {
          const user = response.data[0];
          if (user.user && user.user.email) {
            const userEmail = user.user.email;
            const userResponse = await axios.get(`http://localhost:8000/api/users/get-user-id-by-email/${userEmail}/`);
            setUserIsSuperUser(userResponse.data.is_superuser > 0);
            console.log(setUserIsSuperUser)
          }
        }
      }
    } catch (error) {
      console.error('Error fetching user access:', error);
    }
  };

  useEffect(() => {
    fetchUserAccess();
  }, []);
  const onDrop = (acceptedFiles) => {
    setProdusData({
      ...produsData,
      uploaded_images: acceptedFiles,
    });
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/*',
    multiple: true,
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProdusData({
      ...produsData,
      [name]: value,
    });
  };
const handleCutieChange = (event) => {
    const { value } = event.target;
    setProdusData({
      ...produsData,
      cutia: parseInt(value, 10),
    });
  };

  const handleNumar_pasageriChange = (event) => {
    const { value } = event.target;
    setProdusData({
      ...produsData,
      numar_pasageri: parseInt(value, 10),
    });
  };
  const handleNumar_usiChange = (event) => {
    const { value } = event.target;
    setProdusData({
      ...produsData,
      numar_usi: parseInt(value, 10),
    });
  };
  const handleCaroserieChange = (event) => {
    const { value } = event.target;
    setProdusData({
      ...produsData,
      caroserie: parseInt(value, 10),
    });
  };

  const handleMotorChange = (event) => {
    const { value } = event.target;
    setProdusData({
      ...produsData,
      motor: parseInt(value, 10),
    });
  };

const handlePrice1Change = (event) => {
  const { value } = event.target;
  setProdusData({
    ...produsData,
    price1: parseInt(value, 10) || 0, // Converți valoarea în întreg și asigură-te că nu este NaN
  });
};
const handlePrice2Change = (event) => {
  const { value } = event.target;
  setProdusData({
    ...produsData,
    price2: parseInt(value, 10) || 0, // Converți valoarea în întreg și asigură-te că nu este NaN
  });
};
const handlePrice3Change = (event) => {
  const { value } = event.target;
  setProdusData({
    ...produsData,
    price3: parseInt(value, 10) || 0, // Converți valoarea în întreg și asigură-te că nu este NaN
  });
};
const handlePrice4Change = (event) => {
  const { value } = event.target;
  setProdusData({
    ...produsData,
    price4: parseInt(value, 10) || 0, // Converți valoarea în întreg și asigură-te că nu este NaN
  });
};
const handlePrice5Change = (event) => {
  const { value } = event.target;
  setProdusData({
    ...produsData,
    price5: parseInt(value, 10) || 0, // Converți valoarea în întreg și asigură-te că nu este NaN
  });
};

const CAPACITATE_CHOICES = [];
for (let i = 10; i <= 40; i++) {
  const value = i / 10;
  CAPACITATE_CHOICES.push([value, value.toString()]);
}
const currentYear = new Date().getFullYear();
const startYear = 2000;
const AN_CHOICES = Array.from({ length: currentYear - startYear + 1 }, (_, index) => {
  const year = startYear + index;
  return [year, year.toString()];
});


  const handleSubmit = async (event, fetchCar) => {
  event.preventDefault();
  try {
    const storedAccessToken = sessionStorage.getItem('accessToken');
    if (userIsSuperUser && storedAccessToken) {
      const formData = new FormData();
      formData.append('name', produsData.name);
      formData.append('producator', produsData.producator);
      formData.append('cutia', produsData.cutia);
      formData.append('motor', produsData.motor);
      formData.append('numar_usi', produsData.numar_usi);
      formData.append('numar_pasageri', produsData.numar_pasageri);
      formData.append('Limita_de_KM', produsData.Limita_de_KM);
      formData.append('caroserie', produsData.caroserie);
      formData.append('descriere', produsData.descriere);
      formData.append('price1', produsData.price1);
      formData.append('price2', produsData.price2);
      formData.append('price3', produsData.price3);
      formData.append('price4', produsData.price4);
      formData.append('price5', produsData.price5);
      formData.append('an', produsData.an);
      formData.append('capacitate_cilindrica', produsData.capacitate_cilindrica);
      produsData.uploaded_images.forEach((image, index) => {
        formData.append(`uploaded_images[${index}]`, image);
      });

      await axios.post('http://localhost:8000/api/produs/car-create', formData, {
        headers: {
          Authorization: `Bearer ${storedAccessToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      // Succes! Produsul a fost creat împreună cu imaginile asociate.
      onCreateProduct(true);
    }
    fetchCar();
  } catch (error) {
    // Tratează erorile de aici, poți să afișezi un mesaj utilizatorului sau să faci alte acțiuni.
    console.error('Eroare la crearea produsului:', error);
  }
};


  return (
      <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        placeholder="Nume produs"
        value={produsData.name}
        onChange={handleInputChange}
      />
      <input
        type="text"
        name="producator"
        placeholder="Producător"
        value={produsData.producator}
        onChange={handleInputChange}
      />
      <br />
      <br />
      <br /><br />

      <label>
        Cutie:
        <select value={produsData.cutia} onChange={handleCutieChange}>
          <option value={0}>Manual</option>
          <option value={1}>Automat</option>
          <option value={2}>Not specified</option>
        </select>
      </label>
      <br />
      <label>
        Motor:
        <select value={produsData.motor} onChange={handleMotorChange}>
          <option value={0}>Diesel</option>
          <option value={1}>Hybrid</option>
          <option value={2}>Petrol</option>
          <option value={3}>Electric</option>
          <option value={4}>Petrol-Hybrid</option>
          <option value={5}>Petrol-Gaz</option>
          <option value={6}>Not specified</option>
        </select>
      </label>
      <br />
      <label>
        Număr uși:
        <select name="numar_usi" value={produsData.numar_usi} onChange={handleNumar_usiChange}>
          <option value={0}>3</option>
          <option value={1}>5</option>
          <option value={2}>Not specified</option>
        </select>
      </label>
      <br />
      <label>
        Număr pasageri:
        <select name="numar_pasageri" value={produsData.numar_pasageri} onChange={handleNumar_pasageriChange}>
          <option value={0}>2</option>
          <option value={1}>4</option>
          <option value={2}>5</option>
          <option value={3}>7</option>
          <option value={4}>Not specified</option>
        </select>
      </label>
      <br />
      <label>
        Limita de KM:
        <input
          type="text"
          name="Limita_de_KM"
          value={produsData.Limita_de_KM}
          onChange={handleInputChange}
        />
      </label>
      <br />
       <label>
        An:
        <select name="an" value={produsData.an} onChange={handleInputChange}>
          {AN_CHOICES.map((option) => (
            <option key={option[0]} value={option[0]}>
              {option[1]}
            </option>
          ))}
        </select>
      </label>
      <br />
      <label>
        Capacitate cilindrică:
        <select name="capacitate_cilindrica" value={produsData.capacitate_cilindrica} onChange={handleInputChange}>
          {CAPACITATE_CHOICES.map((option) => (
            <option key={option[0]} value={option[0]}>
              {option[1]}
            </option>
          ))}
        </select>
      </label>
      <br />


      <label>
        Descriere:
        <textarea
          name="descriere"
          value={produsData.descriere}
          onChange={handleInputChange}
        />
      </label>
      <br />
      <label>
        Caroserie:
        <select name="caroserie" value={produsData.caroserie} onChange={handleCaroserieChange}>
          <option value={0}>Van</option>
          <option value={1}>Universal</option>
          <option value={2}>Minivan</option>
          <option value={3}>Roadster</option>
          <option value={4}>SUV</option>
          <option value={5}>Cabriolet</option>
          <option value={6}>Microvan</option>
          <option value={7}>Pickup</option>
          <option value={8}>Sedan</option>
          <option value={9}>Crossover</option>
          <option value={10}>Hatchback</option>
          <option value={11}>Combi</option>
          <option value={12}>Coupe</option>
          <option value={13}>Not specified</option>
        </select>
      </label>
      <br />
      <label>
      1-2 Zile:
      <input
        type="number"
        value={produsData.price1}
        onChange={handlePrice1Change}
      />
    </label>
      <br />
      <label>
      3-7 Zile:
      <input
        type="number"
        value={produsData.price2}
        onChange={handlePrice2Change}
      />
    </label>
      <br />
      <label>
      8-20 Zile:
      <input
        type="number"
        value={produsData.price3}
        onChange={handlePrice3Change}
      />
    </label>
      <br />
      <label>
      21-45 Zile:
      <input
        type="number"
        value={produsData.price4}
        onChange={handlePrice4Change}
      />
    </label>
      <br />
      <label>
      46+ Zile:
      <input
        type="number"
        value={produsData.price5}
        onChange={handlePrice5Change}
      />
    </label>
      <br />


      <div {...getRootProps()} style={dropzoneStyles}>
        <input {...getInputProps()} />
        <p>Trageți fișierele aici sau faceți clic pentru a le încărca</p>
      </div>


      <button type="submit">Creează Produs</button>
    </form>
  );
};

const dropzoneStyles = {
  border: '2px dashed #cccccc',
  borderRadius: '4px',
  padding: '20px',
  textAlign: 'center',
  cursor: 'pointer',
  marginTop: '20px',
};

export default CarsCreate;
