document.addEventListener('DOMContentLoaded', function () {
    // Map Initialization
    var map = L.map('map').setView([51.0447, -114.0719], 10.5); 
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    // Variables 
    let drawnPolyline = null;
    let simplifiedLayer = null;

    // Function for enabling drawing mode
    function startDrawing() {
        drawnPolyline = L.polyline([], { color: 'red' }).addTo(map);
        map.on('click', addLatLngToPolyline);
    }

    // Function for disabling drawing mode
    function stopDrawing() {
        map.off('click', addLatLngToPolyline);
    }

    // Function to add points to the polyline on click
    function addLatLngToPolyline(e) {
        drawnPolyline.addLatLng(e.latlng); 
    }

    // Function to simplify the polyline
    function simplifyPolyline() {
        if (drawnPolyline) {
            const simplified = turf.simplify(drawnPolyline.toGeoJSON(), { tolerance: 0.01 }); // Use a fixed tolerance
   
            if (simplifiedLayer) {
                map.removeLayer(simplifiedLayer);
            }
            simplifiedLayer = L.geoJSON(simplified, { color: 'blue' }).addTo(map); 
        }
    } 

     // Event listener for when a polyline is finished - We'll use a double-click to finish
    map.on('dblclick', function() {
        stopDrawing();
    }) 

    // Add buttons for starting and stopping the drawing (Optional)
    const startDrawingButton = document.createElement('button');
    startDrawingButton.textContent = 'Start Drawing';
    startDrawingButton.onclick = startDrawing;
    document.getElementById('buttons-container').appendChild(startDrawingButton);

    const stopDrawingButton = document.createElement('button');
    stopDrawingButton.textContent = 'Stop Drawing';
    stopDrawingButton.onclick = stopDrawing;
    document.getElementById('buttons-container').appendChild(stopDrawingButton);

    // Simplify Button
    document.getElementById('simplify').addEventListener('click', simplifyPolyline); 

    // Reset Button
    document.getElementById('reset').addEventListener('click', function() {
            map.removeLayer(drawnPolyline); 
            drawnPolyline = null;
            map.removeLayer(simplifiedLayer); 
            simplifiedLayer = null; 

    });
});