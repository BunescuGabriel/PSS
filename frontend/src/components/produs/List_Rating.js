import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../../styles/produs/ListRating.css';

const ListRating = ({ productId, onUpdateTotalVotes }) => {
  const [ratingPercentages, setRatingPercentages] = useState([0, 0, 0, 0, 0]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null); // Referință către interval

  const fetchRatings = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/produs/ratings-list/${productId}`);
      const ratings = response.data;
      const newRatingCounts = [0, 0, 0, 0, 0];
      let total = ratings.length;

      ratings.forEach(rating => {
        newRatingCounts[rating.rating - 1]++;
      });

      const percentageData = newRatingCounts.map(count => {
        if (total === 0) {
          return 0; // Setăm procentajul la 0 dacă totalul voturilor este 0
        } else {
          return (count / total) * 100;
        }
      }).reverse();

      setRatingPercentages(percentageData);
      setTotalVotes(total);
      onUpdateTotalVotes(total);
      setLoading(false);
    } catch (error) {
      setError('Error fetching ratings');
      setLoading(false);
    }
  };

  const startInterval = () => {
    intervalRef.current = setInterval(fetchRatings, 5000);
  };

  const stopInterval = () => {
    clearInterval(intervalRef.current);
  };

  useEffect(() => {
    fetchRatings();
    startInterval(); // Pornim intervalul când componenta este montată

    const onFocus = () => {
      startInterval(); // Repornim intervalul când fereastra devine activă
    };

    const onBlur = () => {
      stopInterval(); // Oprim intervalul când fereastra devine inactivă
    };

    window.addEventListener('focus', onFocus);
    window.addEventListener('blur', onBlur);

    return () => {
      // Curățăm evenimentele la demontare
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('blur', onBlur);
      stopInterval(); // Oprim intervalul când componenta este demontată
    };
  }, [productId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="list-rating-container">
      <h1 className="list-rating-title">Evaluări și comentarii</h1>
      <ul className="list-rating-list">
        {ratingPercentages.map((percentage, index) => (
          <li key={index} className="list-rating-item">
            <span>{5 - index}: </span>
            <div className="list-rating-bar">
              <span className="list-rating-value" style={{ width: `${percentage}% `}}>
                {percentage.toFixed(2)}%
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListRating;
