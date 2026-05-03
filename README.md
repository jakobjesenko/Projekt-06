# TPO

**Demo aplikacija Srečajmo se**.

Admin prijava: Email: admin@srecajmose.si Geslo: admin123
Demo uporabnik: Email: ana@demo.com Geslo: demo123

### Dostopno na: [srecajmose.live](https://srecajmose.live/) (produkcija).

### Lokalni pogon in testiranje (angular build ni vključen, ker ga docker pogon sam naredi. Če testiraš lokalno brez dockerja pa sledi navodilom "Možnost 2: Lokalno prek terminala")

#### Možnost 1: Docker

Docker build avtomatsko zgradi Angular aplikacijo in zažene Node.js backend.
Dostop na **http://localhost:3000**

```bash
git clone https://github.com/TPO-2025-2026/Projekt-06
cd Projekt-06
git checkout main
```

**Zagon z Docker (build Angular + Node.js + MongoDB):**

**Tek v ozadju:**

```bash
docker compose up -d --build
```

**Tek v ospredju:**

```bash
docker compose up --build
```

**Spremljanje logov:**

```bash
docker compose logs -f app
```

**Ustavitev:**

```bash
docker compose down
```

**Development dostop na http://localhost:3000**

#### Možnost 2: Lokalno prek terminala

```bash
git clone https://github.com/TPO-2025-2026/Projekt-06
cd Projekt-06
git checkout main
npm install
cd angular
npm install
ng build --output-path=build
cd ..
nodemon ./server.js
```

_Opomba: Za lokalni zagon potrebuješ MongoDB, ki teče na `127.0.0.1:27017`_

### Dostop do dokumentacije je na **/api/docs/** in **/api/swagger.json/**
