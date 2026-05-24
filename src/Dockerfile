# ============================================
# STAGE 1: Build Angular aplikacije
# ============================================
FROM node:24.11-alpine AS angular-builder

WORKDIR /angular

# Puppeteer is only needed for tests, not for production Angular build.
# Skip Chromium download to avoid long/stalled docker builds.
ENV PUPPETEER_SKIP_DOWNLOAD=true

# Kopiraj package datoteke za Angular
COPY srecajmo-se/package*.json ./

# Namesti Angular odvisnosti (--legacy-peer-deps zaradi ng2-charts compatibility)
RUN npm install --legacy-peer-deps

# Kopiraj Angular source kodo
COPY srecajmo-se/ ./

# Zgradi Angular aplikacijo (output bo v /angular/dist/srecajmo-se)
RUN npm run build

# ============================================
# STAGE 2: Node.js backend
# ============================================
FROM node:24.11-alpine

# Delovna mapa v kontejnerju
WORKDIR /usr/src/app

# Sistem. orodja za build native modulov (odkomentiraj po potrebi)
# RUN apk add --no-cache python3 make g++

# Kopiraj package datoteke za backend
COPY package*.json ./

# Namesti backend odvisnosti
RUN npm install --legacy-peer-deps

# Kopiraj samo backend datoteke, ki jih runtime potrebuje
COPY app.js ./
COPY server.js ./
COPY api ./api
COPY public ./public
COPY data ./data
COPY uporabniki.txt ./uporabniki.txt

# Kopiraj zgrajeno Angular aplikacijo iz prvega stage-a
COPY --from=angular-builder /angular/dist/srecajmo-se /usr/src/app/srecajmo-se/dist/srecajmo-se

# Nastavi environment spremenljivke
ENV NODE_ENV=docker
ENV PORT=3000
EXPOSE 3000

# Zaženi aplikacijo
CMD ["node", "server.js"]