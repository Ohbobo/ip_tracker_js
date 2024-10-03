import { displayMap } from "./src/map/map.js";

const personnalIpUrl = "https://api.ipify.org?format=json";
const informationsIpUrl = "https://geo.ipify.org/api/v2/country,city?apiKey=at_5A0pRBUlUmosIepiJnE7x6ggIRyUY&ipAddress="

const ipInformations = document.querySelector('.ip-informations');
const form = document.querySelector('.ip-form');
const searchInput = document.querySelector('.search-input');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (searchInput.value === '') {
        alert('Veuillez remplir le champ');
    } else {
        displayCurrentIpInformations(true);

        try {
            const data = await getIpAddressInformations(searchInput.value);
            console.log(data);

            // Vérifie si la structure de données est correcte
            if (!data || !data.location) {
                throw new Error("Impossible de récupérer les informations pour cette IP.");
            }

            // Affiche les informations et la carte
            displayCurrentIpInformations(false, data);
            displayMap(data);
        } catch (error) {
            console.error('Erreur lors de la récupération des informations :', error);
            displayCurrentIpInformations(false, null, error.message);
        }
    }
});

async function getPersonalIpAddress() {
    try {
        const response = await fetch(personnalIpUrl);
        if (response.ok) {
            const data = await response.json();
            return data.ip;
        } else {
            throw new Error('Erreur lors de la récupération de l’adresse IP personnelle');
        }
    } catch (error) {
        console.error('Erreur:', error);
        throw error;
    }
}

async function getIpAddressInformations(ip) {
    try {
        const res = await fetch(`${informationsIpUrl}${ip}`);
        
        // Vérifie si la requête a réussi
        if (!res.ok) {
            throw new Error('Erreur lors de la récupération des informations de cette adresse IP');
        }

        const data = await res.json();
        return data;
    } catch (error) {
        console.error('Erreur:', error);
        throw error;
    }
}

function displayCurrentIpInformations(loading, data = null, errorMessage = null) {
    ipInformations.innerText = "";

    if (loading) {
        ipInformations.innerHTML = `
            <div class="loader-container">
                <svg class="loader" version="1.1" id="L9" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                viewBox="0 0 100 100" enable-background="new 0 0 0 0" xml:space="preserve">
                    <path fill="#00000" d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50">
                    <animateTransform 
                        attributeName="transform" 
                        attributeType="XML" 
                        type="rotate"
                        dur="1s" 
                        from="0 50 50"
                        to="360 50 50" 
                        repeatCount="indefinite" />
                    </path>
                </svg>
            </div>`;
    } else if (errorMessage) {
        // Afficher le message d'erreur
        ipInformations.innerHTML = `<span class="error-message">Erreur : ${errorMessage}</span>`;
    } else if (data) {
        // Afficher les informations
        ipInformations.innerHTML = `
            <div class="ip-informations_div">
                <div>
                    <h2 class="ip-informations_title">IP ADDRESS</h2>
                </div>
                <p class="ip-informations_text">${data.ip}</p>
            </div>
            <div class="ip-informations_div">
                <div>
                    <h2 class="ip-informations_title">LOCATION</h2>
                </div>
                <p class="ip-informations_text">${data.location.city}, ${data.location.country}</p>
                <p class="ip-informations_text">${data.location.postalCode}</p>
            </div>
            <div class="ip-informations_div">
                <div>
                    <h2 class="ip-informations_title">TIMEZONE</h2>
                </div>
                <p class="ip-informations_text">${data.location.timezone}</p>
            </div>
            <div class="ip-informations_div">
                <div>
                    <h2 class="ip-informations_title">ISP</h2>
                </div>
                <p class="ip-informations_text">${data.isp}</p>
            </div>
        `;
    } else {
        ipInformations.innerHTML = `<span>Impossible de charger les données</span>`;
    }
}

async function app() {
    let loading = true;

    displayCurrentIpInformations(loading);

    try {
        const ip = await getPersonalIpAddress();
        const informations = await getIpAddressInformations(ip);

        loading = false;
        displayCurrentIpInformations(loading, informations);
        displayMap(informations);
    } catch (error) {
        console.error('Erreur lors de l\'exécution de l\'application :', error);
        displayCurrentIpInformations(false, null, error.message);
    }
}

app();
