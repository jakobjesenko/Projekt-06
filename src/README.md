# TPO

**Demo aplikacija Srečajmo se**.

Admin prijava: Email: admin@meetup.net Geslo: password123
Demo uporabnik: Email: ana@mail.com Geslo: password123

### Dostopno na: [srecajmose.live](https://srecajmose.live/) (produkcija). - trenutno le html ker smo testirali postavitev, na koncu četrte iteracije bo stran "LIVE"

### Lokalni pogon in testiranje (angular build ni vključen, ker ga docker pogon sam naredi. Če testiraš lokalno brez dockerja pa sledi navodilom "Možnost 2: Lokalno prek terminala")

#### Možnost edina: Ng serve v terminalu

```bash
git clone https://github.com/TPO-2025-2026/Projekt-06
cd Projekt-06
git checkout main
cd src
npm install
cd srecajmo-se
npm install
ng serve
```

#### Možnost 1: Docker-ni še pripravljeno v celoti

Docker build avtomatsko zgradi Angular aplikacijo in zažene Node.js backend.
Dostop na **http://localhost:3000**

```bash
git clone https://github.com/TPO-2025-2026/Projekt-06
cd Projekt-06
git checkout main
cd src
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

#### Možnost 2: Lokalno prek terminala-ni še pripravljeno v celoti

```bash
git clone https://github.com/TPO-2025-2026/Projekt-06
cd Projekt-06
git checkout main
cd src
npm install
cd srecajmo-se
npm install
ng build --output-path=build
cd ..
nodemon ./server.js
```

_Opomba: Za lokalni zagon potrebuješ MongoDB, ki teče na `127.0.0.1:27017`_

### Dostop do dokumentacije je na **/api/docs/** in **/api/swagger.json/**
