import React, { useState } from 'react';
import axios from 'axios';
import './AddRecipePopup.css';

function AddRecipePopup({ isOpen, onClose, onRecipeAdded }) {
  const [recipe, setRecipe] = useState({
    name: '',
    cuisine: '',
    cookingTime: '',
    difficulty: 'easy',
    ingredients: '',
    instructions: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipe(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/recipes', {
        ...recipe,
        cookingTime: Number(recipe.cookingTime)
      });
  
      if (response.data.message === 'Recipe added successfully') {
        onRecipeAdded(); // Trigger refresh of recipe list
        setRecipe({
          name: '',
          cuisine: '',
          cookingTime: '',
          difficulty: 'easy',
          ingredients: '',
          instructions: ''
        });
        onClose(); // Optional: close the popup after successful submission
      }
    } catch (error) {
      console.error('Error adding recipe:', error.response?.data || error.message);
      setError('Failed to add recipe. Please try again.');
    }
  };
  
  if (!isOpen) return null;

  return (
    <>
      <div className="popup-overlay" onClick={onClose} />
      <div className="recipe-popup">
        <h2>Add New Recipe</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Recipe Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={recipe.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="cuisine">Cuisine:</label>
            <input
              type="text"
              id="cuisine"
              name="cuisine"
              value={recipe.cuisine}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="cookingTime">Cooking Time (minutes):</label>
            <input
              type="number"
              id="cookingTime"
              name="cookingTime"
              value={recipe.cookingTime}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="difficulty">Difficulty:</label>
            <select
              id="difficulty"
              name="difficulty"
              value={recipe.difficulty}
              onChange={handleChange}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="ingredients">Ingredients (comma-separated):</label>
            <textarea
              id="ingredients"
              name="ingredients"
              value={recipe.ingredients}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="instructions">Instructions:</label>
            <textarea
              id="instructions"
              name="instructions"
              value={recipe.instructions}
              onChange={handleChange}
              required
            />
          </div>

          <div className="button-group">
            <button type="submit">Add Recipe</button>
            <button type="button" onClick={onClose} className="cancel">Cancel</button>
          </div>
        </form>
      </div>
    </>
  );
}

export default AddRecipePopup;