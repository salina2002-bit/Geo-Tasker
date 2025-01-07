const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public')); // Serve HTML and JS files

const apiKey = '5b3ce3597851110001cf6248232e37be3a0f48ebac24a782f078a350';
const apiUrl = 'https://api.openrouteservice.org/v2/directions/driving-car';

app.post('/getRoute', async (req, res) => {
  const { startCoords, endCoords } = req.body;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ coordinates: [startCoords, endCoords] }),
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch route' });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
