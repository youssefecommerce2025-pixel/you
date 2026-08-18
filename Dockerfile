# Image de production pour la plateforme de leads fibre Proximus (marche belge).
# better-sqlite3 est un module natif : on installe les outils de build necessaires,
# puis on garde une image finale legere.

FROM node:22-bookworm-slim

# Outils requis pour compiler better-sqlite3 si aucun binaire prebuild n'est dispo.
RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ ca-certificates \
  && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
WORKDIR /app

# Installation des dependances (couche mise en cache tant que package*.json ne change pas).
COPY package*.json ./
RUN npm ci --omit=dev

# Code applicatif.
COPY src ./src
COPY public ./public
COPY docs ./docs

# Dossier de donnees persistant (monte en volume).
ENV DATA_DIR=/app/data
RUN mkdir -p /app/data && chown -R node:node /app
VOLUME ["/app/data"]

USER node
EXPOSE 3000

# Healthcheck simple sur l'endpoint /health.
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3000)+'/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "src/server.js"]
