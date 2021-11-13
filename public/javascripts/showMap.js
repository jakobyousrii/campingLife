
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL)
    center: mapCenter.geometry.coordinates, // starting position [lng, lat]
    zoom: 13 // starting zoom
});
map.addControl(new mapboxgl.NavigationControl(),"top-right");
new mapboxgl.Marker().setLngLat(mapCenter.geometry.coordinates).setPopup(new mapboxgl.Popup({offset:25}).setHTML(`<strong>${mapCenter.title}</strong> <p>${mapCenter.location}</p>`)).addTo(map);