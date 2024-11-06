import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import SearchPage from './components/SearchPage';
import FavoritesPage from './components/FavoritesPage';
import BookDetailsPage from './components/BookDetailsPage';
import ResultsPage from "./components/ResultsPage";
import Navbar from './components/Navbar';
import './App.css';


function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/book/:bookId" element={<BookDetailsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
