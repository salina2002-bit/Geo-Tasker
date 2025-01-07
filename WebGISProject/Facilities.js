const apiKey = '73e3226bc2b6346e6a3972a1f402ba63'; // Replace with your PositionStack API key

// Initialize map (outside functions to ensure only one instance)
let map = L.map('map').setView([0, 0], 2); // Default position (0,0) with zoom level 2

// Add OpenStreetMap basemap to the map (this should load initially)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Function for Forward Geocoding (Address to Coordinates)
function getCoordinatesFromAddress() {
    const address = document.getElementById('address').value;

    if (!address) {
        document.getElementById('coordinatesResult').innerText = 'Please enter an address.';
        return;
    }

    const url = `http://api.positionstack.com/v1/forward?access_key=${apiKey}&query=${encodeURIComponent(address)}`;

    $.get(url, function(data) {
        if (data.data && data.data.length > 0) {
            const locationData = data.data[0];
            const latitude = locationData.latitude;
            const longitude = locationData.longitude;
            document.getElementById('coordinatesResult').innerText = `Latitude: ${latitude}\nLongitude: ${longitude}`;

            // Display map with marker
            displayMap(latitude, longitude, 'It is here');
        } else {
            document.getElementById('coordinatesResult').innerText = 'No coordinates found for the given address.';
        }
    }).fail(function() {
        document.getElementById('coordinatesResult').innerText = 'Error: Could not fetch data.';
    });
}

// Function for Reverse Geocoding (Coordinates to Address)
function getLocationFromCoordinates() {
    const latitude = document.getElementById('latitude').value;
    const longitude = document.getElementById('longitude').value;

    if (!latitude || !longitude) {
        document.getElementById('locationResult').innerText = 'Please enter both latitude and longitude.';
        return;
    }

    const url = `http://api.positionstack.com/v1/reverse?access_key=${apiKey}&query=${latitude},${longitude}`;

    $.get(url, function(data) {
        if (data.data && data.data.length > 0) {
            const locationData = data.data[0];
            const address = locationData.label;
            document.getElementById('locationResult').innerText = `Location: ${address}`;

            // Display map with marker
            displayMap(latitude, longitude, 'It is here');
        } else {
            document.getElementById('locationResult').innerText = 'No location found for the given coordinates.';
        }
    }).fail(function() {
        document.getElementById('locationResult').innerText = 'Error: Could not fetch data.';
    });
}

// Function to display map with a marker
function displayMap(lat, lon, message) {
    // Center the map to the new coordinates
    map.setView([lat, lon], 15); // Zoom in to level 15

    // Clear existing markers
    map.eachLayer(function(layer) {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });

    // Add a new marker
    L.marker([lat, lon]).addTo(map)
        .bindPopup(message)
        .openPopup();
}
