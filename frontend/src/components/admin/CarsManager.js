import React, { useState, useEffect } from "react";
import { Image, Spinner, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import '../../styles/admin/CarManager.css';
import '../../styles/admin/CarAdd.css';

import { useDropzone } from 'react-dropzone';
import axios from "axios";


const CarsManager = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddCarModal, setShowAddCarModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
    const [dropzoneActive, setDropzoneActive] = useState(false);
  const [userIsSuperUser, setUserIsSuperUser] = useState(false);
  const [showEditCarModal, setShowEditCarModal] = useState(false);
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
    gaj: 50,
    an: new Date().getFullYear(),
    capacitate_cilindrica: 0.8,
  });

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

  const fetchCar = () => {
    fetch("http://localhost:8000/api/produs/car")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Error fetching products");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCar();
    fetchUserAccess();
  }, []);

  const onDropForCreate = (acceptedFiles) => {
  setProdusData({
    ...produsData,
    uploaded_images: acceptedFiles,
  });
};

const { getRootProps: getRootPropsForCreate, getInputProps: getInputPropsForCreate } = useDropzone({
  onDrop: onDropForCreate,
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
      price1: parseInt(value, 10) || 0,
    });
  };
  const handlePrice2Change = (event) => {
    const { value } = event.target;
    setProdusData({
      ...produsData,
      price2: parseInt(value, 10) || 0,
    });
  };
  const handlePrice3Change = (event) => {
    const { value } = event.target;
    setProdusData({
      ...produsData,
      price3: parseInt(value, 10) || 0,
    });
  };
  const handlePrice4Change = (event) => {
    const { value } = event.target;
    setProdusData({
      ...produsData,
      price4: parseInt(value, 10) || 0,
    });
  };
  const handlePrice5Change = (event) => {
    const { value } = event.target;
    setProdusData({
      ...produsData,
      price5: parseInt(value, 10) || 0,
    });
  };
  const handleGajChange = (event) => {
    const { value } = event.target;
    setProdusData({
      ...produsData,
      gaj: parseInt(value, 10) || 0,
    });
  };

  const CAPACITATE_CHOICES = [];
  for (let i = 8; i <= 40; i++) {
    const value = i / 10;
    CAPACITATE_CHOICES.push([value, value.toString()]);
  }
  const currentYear = new Date().getFullYear();
  const startYear = 2000;
  const AN_CHOICES = Array.from({ length: currentYear - startYear + 1 }, (_, index) => {
    const year = startYear + index;
    return [year, year.toString()];
  });
  const handleAddCarClick = () => {
    setShowAddCarModal(true); // Step 2
  };

  const handleModalClose = () => {
    setShowAddCarModal(false);
  };

  const AddCar = async (event) => {
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
      formData.append('gaj', produsData.gaj);
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
    }
    setShowAddCarModal(false);
      setProdusData({
        name: '',
        producator: '',
        uploaded_images: [],
        cutia: 2,
        motor: 6,
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
        gaj: 50,
        an: new Date().getFullYear(),
        capacitate_cilindrica: 0.8,
      });
   fetchCar();
  }
  catch (error) {
    console.error('Eroare la crearea produsului:', error);
  }
};
  const handleDeleteProduct = async (productId, event) => {
    event.stopPropagation();
  try {
    const storedAccessToken = sessionStorage.getItem('accessToken');
    const response = await axios.delete(`http://localhost:8000/api/produs/d_car/${productId}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${storedAccessToken}`,
      },
    });
    // Verifică răspunsul și gestionează-l în consecință
    if (response.status === 200) {
      // Produsul a fost șters cu succes, actualizează lista de produse
    } else {
      // În caz contrar, gestionează eroarea sau afișează un mesaj corespunzător
      console.error('Failed to delete product');

    }
    fetchCar();
  } catch (error) {
    console.error('Error deleting product:', error);
  }
};

  const handleUpdateProduct = async (event) => {
      event.preventDefault(); // Prevent the default form submission behavior
  try {
    const storedAccessToken = sessionStorage.getItem('accessToken');
    if (userIsSuperUser && storedAccessToken && selectedProduct) {
      const formData = new FormData();
      formData.append('name', selectedProduct.name);
      formData.append('producator', selectedProduct.producator);
      formData.append('cutia', selectedProduct.cutia);
      formData.append('motor', selectedProduct.motor);
      formData.append('numar_usi', selectedProduct.numar_usi);
      formData.append('numar_pasageri', selectedProduct.numar_pasageri);
      formData.append('Limita_de_KM', selectedProduct.Limita_de_KM);
      formData.append('caroserie', selectedProduct.caroserie);
      formData.append('descriere', selectedProduct.descriere);
      formData.append('price1', selectedProduct.price1);
      formData.append('price2', selectedProduct.price2);
      formData.append('price3', selectedProduct.price3);
      formData.append('price4', selectedProduct.price4);
      formData.append('price5', selectedProduct.price5);
      formData.append('gaj', selectedProduct.gaj);
      formData.append('an', selectedProduct.an);
      formData.append('capacitate_cilindrica', selectedProduct.capacitate_cilindrica);
      // if (selectedProduct && selectedProduct.uploaded_images) {
      //   selectedProduct.uploaded_images.forEach((image, index) => {
      //     formData.append(`uploaded_images[${index}]`, image);
      //     });
      //   }
      if (selectedProduct.uploaded_images && selectedProduct.uploaded_images.length > 0) {
        selectedProduct.uploaded_images.forEach((image, index) => {
          formData.append(`uploaded_images[${index}]`, image);
        });
      }

      if (selectedProduct.images_to_delete && selectedProduct.images_to_delete.length > 0) {
        selectedProduct.images_to_delete.forEach((imageId, index) => {
          formData.append(`images_to_delete[${index}]`, imageId);
        });
      }

      await axios.put(`http://localhost:8000/api/produs/car-update/${selectedProduct.id}`, formData, {
        headers: {
          Authorization: `Bearer ${storedAccessToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      fetchCar();
      setShowEditCarModal(false);
    }
  } catch (error) {
    console.error('Error updating product:', error);
  }
};



  const handleProductClick = (selectedProduct) => {
  setSelectedProduct(selectedProduct);
  setShowEditCarModal(true);
};
  const handleInputUpdate = (event) => {
  const { name, value } = event.target;
  setSelectedProduct({
    ...selectedProduct,
    [name]: value,
  });
};
  const handleCutieUpdate = (event) => {
    const { value } = event.target;
    setSelectedProduct({
      ...selectedProduct,
      cutia: parseInt(value, 10),
    });
  };
  const handleNumar_pasageriUpdate = (event) => {
    const { value } = event.target;
    setSelectedProduct({
      ...selectedProduct,
      numar_pasageri: parseInt(value, 10),
    });
  };
  const handleNumar_usiUpdate = (event) => {
    const { value } = event.target;
    setSelectedProduct({
      ...selectedProduct,
      numar_usi: parseInt(value, 10),
    });
  };
  const handleCaroserieUpdate = (event) => {
    const { value } = event.target;
    setSelectedProduct({
      ...selectedProduct,
      caroserie: parseInt(value, 10),
    });
  };
  const handleMotorUpdate = (event) => {
    const { value } = event.target;
    setSelectedProduct({
      ...selectedProduct,
      motor: parseInt(value, 10),
    });
  };
  const handlePrice1Update = (event) => {
    const { value } = event.target;
    setSelectedProduct({
      ...selectedProduct,
      price1: parseInt(value, 10) || 0,
    });
  };
  const handlePrice2Update = (event) => {
    const { value } = event.target;
    setSelectedProduct({
      ...selectedProduct,
      price2: parseInt(value, 10) || 0,
    });
  };
  const handlePrice3Update = (event) => {
    const { value } = event.target;
    setSelectedProduct({
      ...selectedProduct,
      price3: parseInt(value, 10) || 0,
    });
  };
  const handlePrice4Update = (event) => {
    const { value } = event.target;
    setSelectedProduct({
      ...selectedProduct,
      price4: parseInt(value, 10) || 0,
    });
  };
  const handlePrice5Update = (event) => {
    const { value } = event.target;
    setSelectedProduct({
      ...selectedProduct,
      price5: parseInt(value, 10) || 0,
    });
  };
  const handleGajUpdate = (event) => {
    const { value } = event.target;
    setSelectedProduct({
      ...selectedProduct,
      gaj: parseInt(value, 10) || 0,
    });
  };
  const onDropForUpdate = (acceptedFiles) => {
  setSelectedProduct({
    ...selectedProduct,
    uploaded_images: acceptedFiles,
  });
};
  const handleImageDelete = (event,imageIndex) => {
      event.preventDefault(); // Împiedică acțiunea implicită a butonului
  const updatedImages = selectedProduct.images.filter((_, index) => index !== imageIndex);
  const imagesToDelete = selectedProduct.images[imageIndex].id; // presupunând că ID-ul imaginii este în câmpul 'id'

  setSelectedProduct((prevProduct) => ({
    ...prevProduct,
    images: updatedImages,
    images_to_delete: [...(prevProduct.images_to_delete || []), imagesToDelete], // adaugă ID-ul imaginii de șters
  }));
  setDropzoneActive(false);
};




const { getRootProps: getRootPropsForUpdate, getInputProps: getInputPropsForUpdate } = useDropzone({
  onDrop: onDropForUpdate,
  accept: 'image/*',
  multiple: true,
});

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <div className="product-list-add">
         {products.slice().reverse().map((product, index) => (
          <div
            style={{ cursor: "pointer" }}
            onClick={() => handleProductClick(product)}
            className="product-card-add"
            key={product.id}
          >
            <div className={'product-card-image--add'}>
              {product.images.length > 0 && (
                <Image src={product.images[0].image} fluid />
              )}
              <div className={'product-name--add'}>
                {product.producator} {product.name}
              </div>
               {userIsSuperUser && (
              <div
                className="delete-icon-car--add"
                  onClick={(event) => handleDeleteProduct(product.id, event)}
                    >
                    <FontAwesomeIcon icon={faTimes} />
                    </div>

                  )}
            </div>
          </div>
        ))}

        <div className="banner-conta--add"  onClick={handleAddCarClick}>
          <div className="banner-imagee--add">
            <FontAwesomeIcon icon={faPlus} size="4x" />
          </div>
          <div className="banner-inf--add">
            <p>Adăugați mașină</p>
          </div>
        </div>


      </div>

        <Modal show={showAddCarModal} onHide={setShowAddCarModal} centered>
        <div className="custom-modal">
          <Modal.Header closeButton>
            <Modal.Title>Adăugați mașină</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={AddCar}>
      <input
        type="text"
        name="name"
        placeholder="Numele produs"
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
      <label>
        Cutie:
        <select value={produsData.cutia} onChange={handleCutieChange}>
          <option value={0}>Manual</option>
          <option value={1}>Automat</option>
          <option value={2}>Nu este specificat</option>
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
          <option value={6}>Nu este specificat</option>
        </select>
      </label>
      <br />
      <label>
        Număr uși:
        <select name="numar_usi" value={produsData.numar_usi} onChange={handleNumar_usiChange}>
          <option value={0}>3</option>
          <option value={1}>5</option>
          <option value={2}>Nu este specificat</option>
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
          <option value={4}>Nu este specificat</option>
        </select>
      </label>
      <br />
      <label>
        Limita de KM:
        <textarea
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
          <option value={13}>Nu este specificat</option>
        </select>
      </label>
      <br />
      <label>
      1-2 Zile :
      <input
        type="number"
        value={produsData.price1}
        onChange={handlePrice1Change}
      />
    </label>
      <br />
      <label>
      3-7 Zile :
      <input
        type="number"
        value={produsData.price2}
        onChange={handlePrice2Change}
      />
    </label>
      <br />
      <label>
      8-20 Zile :
      <input
        type="number"
        value={produsData.price3}
        onChange={handlePrice3Change}
      />
    </label>
      <br />
      <label>
      21-45 Zile :
      <input
        type="number"
        value={produsData.price4}
        onChange={handlePrice4Change}
      />
    </label>
      <br />
      <label>
      46+ Zile :
      <input
        type="number"
        value={produsData.price5}
        onChange={handlePrice5Change}
      />
    </label>
      <br />
       <label>
      Gaj :
      <input
        type="number"
        value={produsData.gaj}
        onChange={handleGajChange}
      />
    </label>
      <br />


      <div {...getRootPropsForCreate()} style={dropzoneStyles}>
  <input {...getInputPropsForCreate()} />
  <p>Trageți și plasați fișiere aici sau faceți clic pentru a încărca</p>
  <ul>
    {produsData.uploaded_images.map((file, index) => (
      <li key={index}>{file.name}</li>
    ))}
  </ul>
</div>



      <button type="submit1" onClick={handleModalClose} >Crează Produsul</button>
       <button type="button" onClick={handleModalClose}>Închide</button>
    </form>
          </Modal.Body>
          <Modal.Footer>

          </Modal.Footer>
        </div>
      </Modal>

      <Modal show={showEditCarModal} onHide={() => setShowEditCarModal(false)} centered>
  <div className="custom-modal">
    <Modal.Header closeButton>
      <Modal.Title>Editați mașina</Modal.Title>
    </Modal.Header>
    <Modal.Body>
  <form onSubmit={handleUpdateProduct}>
    <input
      type="text"
      name="name"
      placeholder="Nume produs"
      value={selectedProduct ? selectedProduct.name : ''}
      onChange={handleInputUpdate}
    />
      <input
        type="text"
        name="producator"
        placeholder="Producător"
        value={selectedProduct ? selectedProduct.producator : ''}
        onChange={handleInputUpdate}
      />
      <br />
      <label>
        Cutie:
        <select value={selectedProduct ? selectedProduct.cutia : ''} onChange={handleCutieUpdate}>
          <option value={0}>Manual</option>
          <option value={1}>Automat</option>
          <option value={2}>Nu este specificat</option>
        </select>
      </label>
      <br />
      <label>
        Motor:
        <select value={selectedProduct ? selectedProduct.motor : ''} onChange={handleMotorUpdate}>
          <option value={0}>Diesel</option>
          <option value={1}>Hybrid</option>
          <option value={2}>Petrol</option>
          <option value={3}>Electric</option>
          <option value={4}>Petrol-Hybrid</option>
          <option value={5}>Petrol-Gaz</option>
          <option value={6}>Nu este specificat</option>
        </select>
      </label>
      <br />
      <label>
        Număr uși:
        <select name="numar_usi" value={selectedProduct ? selectedProduct.numar_usi : ''} onChange={handleNumar_usiUpdate}>
          <option value={0}>3</option>
          <option value={1}>5</option>
          <option value={2}>Nu este specificat</option>
        </select>
      </label>
      <br />
      <label>
        Număr pasageri:
        <select name="numar_pasageri" value={selectedProduct ? selectedProduct.numar_pasageri : ''} onChange={handleNumar_pasageriUpdate}>
          <option value={0}>2</option>
          <option value={1}>4</option>
          <option value={2}>5</option>
          <option value={3}>7</option>
          <option value={4}>Nu este specificat</option>
        </select>
      </label>
      <br />
      <label>
        Limita de KM:
        <textarea
          // type="text"
          name="Limita_de_KM"
          value={selectedProduct ? selectedProduct.Limita_de_KM : ''}
          onChange={handleInputUpdate}
        />
      </label>
      <br />
       <label>
        An:
        <select name="an"  value={selectedProduct ? selectedProduct.an : ''} onChange={handleInputUpdate}>
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
        <select name="capacitate_cilindrica" value={selectedProduct ? selectedProduct.capacitate_cilindrica : ''} onChange={handleInputUpdate}>
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
          value={selectedProduct ? selectedProduct.descriere : ''}
          onChange={handleInputUpdate}
        />
      </label>
      <br />
      <label>
        Caroserie:
        <select name="caroserie" value={selectedProduct ? selectedProduct.caroserie : ''} onChange={handleCaroserieUpdate}>
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
          <option value={13}>Nu este specificat</option>
        </select>
      </label>
      <br />
      <label>
      1-2 Zile :
      <input
        type="number"
        value={selectedProduct ? selectedProduct.price1 : ''}
        onChange={handlePrice1Update}
      />
    </label>
      <br />
      <label>
      3-7 Zile :
      <input
        type="number"
        value={selectedProduct ? selectedProduct.price2 : ''}
        onChange={handlePrice2Update}
      />
    </label>
      <br />
      <label>
      8-20 Zile :
      <input
        type="number"
        value={selectedProduct ? selectedProduct.price3 : ''}
        onChange={handlePrice3Update}
      />
    </label>
      <br />
      <label>
      21-45 Zile :
      <input
        type="number"
        value={selectedProduct ? selectedProduct.price4 : ''}
        onChange={handlePrice4Update}
      />
    </label>
      <br />
      <label>
      46+ Zile :
      <input
        type="number"
        value={selectedProduct ? selectedProduct.price5 : ''}
        onChange={handlePrice5Update}
      />
    </label>
      <br />
    <label>
      Gaj :
      <input
        type="number"
        value={selectedProduct ? selectedProduct.gaj : ''}
        onChange={handleGajUpdate}
      />
    </label>
      <br />


      <div {...getRootPropsForUpdate()} style={dropzoneStyles}>
          <input {...getInputPropsForUpdate()} />
          <p>Trageți și plasați fișiere aici sau faceți clic pentru a încărca</p>
        <div className="banner-imagee">
            <FontAwesomeIcon icon={faPlus} size="4x" />
          </div>
        <ul>
  {selectedProduct && selectedProduct.uploaded_images && selectedProduct.uploaded_images.length > 0 && (
      selectedProduct.uploaded_images.map((image, index) => (
        <li key={index}>
          <p>{image.name}</p>
        </li>
      ))
    )}

        </ul>
      </div>

        <div className="gallery-update">
  {selectedProduct &&
    selectedProduct.images.map((image, index) => (
      <div className="image-item--update" key={index}>
        <img className="image-update" src={image.image} alt={`Image ${index}`} />
        <button className="delete-button" type="button" onClick={(e) => handleImageDelete(e, index)}>Delete</button>
        <p className="image-description--update">{image.image}</p>
      </div>
    ))}
</div>



    <button  type="submit" >Actualizează Produsul</button>

    <button  type="button" onClick={() => setShowEditCarModal(false)}>Închide</button>
  </form>
</Modal.Body>

    <Modal.Footer>
    </Modal.Footer>
  </div>
</Modal>

    </div>
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


export default CarsManager;
