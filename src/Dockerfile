# ============================================
# STAGE 1: Build Angular aplikacije
# ============================================
FROM node:24.11-alpine AS angular-builder

WORKDIR /angular

# Kopiraj package datoteke za Angular
COPY angular/package*.json ./

# Namesti Angular odvisnosti (--legacy-peer-deps zaradi ng2-charts compatibility)
RUN npm install --legacy-peer-deps

# Kopiraj Angular source kodo
COPY angular/ ./

# Zgradi Angular aplikacijo (output bo v /angular/build)
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

# Kopiraj backend kodo
COPY . .

# Kopiraj zgrajeno Angular aplikacijo iz prvega stage-a
COPY --from=angular-builder /angular/build /usr/src/app/angular/build

# Nastavi environment spremenljivke
ENV NODE_ENV=docker
ENV PORT=3000
EXPOSE 3000

# Zaženi aplikacijo
CMD ["node", "./server"]