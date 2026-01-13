// 1. Mise en place de la carte
// On cible la div avec l'id 'map'
// setView([latitude, longitude], zoom) veut dire qu'on se centre sur Paris (IDF)
const maCarte = L.map('map').setView([48.8566, 2.3522], 11);

// 2. Ajout du visuel de la carte
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(maCarte);


async function afficherBoulangeriesIDF() {
     const reponse = await fetch("geo-boulangeries-ble-idf.json");
     const boulangeries = await reponse.json();

     // boucle pour que sur chaque boulangerie on a le marqueur de créer et la pop up avec le nom de la boulangerie, l'adresse, le code postale et la ville
     boulangeries.forEach(boulangerie => {
         
         // marqueur
         let monMarqueur = L.marker([boulangerie.latitude, boulangerie.longitude]);

         //pop up
         monMarqueur.bindPopup(`
             <div class="popup-contenu">
                 <h3 class="popup-titre">${boulangerie.nom}</h3>
                 <p class="popup-adresse">
                    ${boulangerie.adresse}<br>
                    <strong>${boulangerie.cp} ${boulangerie.ville}</strong>
                 </p>
             </div>
         `);

         //  ajout du marqueur à la carte
         monMarqueur.addTo(maCarte);
     });
}

afficherBoulangeriesIDF();