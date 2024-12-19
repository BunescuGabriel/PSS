import React, { useState, useEffect } from "react";
import { Container, Card, Image, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import '../../styles/produs/Car.css';
import '../../styles/admin/CommentsMana.css';
import '../../styles/admin/Commen.css';
import DeleteRating from "./DeleteRating";

const RatingsManager = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
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
  }, []);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Container>
      <div className="product-list-com">
        {products.slice().reverse().map((product) => (
          <Card
            style={{ cursor: "pointer" }}
            onClick={() => handleProductClick(product)}
            className="product-card-com"
            key={product.id}
          >
            <Card.Body>
              {product.images.length > 0 && (
                <Image src={product.images[0].image} fluid />
              )}
              <Card.Title>
                {product.producator} {product.name}
              </Card.Title>
            </Card.Body>
          </Card>
        ))}
      </div>
      {selectedProduct && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>
                Ratings pentru {selectedProduct.producator}{" "}
                {selectedProduct.name}
              </h2>
              <FontAwesomeIcon
                icon={faTimes}
                className="modal-close-icon"
                onClick={handleCloseModal}
              />
            </div>
            <div className="modal-body">
              <DeleteRating productId={selectedProduct.id} />
            </div>
          </div>
        </div>
      )}
    </Container>
  );
};

export default RatingsManager;
