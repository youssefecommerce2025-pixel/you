/**
 * Point d'entrée CommonJS pour Hostinger.
 *
 * Hostinger charge le fichier d'entrée via require(). Or notre app est en ESM
 * avec du "top-level await" (base de données) → require() échoue avec
 * ERR_REQUIRE_ASYNC_MODULE. Ce petit fichier contourne le problème en
 * chargeant l'app via import() dynamique.
 */
process.env.START_SERVER = "1";

import("./src/server.js").catch((err) => {
  console.error("Echec demarrage ProxiFibre:", err);
  process.exit(1);
});
