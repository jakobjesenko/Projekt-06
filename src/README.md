<<<<<<< HEAD
# :computer: Izvorna koda projekta

V tej mapi se nahajaja izvorna koda.

# TPO

**Demo aplikacija Srečajmo se**.

Admin prijava: Email: admin@meetup.net Geslo: password123
Demo uporabnik: Email: ana@mail.com Geslo: password123

### Dostopno na: [srecajmose.live](https://srecajmose.live/) (produkcija). - trenutno le html ker smo testirali postavitev, na koncu četrte iteracije bo stran "LIVE"

### Lokalni pogon in testiranje (angular build ni vključen, ker ga docker pogon sam naredi. Če testiraš lokalno brez dockerja pa sledi navodilom "Možnost 2: Lokalno prek terminala")

#### Možnost edina: Ng serve v terminalu

Ne pozabi zagnati MongoDB lokalno
=======
# :bulb: Projekt pri predmetu TPO

|             Dokumentacija              |          Izvorna koda          |           Testni primeri           |
| :------------------------------------: | :----------------------------: | :--------------------------------: |
| [:page_with_curl:<br>**`docs`**](docs) | [:computer:<br>**`src`**](src) | [:microscope:<br>**`test`**](src/test) |

<<<<<<<< HEAD:README.md
## Opis dela
========
Admin prijava: Email: admin@meetup.net Geslo: password123
Demo uporabnik: Email: ana@mail.com Geslo: password123
>>>>>>>> development:src/README.md

Smernice kurikuluma **ACM-IEEE** [1,2] izpostavljajo, da je najboljši način za učenje programskega inženirstva uporaba teorije in znanja v praktičnem okolju projekta.

Vsaka skupina, ki je sestavljena iz 5 članov, mora razviti projekt na izbrani problemski domeni, ki naslavlja inteligentne sisteme, in sicer od **predloga projekta** do **implementacije**.

<<<<<<<< HEAD:README.md
V veliki meri so pridobljene izkušnje, vmesni rezultati in predstavitve pomembnejše od izbrane problemske domene.

## Cilji projekta

Programsko opremo izdelujejo **ekipe**, zato programski inženirji potrebujejo tako tehnično, kadrovsko in vodstveno znanje. Predavanja bodo osredotočena na raven **poznavanja**, medtem ko projekt cilja na raven **usposobljenosti** [1]:
========
#### Možnost: Ng serve v terminalu
>>>>>>> development

```bash
git clone https://github.com/TPO-2025-2026/Projekt-06
cd Projekt-06
git checkout main
cd src
npm install
cd srecajmo-se
npm install
ng serve
<<<<<<< HEAD
"nov terminal"
pot do /Projekt-06/src
node server.js
```

Najprej na **http://localhost:3000/api/docs** pod database sekcijo poženi import-hardcoded->tryout->execute, nato obišči **http://localhost:4200**

#### Možnost 1: Docker-ni še pripravljeno v celoti

Docker build avtomatsko zgradi Angular aplikacijo in zažene Node.js backend.
Dostop na **http://localhost:3000**

=======
drug terminal
cd Projekt-06\src
nodemon ./server.js
```

#### Možnost 1: Docker
>>>>>>>> development:src/README.md

1. **Poznavanja** _(angl. Familiarity)_. Zmožnost pomnjenja in razumevanja.
2. **Vodena uporaba** _(angl. Guided Usage)_. Uporaba, glede na usmeritve in primere.
3. **Usposobljenost** _(angl. Competence)_. Lahko uporabi v novih scenarijih.
4. **Obvladovanje** _(angl. Mastery)_. Ovrednotenje, ustvarjanje in ovrednotenje glede na alternativne pristope.

<<<<<<<< HEAD:README.md
Cilji projekta so:
========
>>>>>>> development
```bash
git clone https://github.com/TPO-2025-2026/Projekt-06
cd Projekt-06
git checkout main
<<<<<<< HEAD
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

