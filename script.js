const CORS_PROXY = "https://api.allorigins.win/raw?url=";
const BASE_URL = "https://a.windbornesystems.com/treasure/";

// Initialize the map
const map = L.map('map').setView([0, 0], 2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Get relative time from now
const getRelativeTime = (timestamp) => {
    const now = Date.now();
    const diffMs = now - new Date(timestamp).getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    return `${diffHrs} hour${diffHrs !== 1 ? 's' : ''} ago`;
};

// Determine marker color based on altitude
const getMarkerColor = (alt) => {
    if (alt < 5) return 'green';
    if (alt < 15) return 'orange';
    return 'red';
};

// Create a custom colored marker
const createColoredMarker = (lat, lon, color) => {
    const icon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color:${color}; width:16px; height:16px; border-radius:50%; border: 2px solid white;"></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8]
    });

    return L.marker([lat, lon], { icon });
};

const fetchData = (hourStr) => {
    const url = `${CORS_PROXY}${BASE_URL}${hourStr}.json`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (Array.isArray(data)) {
                const positions = data.map(entry => ({
                    lon: entry[0],
                    lat: entry[1],
                    alt: entry[2],
                    timestamp: getTimestampForHour(hourStr)
                }));
                updateMap(positions);
            } else {
                console.warn("Unexpected data format:", data);
            }
        })
        .catch(error => console.error("Error fetching balloon data:", error));
};

const getTimestampForHour = (hourStr) => {
    const now = new Date();
    now.setUTCHours(parseInt(hourStr), 0, 0, 0);
    return now.toISOString();
};

const updateMap = (positions) => {
    positions.forEach(({ lat, lon, alt, timestamp }) => {
        const color = getMarkerColor(alt);
        const marker = createColoredMarker(lat, lon, color);

        marker.addTo(map).bindPopup(`
            <b>Balloon Detected</b><br>
            Latitude: ${lat.toFixed(5)}<br>
            Longitude: ${lon.toFixed(5)}<br>
            Altitude: ${alt.toFixed(2)} km<br>
            Seen: ${getRelativeTime(timestamp)}
        `);
    });
};

const getLast24Hours = () => {
    const now = new Date();
    const currentHourUTC = now.getUTCHours();
    const hours = [];

    for (let i = 0; i < 24; i++) {
        const hour = (currentHourUTC - i + 24) % 24;
        const hourStr = hour < 10 ? `0${hour}` : `${hour}`;
        hours.push(hourStr);
    }

    return hours;
};

// Fetch and display data for the last 24 hours
const last24Hours = getLast24Hours();
last24Hours.forEach(hourStr => fetchData(hourStr));
