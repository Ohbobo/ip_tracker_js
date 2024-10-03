let map;

export function displayMap(data) {
    const lat = data.location.lat;
    const lng = data.location.lng;

    if (map) {
        map.remove(); 
    }
    map = L.map('map').setView([lat, lng], 13);

    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    L.marker([lat, lng]).addTo(map)
        .bindPopup(`
            <b>${data.location.city}, ${data.location.country}</b><br>
            Région: ${data.location.region}<br>
            Code Postal: ${data.location.postalCode}<br>
            Fuseau Horaire: ${data.location.timezone}
        `)
        .openPopup();
}
