const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all recipes
router.get('/', (req, res) => {
  db.query('SELECT * FROM recipes', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    const formatted = results.map(recipe => ({
      ...recipe,
      ingredients: recipe.ingredients.split(','),
      instructions: recipe.instructions.split('|')
    }));

    res.json(formatted);
  });
});

// GET all cuisines
router.get('/cuisines', (req, res) => {
  db.query('SELECT DISTINCT cuisine FROM recipes', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results.map(row => row.cuisine));
  });
});

// GET all ingredients
router.get('/ingredients', (req, res) => {
  db.query('SELECT ingredients FROM recipes', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    const allIngredients = new Set();
    results.forEach(row => {
      row.ingredients.split(',').forEach(ing => allIngredients.add(ing.trim()));
    });

    res.json([...allIngredients]);
  });
});

module.exports = router;
