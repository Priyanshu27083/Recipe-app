import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [cuisines, setCuisines] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    searchTerm: '',
    cuisine: '',
    maxCookingTime: '',
    ingredient: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recipesRes, cuisinesRes, ingredientsRes] = await Promise.all([
          axios.get('/api/recipes'),
          axios.get('/api/recipes/cuisines'),
          axios.get('/api/recipes/ingredients')
        ]);
        
        setRecipes(recipesRes.data);
        setFilteredRecipes(recipesRes.data);
        setCuisines(cuisinesRes.data);
        setIngredients(ingredientsRes.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let results = [...recipes];
    
    if (filters.searchTerm) {
      results = results.filter(recipe => 
        recipe.name.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }
    
    if (filters.cuisine) {
      results = results.filter(recipe => 
        recipe.cuisine === filters.cuisine
      );
    }
    
    if (filters.maxCookingTime) {
      results = results.filter(recipe => 
        recipe.cookingTime <= parseInt(filters.maxCookingTime)
      );
    }
    
    if (filters.ingredient) {
      results = results.filter(recipe => 
        recipe.ingredients.includes(filters.ingredient)
      );
    }
    
    setFilteredRecipes(results);
  }, [filters, recipes]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      searchTerm: '',
      cuisine: '',
      maxCookingTime: '',
      ingredient: ''
    });
  };

  if (loading) {
    return <div className="loading">Loading recipes...</div>;
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Recipe Finder</h1>
        <p>Discover delicious meals based on your preferences</p>
      </header>

      <div className="filters">
        <div className="filter-group">
          <label>Search by name:</label>
          <input
            type="text"
            name="searchTerm"
            value={filters.searchTerm}
            onChange={handleFilterChange}
            placeholder="Enter recipe name"
          />
        </div>

        <div className="filter-group">
          <label>Filter by cuisine:</label>
          <select
            name="cuisine"
            value={filters.cuisine}
            onChange={handleFilterChange}
          >
            <option value="">All Cuisines</option>
            {cuisines.map(cuisine => (
              <option key={cuisine} value={cuisine}>{cuisine}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Maximum cooking time (minutes):</label>
          <input
            type="number"
            name="maxCookingTime"
            value={filters.maxCookingTime}
            onChange={handleFilterChange}
            placeholder="e.g. 30"
            min="1"
          />
        </div>

        <div className="filter-group">
          <label>Filter by ingredient:</label>
          <select
            name="ingredient"
            value={filters.ingredient}
            onChange={handleFilterChange}
          >
            <option value="">All Ingredients</option>
            {ingredients.map(ingredient => (
              <option key={ingredient} value={ingredient}>{ingredient}</option>
            ))}
          </select>
        </div>

        <button onClick={resetFilters} className="reset-btn">
          Reset Filters
        </button>
      </div>

      <div className="results-count">
        Found {filteredRecipes.length} recipes
      </div>

      <div className="recipes-container">
        {filteredRecipes.length === 0 ? (
          <div className="no-results">
            No recipes match your filters. Try adjusting your search criteria.
          </div>
        ) : (
          filteredRecipes.map(recipe => (
            <div key={recipe._id} className="recipe-card">
              <h2>{recipe.name}</h2>
              <div className="recipe-meta">
                <span className="cuisine">{recipe.cuisine}</span>
                <span className="time">⏱️ {recipe.cookingTime} mins</span>
                {recipe.difficulty && (
                  <span className={`difficulty ${recipe.difficulty.toLowerCase()}`}>
                    {recipe.difficulty}
                  </span>
                )}
              </div>
              
              <div className="ingredients">
                <h3>Ingredients:</h3>
                <ul>
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </div>
              
              <div className="instructions">
                <h3>Instructions:</h3>
                <ol>
                  {recipe.instructions.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;