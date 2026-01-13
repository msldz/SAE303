// 1. Initialisation de la carte
// On cible la div avec l'id 'map'
// setView([latitude, longitude], zoom) -> On centre sur Paris (IDF)
const maCarte = L.map('map').setView([48.8566, 2.3522], 11);

// 2. Ajout des "tuiles" (le visuel de la carte)
// On utilise OpenStreetMap qui est gratuit
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(maCarte);


// --- Ton code précédent reste ici ---

async function afficherBoulangeriesIDF() {
     const reponse = await fetch("geo-boulangeries-ble-idf.json");
     const boulangeries = await reponse.json();

     console.log(boulangeries);
     // C'est ici qu'on ajoutera les marqueurs plus tard
}

afficherBoulangeriesIDF();