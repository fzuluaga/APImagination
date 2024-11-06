import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";

function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const sessionId = "uniqueSessionId123";
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/favorites?sessionId=${sessionId}`);
        setFavorites(response.data);
      } catch (error) {
        console.error("Error fetching favorite books", error);
      }
    };

    fetchFavorites();
  }, []);

  const removeFavorite = async (bookId) => {
    try {
      await axios.delete(`http://localhost:5001/api/favorites/${bookId}?sessionId=${sessionId}`);
      setFavorites(favorites.filter((fav) => fav.book_id !== bookId));
      alert("Book removed from favorites!");
    } catch (error) {
      console.error("Error removing favorite book", error);
      alert(`Error removing book: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div>
      <h1>My Favorite Books</h1>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {favorites.map((fav) => (
          <div key={fav.book_id} style={{ width: "30%", margin: "10px", textAlign: "center" }}>
            <img 
              src={fav.thumbnail} 
              alt={fav.title} 
              onClick={() => navigate(`/book/${fav.book_id}`)}
              style={{ cursor: 'pointer' }}
            />
            <h3>{fav.title}</h3>
            <p>{fav.author}</p>
            <button onClick={() => removeFavorite(fav.book_id)}>Remove from Favorites</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FavoritesPage;