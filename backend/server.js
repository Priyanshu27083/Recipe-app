const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Routes
const recipeRoutes = require('./routes/recipes');
const authRoutes = require('./routes/auth'); // Add this

app.use('/api/recipes', recipeRoutes);
app.use('/api', authRoutes); // Mount auth routes (e.g., /api/register)

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
