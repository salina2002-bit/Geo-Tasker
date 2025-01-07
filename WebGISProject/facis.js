document.addEventListener("DOMContentLoaded", () => {
    const apiUrl = "http://overpass-api.de/api/interpreter";

    // Function to fetch places from Overpass API
    const getPlaces = async (lat, lon, radius) => {
        const overpassQuery = `
        [out:json];
        (
          node["highway"="bus_stop"](around:${radius},${lat},${lon});
          node["amenity"="hospital"](around:${radius},${lat},${lon});
          node["amenity"="school"](around:${radius},${lat},${lon});
          node["amenity"="restaurant"](around:${radius},${lat},${lon});
        );
        out body;
        `;
        const response = await fetch(apiUrl, {
            method: "POST",
            body: overpassQuery,
        });
        return await response.json();
    };

    // Function to generate the map
    const generateMap = async () => {
        const latitude = parseFloat(document.getElementById("latitude").value);
        const longitude = parseFloat(document.getElementById("longitude").value);
        const radius = parseInt(document.getElementById("radius").value);
        const errorElement = document.getElementById("error");

        // Validate inputs
        if (isNaN(latitude) || isNaN(longitude) || isNaN(radius)) {
            errorElement.textContent = "Please enter valid numbers.";
            return;
        }
        errorElement.textContent = "";

        // Fetch places data
        const data = await getPlaces(latitude, longitude, radius);

        // Initialize map
        const map = L.map("map").setView([latitude, longitude], 15);

        // Add tile layer
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19,
            attribution: "© OpenStreetMap contributors",
        }).addTo(map);

        // Add a marker for the user's location
        L.marker([latitude, longitude], { title: "You are here" }).addTo(map);

        // Add a green circle for the buffer zone
        L.circle([latitude, longitude], {
            radius: radius,
            color: "green",
            fillColor: "green",
            fillOpacity: 0.4,
        }).addTo(map);

        // Add marker clusters
        const busStopCluster = L.markerClusterGroup();
        const hospitalCluster = L.markerClusterGroup();
        const schoolCluster = L.markerClusterGroup();
        const restaurantCluster = L.markerClusterGroup();

        // Add markers for bus stops, hospitals, schools, and restaurants
        data.elements.forEach((element) => {
            const { lat, lon, tags } = element;
            if (tags.highway === "bus_stop") {
                const name = tags.name || "Unnamed Bus Stop";
                const marker = L.marker([lat, lon], {
                    title: `Bus Stop: ${name}`,
                    icon: L.icon({
                        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/svgs/solid/bus.svg",
                        iconSize: [25, 25],
                        iconAnchor: [12, 25],
                    }),
                }).bindPopup(`Bus Stop: ${name}`);
                busStopCluster.addLayer(marker);
            } else if (tags.amenity === "hospital") {
                const name = tags.name || "Unnamed Hospital";
                const marker = L.marker([lat, lon], {
                    title: `Hospital: ${name}`,
                    icon: L.icon({
                        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/svgs/solid/hospital.svg",
                        iconSize: [25, 25],
                        iconAnchor: [12, 25],
                    }),
                }).bindPopup(`Hospital: ${name}`);
                hospitalCluster.addLayer(marker);
            } else if (tags.amenity === "school") {
                const name = tags.name || "Unnamed School";
                const marker = L.marker([lat, lon], {
                    title: `School: ${name}`,
                    icon: L.icon({
                        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/svgs/solid/school.svg",
                        iconSize: [25, 25],
                        iconAnchor: [12, 25],
                    }),
                }).bindPopup(`School: ${name}`);
                schoolCluster.addLayer(marker);
            } else if (tags.amenity === "restaurant") {
                const name = tags.name || "Unnamed Restaurant";
                const marker = L.marker([lat, lon], {
                    title: `Restaurant: ${name}`,
                    icon: L.icon({
                        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/svgs/solid/hamburger.svg",
                        iconSize: [25, 25],
                        iconAnchor: [12, 25],
                    }),
                }).bindPopup(`Restaurant: ${name}`);
                restaurantCluster.addLayer(marker);
            }
        });

        // Add clusters to map
        map.addLayer(busStopCluster);
        map.addLayer(hospitalCluster);
        map.addLayer(schoolCluster);
        map.addLayer(restaurantCluster);

        // Add layer control
        L.control.layers(null, {
            "Bus Stops": busStopCluster,
            Hospitals: hospitalCluster,
            Schools: schoolCluster,
            Restaurants: restaurantCluster,
        }).addTo(map);
    };

    // Attach click event to the button
    document.getElementById("generateMap").addEventListener("click", generateMap);
});
