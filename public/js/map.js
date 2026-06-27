maptilersdk.config.apiKey = mapApiKey;

const style = localStorage.getItem("theme") === "dark"
    ? `https://api.maptiler.com/maps/${maptilersdk.MapStyle.STREETS.DARK.id}/style.json?key=${mapApiKey}`
    : `https://api.maptiler.com/maps/${maptilersdk.MapStyle.STREETS.id}/style.json?key=${mapApiKey}`;

window.map = new maptilersdk.Map({
    container: "map",
    style,
    center: coordinates,
    zoom: 9,
});

const popup = new maptilersdk.Popup({
    offset: 25
}).setHTML(`
    <h6 style="color: red ">${listingTitle}</h6>
`);

const marker = new maptilersdk.Marker({
    color: "#fe424d"
})
    .setLngLat(coordinates)
    .setPopup(popup)
    .addTo(window.map);

window.map.once("load", () => {
    marker.togglePopup();
});