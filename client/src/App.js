import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import RecipeFinder from './RecipeFinder';
import FloatingButton from './FloatingButton';
import AddRecipePopup from './AddRecipePopup';
import './App.css';

function App() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [shouldRefreshRecipes, setShouldRefreshRecipes] = useState(false);

  const handleAddRecipe = () => {
    setIsPopupOpen(true);
  };

  const handleRecipeAdded = () => {
    setShouldRefreshRecipes(true);
    setIsPopupOpen(false);
  };

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/recipes" 
            element={
              <RecipeFinder 
                shouldRefresh={shouldRefreshRecipes} 
                onRefreshComplete={() => setShouldRefreshRecipes(false)} 
              />
            } 
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
      <FloatingButton onClick={handleAddRecipe} />
      <AddRecipePopup 
        isOpen={isPopupOpen} 
        onClose={() => setIsPopupOpen(false)}
        onRecipeAdded={handleRecipeAdded}
      />
    </div>
  );
}

export default App;
