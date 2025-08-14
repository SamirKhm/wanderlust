mapboxgl.accessToken = window.mapToken;

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: window.coordinates,
    zoom: 9
});

console.log("Token:", window.mapToken);
console.log("Coordinates:", window.coordinates);

new mapboxgl.Marker()
    .setLngLat(window.coordinates)
    .addTo(map);
