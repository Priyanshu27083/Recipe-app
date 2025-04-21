const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all recipes with optional filters (cuisine, maxCookingTime, ingredient)
router.get("/", (req, res) => {
  const { cuisine, maxCookingTime, ingredient } = req.query; // Get filters from query string
  let query = "SELECT * FROM recipes WHERE 1=1"; // Start with a basic query

  // Apply filters based on query params
  const params = [];
  
  if (cuisine) {
    query += " AND cuisine = ?";
    params.push(cuisine);
  }

  if (maxCookingTime) {
    query += " AND cookingTime <= ?";
    params.push(maxCookingTime);
  }

  if (ingredient) {
    query += " AND ingredients LIKE ?";
    params.push(`%${ingredient}%`);
  }

  db.query(query, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// GET all cuisines (no filter)
router.get('/cuisines', (req, res) => {
  db.query('SELECT DISTINCT cuisine FROM recipes', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results.map(row => row.cuisine));
  });
});

// GET all ingredients (no filter)
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

// GET recipes by cuisine (filtered by cuisine)
router.get('/by-cuisine', (req, res) => {
  const { cuisine } = req.query;
  if (!cuisine) {
    return res.status(400).json({ error: "Cuisine query parameter is required" });
  }

  db.query('SELECT * FROM recipes WHERE cuisine = ?', [cuisine], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// GET recipes by ingredient (filtered by ingredient)
router.get('/by-ingredient', (req, res) => {
  const { ingredient } = req.query;
  if (!ingredient) {
    return res.status(400).json({ error: "Ingredient query parameter is required" });
  }

  db.query('SELECT * FROM recipes WHERE ingredients LIKE ?', [`%${ingredient}%`], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// GET recipes by max cooking time (filtered by time)
router.get('/by-time', (req, res) => {
  const { maxCookingTime } = req.query;
  if (!maxCookingTime) {
    return res.status(400).json({ error: "Max cooking time query parameter is required" });
  }

  db.query('SELECT * FROM recipes WHERE cookingTime <= ?', [maxCookingTime], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

module.exports = router;
