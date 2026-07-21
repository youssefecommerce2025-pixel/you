// Configuration du frontend.
//
// API_BASE = adresse de l'API backend.
//  - Laisse vide ("") si le frontend et le backend sont servis par le meme domaine.
//  - Sinon, mets l'URL publique de ton backend, par exemple :
//      window.API_BASE = "https://leads-mutuelle-sante.onrender.com";
window.API_BASE = "";

// Helper utilise par les pages pour construire les URLs d'API.
window.apiUrl = function (path) {
  return (window.API_BASE || "") + path;
};
