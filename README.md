Windborne Balloon Tracker 
This project visualizes the last 24 hours of high-altitude balloon data from Windborne’s public API on an interactive world map using Leaflet and OpenStreetMap.

Key Features:
-> Live balloon positions pulled dynamically from Windborne's hourly .json files.

-> Interactive markers for each balloon location, showing:

    -> Latitude & Longitude

    -> Altitude (in kilometers)

    ->Marker colors change based on the balloon's recency.
        -> Green: < 5 km

        -> Orange: 5–15 km

        -> Red: > 15 km

-> Supports live updating by fetching the latest 24 hours of hourly data.

Why I chose OpenStreetMap?
OpenStreetMap was selected as the base map provider due to its open license, global coverage, and lightweight integration with Leaflet. It allows clear and customizable visualization of balloon locations without API restrictions.