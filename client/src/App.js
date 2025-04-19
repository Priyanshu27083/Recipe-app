import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState('');

  // Fetch recipes from backend
  useEffect(() => {
    axios.get('http://localhost:5000/recipes') // Adjust if your backend runs on a different port
      .then(res => setRecipes(res.data))
      .catch(err => console.error("Error fetching recipes:", err));
  }, []);

  // Filter recipes by search input
  const filteredRecipes = recipes.filter(recipe =>
    recipe.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={styles.container}>
      <h1>🍳 Recipe Finder</h1>

      <input
        type="text"
        placeholder="Search recipes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={styles.input}
      />

      <div style={styles.recipeList}>
        {filteredRecipes.length === 0 ? (
          <p>No recipes found.</p>
        ) : (
          filteredRecipes.map((recipe) => (
            <div key={recipe._id} style={styles.card}>
              <h2>{recipe.name}</h2>
              <p><strong>Cuisine:</strong> {recipe.cuisine}</p>
              <p><strong>Cooking Time:</strong> {recipe.cookingTime} minutes</p>
              <p><strong>Ingredients:</strong> {recipe.ingredients.join(', ')}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: 'Arial',
    padding: '2rem',
    maxWidth: '800px',
    margin: '0 auto',
  },
  input: {
    padding: '0.5rem',
    width: '100%',
    marginBottom: '1rem',
    fontSize: '1rem',
  },
  recipeList: {
    marginTop: '1rem',
  },
  card: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '1rem',
    marginBottom: '1rem',
    backgroundColor: '#f9f9f9',
  }
};

export default App;