=======
cd src
```
>>>>>>>> development:src/README.md

- Spodbujanje usposobljenosti za tehnične koncepte, ki se uporabljajo pri projektu.
- Razvijanje veščin dela v skupini do ravni vodene uporabe.

Pri cilju razvijanja veščin dela v skupini, raven poznavanja ni dovolj. Ekipa mora izkusiti potrebo po najboljši praksi, preden bo cenila njeno vrednost in bo motivirana za uporabo ter se je šele takrat resnično nauči.

> Ekipa se mora zavedati, da sta komunikacija in redni sestanki pomembni, da je prisoten dnevni red, se pripravijo vnaprej in da si med sestanki delajo zapiske. Če nič drugega, lahko drug drugemu postavite različice treh Scrum vprašanj:
>
> 1. Kaj sem naredil od zadnjega sestanka?
> 2. Kaj bom naredil do naslednjega sestanka?
> 3. Kaj me ovira pri napredovanju?

## Dobre prakse

### Vloge in dogodki Scrum

Pri skupinskem projektu se močno priporoča uporaba [metodologije **Scrum**](<https://en.wikipedia.org/wiki/Scrum_(software_development)>), kjer so koristne predvsem strukturirane vloge in dogodki Scruma.

Naslednji primer ponazarja dodano vrednost strukture, kjer se ekipa nauči, da izkušnja dela v skupini ni enaka družabni izkušnji.

> Ena izmed študentskih ekip se je odločila, da Scrum ni primeren za njih. Začeli so na predpostavki, da so dobri prijatelji, ki se vidijo vsak dan in so vsi enaki. Posledično so bili prepričani, da ne potrebujejo vlog in razvojnega procesa.
> Ob prvem pregledu stanja so si dodelili vloge: lastnik izdelka, Scrum Master in razvijalci. Zakaj? Izkazalo se je, da so močno zaostajali ne le za drugimi ekipami, ampak tudi za lastnimi načrti.

### Iteracije in pregledi

Predlagana časovnica v poglavju [Terminski načrt](#terminski-načrt) predvideva 3-4 tedenske iteracije, ki se končajo z dogodki pregleda oz. zagovori. Vsebina posamezne iteracije je opisana s predlogami izdelkov projekta, medtem ko pregledi predstavljajo zagovor posameznih izdelkov skupine pred asistentom.

## Terminski načrt

<<<<<<<< HEAD:README.md
Spodnja slika prikazuje okviren terminski načrt pri predmetu, in sicer:
========
>>>>>>> development
```bash
git clone https://github.com/TPO-2025-2026/Projekt-06
cd Projekt-06
git checkout main
<<<<<<< HEAD
npm install
cd angular
=======
cd src
npm install
cd srecajmo-se
>>>>>>> development
npm install
ng build --output-path=build
cd ..
nodemon ./server.js
```
<<<<<<< HEAD

_Opomba: Za lokalni zagon potrebuješ MongoDB, ki teče na `127.0.0.1:27017`_

### Dostop do dokumentacije je na **/api/docs/** in **/api/swagger.json/**
=======
>>>>>>>> development:src/README.md

- **Predpriprave**: od 19. 2. 2026 do 23. 2. 2026,
- **1. iteracija**: od 23. 2. 2026 do 16. 3. 2026,
- **2. iteracija**: od 16. 3. 2026 do 6. 4. 2026,
- **3. iteracija**: od 6. 4. 2026 do 4. 5. 2026,
- **4. iteracija**: od 4. 5. 2026 do 25. 5. 2026.

![Terminski načrt](https://teaching.lavbic.net/plantuml/svg/dPRFJkCm4CRlVWeB3h2LKXhdpw9LXH2mI6XN0gtsHCLXshZ1JMfNjbkMhdW4tee7st6QXZOD3LhrqauztpVpct6KSsD1snIajVJWDzTJ8Kqcg8ItLsqF2EaR-vppCrASk1AGQfZIluHIAwOy5v8NFoZzYLylLQuqFHmpzocYrqhQLHJpdZ7quZB1P6NM1OooLAkvJCfSVZgEnabTCRg-EFr-MQQ3rkffrtNhp5Jat5XLLVS_FgDS6Pvy9D3OP2xIHrjr-aBw9oKzWapb31oxOKt9Qf06_-BIagD7aN0wLieErH-IWqpda79gSZBJGbepWfpJ9ywp_1abmSvr0iy8X9V54eEosn7MOx7N2xrUJ8Mf1zdNdM3azVoc8Di8bj70yrUYhWya9IGzJ7eSniEwwqS7K3TiES2Y3mwGEwqcV6HfiS26hX8OraJ8e5yaVAlcSNQF-ymjpwXOBc02SW9qXe9JRe4U-t6NTR_qJugaimVw2BCPbuQ2tL8zsb5jCEfqVi4omPjX-O8kgCdcCzolJWTTgEK9bni-OEZWod-WEHXi8A8uEjCeURCS2WrO-r8iO8yMszAY89Cr7Mp5MHqPoYKEqFEetwLOeuQHG1QUXz0wdJj4agiKqI3Qp3ghifgYaEF0sKfHjmtMjlwgXnrZveoB01dS9WcKzD4AAgzj9nn9i7SaRld8u1vIjS1BjAEsgko-1dUdi62J26iWSclatAsD4SRowMU1H1MGiCLtZGEdCLDQlRsA7AXoP-LalkqLTyEzHDnjUoVIA5XIOIrKeaqgGGELc-K2UK_4ekHInn8sOuahBASjnciih1rBs8tsOd7Fc7SiR0-Me0LBl8abRC3oGyctL-dkgIl-axlYixRR4zUfP8KFT-jUzR9bnQ9MA2nwXzAWLo89Mv3uh6Ao-zn277pK-C0Dkl7Uyjpz9kGSTOlNZdy0 "Terminski načrt")

V mapi [**`docs`**](docs) so na voljo predloge dokumentov posameznih iteracij, v mapi [**`src`**](src) izvorna koda in v mapi [**`test`**](src/test) testni primeri.

## Reference

1. ACM/IEEE-CS. **Computer Science Curricula 2013**. ACM Press and IEEE Computer Society Press (December 2013). DOI: <http://dx.doi.org/10.1145/2534860>, str. 174.

2. IEEE-CS and ACM. **Software Engineering 2014: Curriculum Guidelines for Undergraduate Degree Programs in Software Engineering**. <http://www.acm.org/education/se2014.pdf>, str. 45.
>>>>>>> development
