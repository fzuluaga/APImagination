import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function BookDetailsPage() {
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const sessionId = "uniqueSessionId123";

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        // Fetch book details
        const response = await axios.get(`https://www.googleapis.com/books/v1/volumes/${bookId}`);
        setBook(response.data);

        // Check if book is in favorites
        const favoriteResponse = await axios.get(`http://localhost:5001/api/favorites?sessionId=${sessionId}`);
        const isBookFavorited = favoriteResponse.data.some(fav => fav.book_id === bookId);
        setIsFavorite(isBookFavorited);
      } catch (error) {
        console.error("Error fetching book details or checking favorite status", error);
      }
    };

    if (bookId) {
      fetchBookDetails();
    }
  }, [bookId]);

  const toggleFavorite = async () => {
    try {
      if (isFavorite) {
        await axios.delete(`http://localhost:5001/api/favorites/${bookId}?sessionId=${sessionId}`);
        setIsFavorite(false);
        alert("Book removed from favorites!");
      } else {
        await axios.post("http://localhost:5001/api/favorites", {
          bookId: bookId, // Use the bookId from params
          title: book.volumeInfo.title,
          author: book.volumeInfo.authors ? book.volumeInfo.authors[0] : "Unknown",
          thumbnail: book.volumeInfo.imageLinks?.thumbnail || "",
          sessionId: sessionId
        });
        
        setIsFavorite(true);
        alert("Book added to favorites!");
      }
    } catch (error) {
      if (error.response?.status === 409) {
        alert("This book is already in your favorites!");
      } else {
        console.error("Error details:", error);
        alert(`Error updating favorites: ${error.response?.data?.message || error.message}`);
      }
    }
  };

  if (!book) return <div>Loading...</div>;

  return (
    <div>
      <h1>{book.volumeInfo.title}</h1>
      <img 
        src={book.volumeInfo.imageLinks?.thumbnail} 
        alt={book.volumeInfo.title} 
      />
      <h2>Author: {book.volumeInfo.authors?.[0] || "Unknown"}</h2>
      <div
        dangerouslySetInnerHTML={{
          __html: book.volumeInfo.description || "No description available"
        }}
      />
      <button onClick={toggleFavorite}>
        {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
      </button>
    </div>
  );
}

export default BookDetailsPage;