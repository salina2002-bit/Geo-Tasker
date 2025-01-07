const apiKey = '5b3ce3597851110001cf6248232e37be3a0f48ebac24a782f078a350';
const apiUrl = 'https://api.openrouteservice.org/v2/directions/driving-car';

// Function to fetch route data
async function getRouteExport(startCoords, endCoords) {
  const body = {
    coordinates: [startCoords, endCoords]
  };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Error fetching route: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    alert('Error fetching the route: ' + error.message);
    return null;
  }
}

// Handle form submission
document.getElementById('routeForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const startLat = parseFloat(document.getElementById('startLat').value);
  const startLon = parseFloat(document.getElementById('startLon').value);
  const endLat = parseFloat(document.getElementById('endLat').value);
  const endLon = parseFloat(document.getElementById('endLon').value);

  const startCoords = [startLon, startLat];
  const endCoords = [endLon, endLat];

  const routeData = await getRouteExport(startCoords, endCoords);

  if (routeData) {
    // Display the output
    document.getElementById('output').innerText = 'Route fetched successfully!';

    // Provide a download link for the route data
    const blob = new Blob([JSON.stringify(routeData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = 'route.json';
    downloadLink.innerText = 'Download Route Data';

    const linkContainer = document.getElementById('downloadLink');
    linkContainer.innerHTML = ''; // Clear existing content
    linkContainer.appendChild(downloadLink);
  } else {
    document.getElementById('output').innerText = 'Failed to fetch the route.';
  }
});
