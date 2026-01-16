// 1. Mise en place de la carte
const maCarte = L.map('map').setView([48.8566, 2.3522], 11);

// 2. Ajout du visuel de la carte (OpenStreetMap)
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(maCarte);

// --- GROUPE DE MARQUEURS (La "gomme" pour nettoyer la carte) ---
const groupeMarkers = L.layerGroup().addTo(maCarte);

// --- VARIABLE GLOBALE (Stockage des données) ---
let toutesLesBoulangeries = [];

async function init() {
     // Récupération des données
     const reponse = await fetch("geo-boulangeries-ble-idf.json");
     toutesLesBoulangeries = await reponse.json();

     // 1. On affiche tout au début
     afficherLesMarkers(toutesLesBoulangeries);
     
     // 2. On active la recherche "intelligente"
     activerRechercheAvancee();
}

// --- FONCTION D'AFFICHAGE SUR LA CARTE ---
function afficherLesMarkers(listeAffiche) {
    // On efface les anciens marqueurs
    groupeMarkers.clearLayers();

    listeAffiche.forEach(boulangerie => {
         let monMarqueur = L.marker([boulangerie.latitude, boulangerie.longitude]);

         monMarqueur.bindPopup(`
             <div class="popup-contenu">
                 <h3 class="popup-titre">${boulangerie.nom}</h3>
                 <p class="popup-adresse">
                    ${boulangerie.adresse}<br>
                    <strong>${boulangerie.cp} ${boulangerie.ville}</strong>
                 </p>
             </div>
         `);

         monMarqueur.addTo(groupeMarkers);
     });
}

// --- FONCTION DE GESTION DE LA RECHERCHE ---
function activerRechercheAvancee() {
    const input = document.getElementById('search-input');
    const suggestionBox = document.getElementById('suggestions-container');

    if (!input || !suggestionBox) return;

    input.addEventListener('input', (e) => {
        const texte = e.target.value.toLowerCase();

        // Si champ vide : on cache la boîte et on remet tout
        if (texte.length === 0) {
            suggestionBox.style.display = 'none';
            afficherLesMarkers(toutesLesBoulangeries);
            return;
        }

        // 1. Filtre
        const resultats = toutesLesBoulangeries.filter(b => 
            b.nom.toLowerCase().includes(texte) || 
            b.ville.toLowerCase().includes(texte)
        );

        // 2. Mise à jour carte
        afficherLesMarkers(resultats);

        // 3. Mise à jour suggestions
        afficherSuggestions(resultats.slice(0, 5));
    });

    // Clic en dehors pour fermer
    document.addEventListener('click', (e) => {
        if (!input.contains(e.target) && !suggestionBox.contains(e.target)) {
            suggestionBox.style.display = 'none';
        }
    });
}

// --- FONCTION POUR DESSINER LA LISTE (MODIFIÉE) ---
function afficherSuggestions(liste) {
    const box = document.getElementById('suggestions-container');
    
    // CAS 1 : 0 Résultat
    if (liste.length === 0) {
        box.innerHTML = '<div class="message-vide">0 résultat trouvé</div>';
        box.style.display = 'block';
        return;
    }

    // CAS 2 : Il y a des résultats
    box.innerHTML = liste.map(b => `
        <div class="suggestion-item" 
             data-lat="${b.latitude}" 
             data-lng="${b.longitude}" 
             data-nom="${b.nom}">
            <span class="suggestion-nom">${b.nom}</span>
            <span class="suggestion-infos">${b.adresse} - ${b.ville}</span>
        </div>
    `).join('');

    box.style.display = 'block';

    // Clic sur une suggestion
    document.querySelectorAll('.suggestion-item').forEach(item => {
        item.addEventListener('click', () => {
            const lat = item.getAttribute('data-lat');
            const lng = item.getAttribute('data-lng');
            const nom = item.getAttribute('data-nom');

            document.getElementById('search-input').value = nom;
            box.style.display = 'none';

            maCarte.setView([lat, lng], 16);

            const boulangerieChoisie = toutesLesBoulangeries.find(b => b.nom === nom);
            if (boulangerieChoisie) {
                afficherLesMarkers([boulangerieChoisie]);
            }
        });
    });
}

// Lancement du script
init();