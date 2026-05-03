# :green_square: Izvedljiv sistem (2. poročilo o stanju)

| [:arrow_backward:](02_Osnutek_sistema_1_porocilo_o_stanju.md) Prejšnji dokument |                       Trenutni dokument                       | Naslednji dokument [:arrow_forward:](04_Koncna_izdaja_celovito_koncno_porocilo.md) |
| :------------------------------------------------------------------------------ | :-----------------------------------------------------------: | ---------------------------------------------------------------------------------: |
| :orange_square: **Osnutek sistema**<br>(1. poročilo o stanju)                   | :green_square: **Izvedljiv sistem**<br>(2. poročilo o stanju) |                      :blue_square: **Končna izdaja**<br>(celovito končno poročilo) |

![Terminski načrt](https://teaching.lavbic.net/plantuml/svg/dPRFJkCm4CRlVWeB3h2LKXhdpw9LXH2mI6XN0gtsHCLXshZ1JMfNjbkMhdW4tee7st6QXZOD3LhrqauztpVpct6KSsD1snIajVJWDzTJ8Kqcg8ItLsqF2EaR-vppCrASk1AGQfZIluHIAwOy5v8NFoZzYLylLQuqFHmpzocYrqhQLHJpdZ7quZB1P6NM1OooLAkvJCfSVZgEnabTCRg-EFr-MQQ3rkffrtNhp5Jat5XLLVS_FgDS6Pvy9D3OP2xIHrjr-aBw9oKzWapb31oxOKt9Qf06_-BIagD7aN0wLieErH-IWqpda79gSZBJGbepWfpJ9ywp_1abmSvr0iy8X9V54eEosn7MOx7N2xrUJ8Mf1zdNdM3azVoc8Di8bj70yrUYhWya9IGzJ7eSniEwwqS7K3TiES2Y3mwGEwqcV6HfiS26hX8OraJ8e5yaVAlcSNQF-ymjpwXOBc02SW9qXe9JRe4U-t6NTR_qJugaimVw2BCPbuQ2tL8zsb5jCEfqVi4omPjX-O8kgCdcCzolJWTTgEK9bni-OEZWod-WEHXi8A8uEjCeURCS2WrO-r8iO8yMszAY89Cr7Mp5MHqPoYKEqFEetwLOeuQHG1QUXz0wdJj4agiKqI3Qp3ghifgYaEF0sKfHjmtMjlwgXnrZveoB01dS9WcKzD4AAgzj9nn9i7SaRld8u1vIjS1BjAEsgko-1dUdi62J26iWSclatAsD4SRowMU1H1MGiCLtZGEdCLDQlRsA7AXoP-LalkqLTyEzHDnjUoVIA5XIOIrKeaqgGGELc-K2UK_4ekHInn8sOuahBASjnciih1rBs8tsOd7Fc7SiR0-Me0LBl8abRC3oGyctL-dkgIl-axlYixRR4zUfP8KFT-jUzR9bnQ9MA2nwXzAWLo89Mv3uh6Ao-zn277pK-C0Dkl7Uyjpz9kGSTOlNZdy0 "Terminski načrt")

Do 11. tedna naj bi bila implementirana osnovna funkcionalnost sistema v obliki demo prototipa. 2. poročilo o stanju je osredotočeno na razdelka [**4 Opis sistema**](#4-opis-sistema) in [**5 Trenutno stanje**](#5-trenutno-stanje). Pri opisu sistema se je treba osredotočiti predvsem na opis arhitekture sistema.

Izogibajte se nepotrebnemu podvajanju pri opisovanju sistema. Vključite ostale informacije na najbolj ustrezna mesta, med [uvodom](#1-uvod) in [opisom sistema](#4-opis-sistema).

Za izdelavo diagramov uporabite orodje [**PlantUML**](https://plantuml.com/) in v poročilo vključite izvorno kodo diagrama v jeziku PlantUML (v mapi [`gradivo`](gradivo)), sliko diagrama pa vključite s povezavo (in ne preko neposredne vključitve binarne datoteke) preko storitve <https://teaching.lavbic.net/plantuml>, kot prikazujejo primeri vključenih diagram v tej predlogi poročila.

## :page_with_curl: Sistem za spontana družabna srečanja – združi ljudi s skupnimi interesi v tvoji bližini

## :information_desk_person: Ime ekipe: 06. skupina | Člani ekipe: Miha Fabčič, Aleks Gogić, Jakob Jesenko, Leja Petrič, Tim Pezdirc

## 1 Uvod

To poročilo predstavlja 2. poročilo o stanju projekta sistema za spontana družabna srečanja. Medtem ko je bila prejšnja iteracija namenjena zasnovi sistema in pripravi demo aplikacije z demo podatki, se je ekipa v tej iteraciji prvič lotila dejanske implementacije. Osrednji dosežki so vzpostavitev podatkovne baze MongoDB, razvoj celotnega backenda z REST API-jem ter implementacija ključnih delov Angular frontenda (registracija, prijava, nadzorna plošča). Poročilo je osredotočeno na opis arhitekture sistema (poglavje 4) in prikaz trenutnega stanja implementacije (poglavje 5).

### 1.2 Poudarki

**Načrt za to iteracijo** je bil prehod iz dokumentacijsko-demo faze v dejansko implementacijo. Konkretni cilji so bili: vzpostavitev MongoDB podatkovne baze z ustreznimi modeli, implementacija celotnega backend REST API-ja, uspešna povezava backenda s frontendom ter prototipna implementacija pametne komponente za oblikovanje skupin.

**Ekipa je v tej iteraciji dosegla:**

- Vzpostavitev MongoDB podatkovne baze z dokumentnimi modeli za uporabnike, profile, interese, skupine in sporočila.
- Implementacijo celotnega backend REST API-ja (Node.js/Express) z vsemi ključnimi endpointi: upravljanje uporabnikov in profilov, interesi, iskanje in predlogi skupin, skupinski chat ter administratorske funkcije.
- JWT-based avtentikacijo z zaščito zasebnih API poti in ločenimi vlogami (uporabnik, administrator).
- Integracijo zunanjega e-poštnega servisa (Nodemailer + SMTP) za verifikacijo računa ob registraciji in ponastavitev gesla.
- Prototipno implementacijo pametne komponente – osnovna logika scoring algoritma (Jaccard podobnost interesov, Haversine geografska razdalja, časovno prekrivanje) je vzpostavljena in funkcionalna, a kalibracija uteži in obravnava robnih primerov še nista dokončani.
- Na strani frontenda (Angular): implementacijo toka registracije v treh korakih, prijave z JWT ter uporabniške nadzorne plošče (dashboard).
- Uspešno integracijo frontenda z backendom prek REST API-ja za vse implementirane maske.

### 1.3 Spremembe

Nismo uvedli nobenih sprememb.

## 2 Potrebe naročnika

Primarni naročnik so končni uporabniki (mladi odrasli, 18–35 let, v urbanih okoljih), ki iščejo preprost in učinkovit način za organizacijo spontanih družabnih srečanj z novimi ljudmi. Želijo si sistem, ki jim z minimalnim vnosom podatkov (interesi, lokacija, razpoložljivost) ponudi kakovostne predloge manjših skupin (3–5 oseb) ter omogoči neposredno usklajevanje srečanja v skupinskem chatu.

Sekundarni deležniki (lokalna skupnost, ponudniki prostorov za srečanja) pričakujejo večjo socialno vključenost in strukturiran način organizacije srečanj v javnih prostorih. Operativni naročnik (administrator sistema) pričakuje pregledno nadzorno ploščo za upravljanje uporabnikov, reševanje prijav neprimernega vedenja ter vpogled v ključne metrike kakovosti algoritma za oblikovanje skupin.

Splošna želena izkušnja naročnika je, da se celoten tok od registracije do prvega predloga skupin odvije v manj kot 5 minutah, brez tehničnih ovir in z občutkom varnosti pri spoznavanju novih ljudi.

---

## 3 Cilji projekta

Projekt naslavlja problem avtomatskega oblikovanja manjših kompatibilnih skupin za spontana srečanja, ki ga obstoječe platforme ne rešujejo celovito. Tinder in Bumble sta osredotočena na individualno ujemanje, Meetup na organizacijo večjih javnih dogodkov, Timeleft na fiksne tematske večerje. Nobena od teh rešitev ne kombinira sočasnega ujemanja interesov, geografske bližine in časovne razpoložljivosti za samodejno oblikovanje manjših spontanih skupin.

**Ključne koristi projekta za naročnika:**

- Povprečen čas od registracije do prvega predloga skupin je največ 5 minut.
- Najmanj 60 % prikazanih predlogov skupin je potrjenih s strani uporabnikov.
- Najmanj 80 % testnih uporabnikov brez pomoči uspešno zaključi registracijo, prijavo in iskanje skupine.
- Delež neuspešno zaključenih ključnih tokov zaradi notranjih napak ne preseže 1 %.
- Po potrjeni skupini je skupinski chat takoj dostopen vsem potrjenim članom v istem vmesniku.
- Administrativna dejanja so v 100 % primerov zabeležena z identiteto izvajalca, časom in tipom akcije.
- Kakovost predlogov je merljiva z deležem sprejetih predlogov in povprečno oceno po srečanju.

## 4 Opis sistema

### 4.1 Pregled sistema

Sistem za spontana družabna srečanja je spletna aplikacija, ki na podlagi profilov registriranih uporabnikov (interesi, lokacija, časovna razpoložljivost) samodejno oblikuje manjše kompatibilne skupine (3–5 oseb) in jim omogoča usklajevanje srečanja prek vgrajenega skupinskega chata. Sistem je zasnovan po tristopenjski arhitekturi: Angular SPA frontend, Node.js/Express REST API backend ter MongoDB podatkovna baza. Za komunikacijo v realnem času (skupinski chat) je vzporedno z REST API-jem vzpostavljen WebSocket strežnik (Socket.io).

Jedro sistema je **pametna komponenta** – algoritem za oblikovanje skupin, ki kombinira tri kriterije ujemanja v skupno oceno kompatibilnosti:

```
score = w1 * similarity_interesov + w2 * blizina_geografska + w3 * prekrivanje_casa
```

Podobnost interesov se izračuna z Jaccard indeksom (razmerje skupnih do vseh interesov para), geografska bližina s Haversine formulo (razdalja v km med koordinatama dveh lokacij), časovno prekrivanje pa kot delež skupnih urnih blokov razpoložljivosti. Uteži `w1`, `w2`, `w3` so nastavljivi parametri; privzete vrednosti se bodo kalibrirale na podlagi podatkov iz testiranja v naslednji iteraciji.

**Glavne načrtovalske odločitve in njihove utemeljitve:**

- **MongoDB** kot podatkovna baza: Interesi in časovna razpoložljivost so po naravi polstrukturirani in variabilni med uporabniki. Dokumentni model MongoDB omogoča shranjevanje teh podatkov brez stroge relacijske sheme ter pospešuje razvoj v MVP fazi, hkrati pa podpira enostavno razširitev z novimi atributi brez migracij.
- **Node.js/Express** za backend: JavaScript full-stack pristop zmanjšuje kontekstualni preklop med frontendom in backendom ter omogoča souporabo validacijske logike. Express je uveljavljen mikro-framework, primeren za hitro postavitev RESTful API-ja z dobro podporo za JWT middleware in integracijo Socket.io.
- **Angular** za frontend: Ekipa ima predhodno izkušnjo z Angularom. Komponentna arhitektura ogrodja ustreza modularni naravi aplikacije (profil, predlogi skupin, chat, admin panel). Reaktivni pristop prek RxJS je primeren za obvladovanje asinhronih REST klicev in WebSocket dogodkov.
- **JWT avtentikacija**: Brezstanovno preverjanje pristnosti je naravno za SPA arhitekturo – strežnik ne vzdržuje sej, žeton pa nosi informacijo o vlogi (uporabnik/administrator), kar poenostavlja zaščito API poti z middleware.
- **Socket.io** za skupinski chat: Zahteva po dvosmerni komunikaciji v realnem času narekuje WebSocket pristop. Socket.io zagotavlja zanesljivo abstrakcijo s samodejnim fallback mehanizmom ter sobami (rooms), ki naravno ustrezajo konceptu skupin v sistemu.
- **Resend** za e-pošto: Preprosta integracija za MVP;

**Kontekstni diagram sistema** prikazuje meje sistema in ključne zunanje interakcije:

![Kontekstni diagram](./gradivo/img/kontekstni_diagram_01.png "Kontekstni diagram")

**Opis zunanjih interakcij sistema:**

Sistem komunicira s tremi zunanjimi entitetami:

1. **Geokodirni API** (npr. OpenStreetMap Nominatim): Ob vnosu lokacije v profilu sistem pošlje besedilni niz zunanjemu servisu, ki vrne standardizirane geografske koordinate. Koordinate se shranijo v MongoDB in pri vsakem klicu algoritma za oblikovanje skupin uporabijo za izračun geografske razdalje po Haversine formuli. Ob nedosegljivosti zunanjega servisa sistem prikaže napako in omogoča ponovni vnos.

2. **E-poštni servis** (SMTP prek Resenda): Sistem pošlje verifikacijsko e-pošto ob registraciji in e-pošto za ponastavitev gesla ob zahtevi. Prek tega kanala se prenašajo izključno sistemska obvestila; vsebina skupinskih chatov in osebni podatki se ne prenašajo. Ob nedosegljivosti servisa sistem zabeleži napako v dnevnik in obvesti uporabnika.

3. **Spletni brskalnik (odjemalec)**: Vsi uporabniki (gostje, registrirani uporabniki, administratorji) dostopajo do sistema prek spletnega brskalnika. Komunikacija med Angular SPA in backendom poteka prek HTTPS za REST API klice ter prek WSS (WebSocket Secure) za skupinski chat v realnem času.

Znotraj meja sistema so vse komponente: Angular frontend, Node.js/Express REST API, Socket.io strežnik, MongoDB podatkovna baza in pametna komponenta (algoritem za oblikovanje skupin).

### 4.2 Osrednji arhitekturni pogledi

## Razredni diagram
Razredni diagram prikazuje strukturo sistema na treh ravneh: mejne razrede (zeleni), ki predstavljajo zaslonske maske, kontrolne razrede (rdeči), ki vsebujejo poslovno logiko, in entitetne razrede (modri), ki hranijo podatke. Mejni razredi so vsaka stran v aplikaciji (registracija, prijava, profil, nadzorna plošča, admin plošče). Kontrolni razredi upravljajo procese, kot so registracija, prijava, iskanje skupin in pošiljanje e-pošte. Entitetni razredi predstavljajo trajne podatke: uporabnike, profile, skupine, sporočila, prijave in parametre algoritma. Povezave med razredi so označene s števnostmi (npr. en uporabnik ima en profil, ena skupina ima več članov). Diagram je izhodišče za izvedbo podatkovne baze in programskih razredov.

![Razredni Diagram](./gradivo/img/razredniDiagram.png)

## Arhitektura sistema
Seznam elementov in skrbnikov:
| Element | Namen | Skrbnik |
|---------|-------|---------|
| Nadzorna plošča uporabnika | Pregled predlogov skupin in profila | Tim Pezdirc |
| Nadzorna plošča administratorja | Prikaz statistike platforme (št. uporabnikov, aktivnih iskanj, ...) | Tim Pezdirc |
| Avtentikacija | Skrbi za prijavo uporabnikov, preverjanje gesel in generiranje JWT žetonov | Aleks Gogić |
| Chat | Prikaz klepeta skupine | Miha Fabčič |
| Kontakt | Pregled sporočil uporabnikov (feedback) | Miha Fabčič |
| Urejanje profila | Skrbi za urejanje profila (spremembe interesov, lokacije, ...) | Jakob Jesenko |
| Ponastavitev gesla | Prikaz strani za ponastavitev gesla | Jakob Jesenko |
| Pametna komponenta | Skrbi za predloge skupin na podlagi formule | Leja Petrič |
| Krmilniki | Upravljanje različnih delov aplikacije | Leja Petrič |
| E-mail servis | Pošilja e-maile za verifikacijo profila in ponastavitev gesla | Aleks Gogić |

## Logični pogled (paketni diagram)
![Paketni Diagram](./gradivo/img/paketni_diagram.png "Paketni diagram")

## Procesni pogled (diagram aktivnosti)
![Diagram Aktivnosti](./gradivo/img/diagram_aktivnosti.png "Diagram aktivnosti")

## Razvojni pogled (komponentni diagram)
![Komponentni Diagram](./gradivo/img/komponentni_diagram.png "Komponentni diagram")

## Fizični pogled (postavitveni diagram)
![Postavitveni Diagram](./gradivo/img/postavitveni_diagram.png "Postavitveni diagram")

## Diagrami zaporedja za osnovne in alternativne tokove
### 1. Registracija

**Osnovni tok:** Gost odpre masko za registracijo, izpolni tri korake, sistem validira podatke, ustvari nepotrjen račun in pošlje verifikacijsko povezavo. Gost odpre povezavo in sistem aktivira račun.

![Registracija osnovni](./gradivo/img/osnovni_tok/1.%20Registracija%20(osnovni%20tok).png)

**Alternativni tok A1 (popravi vnos v prejšnjem koraku):** Gost med izpolnjevanjem ugotovi, da je treba dopolniti prejšnji korak. Vrne se, popravi podatke, sistem ohrani že veljavne podatke in postopek se nadaljuje.

![Registracija A1](./gradivo/img/1-Registracija%20-%20Alternativni%20tok%20A1%20(popravi%20vnos%20v%20prejšnjem%20koraku).png)

**Izjemni tok E1 (e-naslov že registriran):** Gost vnese e-naslov, ki že obstaja v sistemu. Sistem zavrne registracijo in prikaže napako. Gost vnese drug e-naslov in ponovno odda obrazec.

![Registracija E1](./gradivo/img/1-Registracija%20-%20Izjemni%20tok%20E1%20(e-naslov%20že%20registriran).png)

**Izjemni tok E2 (verifikacijska povezava potekla):** Gost odpre verifikacijsko povezavo po preteku roka. Sistem zavrne aktivacijo. Gost zahteva novo povezavo, sistem jo pošlje in ob odprtju aktivira račun.

![Registracija E2](./gradivo/img/1-Registracija%20-%20Izjemni%20tok%20E2%20(verifikacijska%20povezava%20potekla).png)

---

### 2. Prijava

**Osnovni tok:** Gost odpre masko za prijavo, vnese e-naslov in geslo, sistem preveri poverilnice, vzpostavi sejo in preusmeri na ustrezno nadzorno ploščo.

![Prijava osnovni](./gradivo/img/osnovni_tok/2.%20Prijava%20(osnovni%20tok).png)

**Alternativni tok A1 (prijava administratorja):** Gost vnese poverilnice za administratorski račun. Sistem prepozna vlogo administratorja in preusmeri na administratorsko nadzorno ploščo.

![Prijava A1](./gradivo/img/2-Prijava%20-%20Alternativni%20tok%20A1%20(prijava%20administratorja).png)

**Izjemni tok E1 (napačno geslo):** Gost vnese napačno geslo. Sistem zavrne prijavo in poveča števec neuspelih poskusov. Gost popravi geslo in se uspešno prijavi.

![Prijava E1](./gradivo/img/2-Prijava%20-%20Izjemni%20tok%20E1%20(napačno%20geslo).png)

**Izjemni tok E2 (račun ni verificiran):** Gost vnese poverilnice neverificiranega računa. Sistem zavrne prijavo in ponudi ponovno pošiljanje verifikacije. Gost potrdi e-pošto in se nato uspešno prijavi.

![Prijava E2](./gradivo/img/2-Prijava%20-%20Izjemni%20tok%20E2%20(račun%20ni%20verificiran).png)

---

### 3. Ponastavitev gesla

**Osnovni tok:** Gost klikne "Pozabljeno geslo", vnese e-naslov, sistem pošlje ponastavitveno povezavo. Gost odpre povezavo, vnese novo geslo, sistem ga shrani in preusmeri na prijavo.

![Ponastavitev gesla osnovni](./gradivo/img/osnovni_tok/3.%20Ponastavitev%20gesla%20(osnovni%20tok).png)

**Alternativni tok A1 (takojšnja prijava po spremembi gesla):** Po uspešni spremembi gesla sistem uporabnika ne preusmeri samo na prijavo, ampak ga takoj prijavi z novimi poverilnicami.

![Ponastavitev gesla A1](./gradivo/img/3-Ponastavitev%20gesla%20-%20Alternativni%20tok%20A1%20(takojšnja%20prijava%20po%20spremembi).png)

**Izjemni tok E1 (povezava neveljavna ali potekla):** Gost odpre neveljavno ali poteklo povezavo. Sistem zavrne spremembo in ponudi novo zahtevo. Gost zahteva novo povezavo in nato uspešno spremeni geslo.

![Ponastavitev gesla E1](./gradivo/img/3-Ponastavitev%20gesla%20-%20Izjemni%20tok%20E1%20(povezava%20neveljavna%20ali%20potekla).png)

**Izjemni tok E2 (gesli se ne ujemata):** Gost vnese novo geslo in potrditev, ki se ne ujemata. Sistem zavrne oddajo. Gost popravi vnos in uspešno spremeni geslo.

![Ponastavitev gesla E2](./gradivo/img/3-Ponastavitev%20gesla%20-%20Izjemni%20tok%20E2%20(gesli%20se%20ne%20ujemata).png)

---

### 4. Odjava

**Osnovni tok:** Akter izbere možnost "Odjava", sistem prekine aktivno sejo in preusmeri na začetno/prijavno stran.

![Odjava osnovni](./gradivo/img/osnovni_tok/4.%20Odjava%20(osnovni%20tok).png)

**Alternativni tok A1 (samodejna odjava zaradi neaktivnosti):** Sistem zazna presežen čas neaktivnosti, opozori akterja in po izteku invalidira sejo ter preusmeri na prijavno stran.

![Odjava A1](./gradivo/img/4-Odjava%20-%20Alternativni%20tok%20A1%20(samodejna%20odjava%20zaradi%20neaktivnosti).png)

**Izjemni tok E1 (seja je že potekla):** Akter izbere "Odjava", vendar je seja že potekla. Sistem ne izvaja dodatnega zaključevanja, vseeno pa izvede preusmeritev.

![Odjava E1](./gradivo/img/4-Odjava%20-%20Izjemni%20tok%20E1%20(seja%20je%20že%20potekla).png)

---

### 5. Urejanje profila

**Osnovni tok:** Uporabnik odpre profil, spremeni želene podatke, sistem validira in shrani spremembe.

![Urejanje profila osnovni](./gradivo/img/osnovni_tok/5.%20Urejanje%20profila%20(osnovni%20tok).png)

**Alternativni tok A1 (posodobitev samo enega sklopa):** Uporabnik spremeni le en sklop podatkov (npr. interese). Sistem validira samo spremenjeni sklop in shrani spremembo.

![Urejanje profila A1](./gradivo/img/5-Urejanje%20profila%20-%20Alternativni%20tok%20A1%20(posodobitev%20samo%20enega%20sklopa).png)

**Izjemni tok E1 (neveljaven format podatkov):** Uporabnik odda neveljaven podatek. Sistem zavrne shranjevanje in označi napačno polje. Uporabnik popravi podatek in uspešno shrani.

![Urejanje profila E1](./gradivo/img/5-Urejanje%20profila%20-%20Izjemni%20tok%20E1%20(neveljaven%20format%20podatkov).png)

**Izjemni tok E2 (konflikt sočasnih sprememb):** Uporabnik odda spremembe na zastarelem stanju profila. Sistem zazna konflikt in zahteva osvežitev. Uporabnik osveži podatke, ponovno uredi profil in odda spremembe.

![Urejanje profila E2](./gradivo/img/5-Urejanje%20profila%20-%20Izjemni%20tok%20E2%20(konflikt%20sočasnih%20sprememb).png)

---

### 6. Iskanje skupin

**Osnovni tok:** Uporabnik izbere "Išči skupino", sistem preveri profil, sproži izračun predlogov in prikaže seznam.

![Iskanje skupin osnovni](./gradivo/img/osnovni_tok/6.%20Iskanje%20skupin%20(osnovni%20tok).png)

**Alternativni tok A1 (ponovitev iskanja po posodobitvi profila):** Uporabnik sproži iskanje, nato posodobi profil in ponovno sproži iskanje. Sistem upošteva nove podatke in prikaže osvežen nabor predlogov.

![Iskanje skupin A1](./gradivo/img/6-Iskanje%20skupin%20-%20Alternativni%20tok%20A1%20(ponovitev%20iskanja%20po%20posodobitvi%20profila).png)

**Izjemni tok E1 (profil ni dovolj izpolnjen):** Sistem preveri profil in ugotovi manjkajoče podatke. Zavrne iskanje in navede manjkajoča polja. Uporabnik dopolni profil in ponovno sproži iskanje.

![Iskanje skupin E1](./gradivo/img/6-Iskanje%20skupin%20-%20Izjemni%20tok%20E1%20(profil%20ni%20dovolj%20izpolnjen).png)

**Izjemni tok E2 (pametna komponenta nedosegljiva):** Sistem poskusi klic pametne komponente, vendar ta ne uspe. Prikaže obvestilo in možnost ponovnega poskusa. Uporabnik ponovi zahtevo in sistem uspešno vrne predloge.

![Iskanje skupin E2](./gradivo/img/6-Iskanje%20skupin%20-%20Izjemni%20tok%20E2%20(pametna%20komponenta%20nedosegljiva).png)

---

### 7. Pregled skupin in chata (uporabnik)

**Osnovni tok:** Uporabnik odpre izbrano skupino iz seznama predlogov. Sistem prikaže čas, lokacijo, razloge ujemanja in kartice članov. Uporabnik si lahko ogleda kratek profil člana in odpre skupinski chat z zgodovino.

![Pregled skupin in chata osnovni](./gradivo/img/osnovni_tok/7.%20Pregled%20skupin%20in%20chata%20(uporabnik,%20osnovni%20tok).png)

**Alternativni tok A1 (pregled posameznega člana):** Uporabnik klikne ikono člana, sistem odpre kratek profil, uporabnik si ga ogleda in zapre.

![Pregled skupin in chata A1](./gradivo/img/7-Pregled%20skupin%20in%20chata%20-%20Alternativni%20tok%20A1%20(pregled%20posameznega%20člana).png)

**Alternativni tok A2 (branje chata brez pošiljanja sporočila):** Uporabnik odpre chat, pregleda zgodovino sporočil in ga zapre brez novega vnosa. Sistem ohrani stanje pogovora nespremenjeno.

![Pregled skupin in chata A2](./gradivo/img/7-Pregled%20skupin%20in%20chata%20-%20Alternativni%20tok%20A2%20(branje%20chata%20brez%20pošiljanja).png)

**Izjemni tok E1 (podatki niso dosegljivi):** Sistem poskuša prikazati podatke skupine in članov, vendar nalaganje ne uspe. Prikaže opozorilo in možnost ponovnega nalaganja. Uporabnik ponovi in sistem prikaže podatke.

![Pregled skupin in chata E1](./gradivo/img/7-Pregled%20skupin%20in%20chata%20-%20Izjemni%20tok%20E1%20(podatki%20niso%20dosegljivi).png)

**Izjemni tok E2 (skupina med prikazom postane neveljavna):** Sistem med prikazom zazna, da je skupina postala neveljavna. Zapre pregled skupine in osveži seznam predlogov.

![Pregled skupin in chata E2](./gradivo/img/7-Pregled%20skupin%20in%20chata%20-%20Izjemni%20tok%20E2%20(skupina%20postane%20neveljavna).png)

---

### 8. Odločitev o udeležbi

**Osnovni tok:** Uporabnik iz pregleda skupine izbere potrditev ali zavrnitev. Sistem preveri, ali je skupina še veljavna, zabeleži odločitev in posodobi status odziva.

![Odločitev o udeležbi osnovni](./gradivo/img/8-Odločitev%20o%20udeležbi.png)

**Alternativni tok A1 (potrditev udeležbe):** Uporabnik izbere potrditev. Sistem preveri veljavnost skupine, zabeleži status "potrjeno" in posodobi status odziva.

![Odločitev o udeležbi A1](./gradivo/img/8-Alt%20tok%20(potrditev%20udeležbe).png)

**Alternativni tok A2 (zavrnitev predloga):** Uporabnik izbere zavrnitev. Sistem preveri veljavnost skupine, zabeleži status "zavrnjeno" in posodobi status odziva.

![Odločitev o udeležbi A2](./gradivo/img/8-Alt%20tok%20(zavrnitev%20udeležbe).png)

**Izjemni tok E1 (predlog ni več aktiven):** Uporabnik izbere potrditev ali zavrnitev, vendar sistem zazna, da predlog ni več veljaven. Zavrne akcijo in osveži seznam predlogov.

![Odločitev o udeležbi E1](./gradivo/img/8-Izjemni%20(predlog%20ni%20aktiven).png)

---

### 9. Oddaja povratne informacije

**Osnovni tok:** Sistem prikaže poziv za oddajo povratne informacije. Uporabnik vnese oceno in komentar. Sistem preveri veljavnost in shrani povratno informacijo.

![Oddaja povratne informacije osnovni](./gradivo/img/9-Oddaja%20povratne%20informacije.png)

**Alternativni tok A1 (oddaja samo ocene):** Uporabnik vnese samo oceno in pusti komentar prazen. Sistem sprejme oddajo in shrani povratno informacijo.

![Oddaja povratne informacije A1](./gradivo/img/9-Alt%20tok%20(oddaja%20samo%20ocene).png)

**Izjemni tok E1 (uporabnik je že oddal povratno informacijo):** Uporabnik poskuša oddati povratno informacijo za isti dogodek. Sistem zazna podvojitev in zavrne oddajo.

![Oddaja povratne informacije E1](./gradivo/img/9-Izjemni%20(podvojena%20oddaja).png)

**Izjemni tok E2 (napaka pri shranjevanju):** Sistem ne uspe shraniti podatkov. Ponudi ponovni poskus. Uporabnik ponovi oddajo in sistem uspešno shrani.

![Oddaja povratne informacije E2](./gradivo/img/9-Izjemni%20(napaka%20pri%20shranjevanju).png)

---

### 10. Prijava neprimernega vedenja

**Osnovni tok:** Uporabnik odpre skupino, izbere uporabnika in možnost "Prijavi neprimerno vedenje". Sistem prikaže obrazec. Uporabnik vnese opis incidenta in odda prijavo. Sistem shrani prijavo in potrdi prejem.

![Prijava neprimernega vedenja osnovni](./gradivo/img/10-Prijava%20neprimernega%20vedenja.png)

**Alternativni tok A1 (dopolnitev prijave):** Uporabnik odda prijavo. Sistem potrdi prejem. Uporabnik se vrne in dopolni opis. Sistem shrani spremembo.

![Prijava neprimernega vedenja A1](./gradivo/img/10-Alt%20tok%20(dopolnitev%20prijave).png)

**Izjemni tok E1 (neprimerno izpolnjena prijava):** Uporabnik vpiše podatke, ki ne izpolnjujejo zahtev. Sistem zavrne oddajo in označi obvezna polja. Uporabnik popravi podatke in ponovno odda prijavo.

![Prijava neprimernega vedenja E1](./gradivo/img/10-Izjemni%20(neveljavni%20podatki).png)

---

### 11. Pregled informacij

**Osnovni tok:** Gost ali uporabnik v footerju odpre izbrano informacijsko stran. Sistem prikaže vsebino izbrane strani.

![Pregled informacij osnovni](./gradivo/img/11-Pregled%20informacij.png)

**Alternativni tok A1 (branje več informacijskih strani):** Uporabnik odpre prvo informacijsko stran, nato odpre še drugo. Sistem prikaže obe vsebini.

![Pregled informacij A1](./gradivo/img/11-Alt%20tok%20(branje%20več%20info%20strani).png)

**Izjemni tok E1 (informacijska stran ni dosegljiva):** Sistem poskuša naložiti vsebino, vendar nalaganje ne uspe. Prikaže opozorilo in možnost ponovnega nalaganja. Uporabnik ponovi zahtevo in sistem prikaže vsebino.

![Pregled informacij E1](./gradivo/img/11-Izjemni%20(stran%20ni%20dosegljiva).png)

---

### 12. Kontaktni obrazec

**Osnovni tok:** Gost ali uporabnik odpre stran "Kontakt", vpiše podatke in odda obrazec. Sistem preveri veljavnost, shrani sporočilo in potrdi prejem.

![Kontaktni obrazec osnovni](./gradivo/img/12-Kontaktni%20obrazec.png)

**Alternativni tok A1 (dopolnitev obrazca pred oddajo):** Uporabnik vpiše del obrazca, nato opazi manjkajoče podatke. Dopolni obvezna polja in ponovno odda obrazec.

![Kontaktni obrazec A1](./gradivo/img/12-Alt%20tok%20(dopolnitev%20obrazca).png)

**Izjemni tok E1 (neveljavno izpolnjen kontaktni obrazec):** Uporabnik odda obrazec z manjkajočimi ali napačnimi podatki. Sistem zavrne oddajo in označi napake v poljih. Uporabnik popravi obrazec in ponovno odda.

![Kontaktni obrazec E1](./gradivo/img/12-Izjemni%20(neveljavni%20podatki).png)

---

### 13. Upravljanje uporabnikov (administrator)

**Osnovni tok:** Administrator odpre sekcijo Uporabniki. Sistem prikaže paginiran seznam uporabnikov. Administrator izvede akcijo (blokiraj/deblokiraj/aktiviraj/deaktiviraj/opozori).

![Upravljanje uporabnikov (admin) osnovni](./gradivo/img/13-Upravljanje%20uporabnikov%20(admin).png)

**Alternativni tok A1 (opozorilo uporabniku):** Administrator odpre izbranega uporabnika in izbere akcijo "Opozori". Sistem shrani opozorilo in uporabnika označi z rumeno vizualno oznako.

![Upravljanje uporabnikov (admin) A1](./gradivo/img/13-Alt%20tok%20(opozorilo).png)

**Izjemni tok E1 (administrator nima ustreznih pravic):** Administrator sproži administrativno akcijo, vendar sistem preveri pravice in akcijo zavrne. Prikaže razlog zavrnitve.

![Upravljanje uporabnikov (admin) E1](./gradivo/img/13-Izjemni%20(nima%20ustreznih%20pravic).png)

**Izjemni tok E2 (konflikt stanja računa):** Administrator izvede akcijo nad uporabnikom, vendar sistem zazna konflikt stanja v drugi seji. Sistem osveži seznam uporabnikov in administrator ponovi akcijo.

![Upravljanje uporabnikov (admin) E2](./gradivo/img/13-Izjemni%20(konflikt%20stanja).png)

---

### 14. Pregled kontaktnih obrazcev in prijav (administrator)

**Osnovni tok:** Administrator odpre sekcijo Obvestila. Sistem prikaže seznam obvestil. Administrator odpre podrobnosti in označi obvestilo kot obdelano.

![Pregled obvestil, prijav in kontaktov osnovni](./gradivo/img/14-Pregled%20obvestil,%20prijav%20in%20kontaktov.png)

**Alternativni tok A1 (eskalacija obvestila):** Administrator odpre obvestilo visoke prioritete in izbere možnost eskalacije. Sistem označi obvestilo kot eskalirano in ga posreduje v nadaljnjo obravnavo.

![Pregled obvestil, prijav in kontaktov A1](./gradivo/img/14-Alt%20tok%20(eskalacija%20obvestila).png)

**Alternativni tok A2 (eskalacija na upravljanje uporabnika):** Administrator pri pregledu prijave ugotovi, da je potrebna administrativna akcija. Izbere možnost "Upravljaj uporabnika", sistem ga preusmeri na sekcijo za upravljanje uporabnikov. Po izvedeni akciji se vrne nazaj.

![Pregled obvestil, prijav in kontaktov A2](./gradivo/img/14-Alt%20tok%20(eskalacija%20na%20upravljanje%20uporabnika).png)

**Izjemni tok E1 (podrobnosti obvestila niso dosegljive):** Sistem ne naloži podrobnosti obvestila. Prikaže opozorilo in možnost ponovnega nalaganja. Administrator ponovi zahtevo in sistem naloži podrobnosti.

![Pregled obvestil, prijav in kontaktov E1](./gradivo/img/14-Izjemni%20(podrobnosti%20niso%20dosegljive).png)

---

### 15. Pregled skupin in chata (administrator)

**Osnovni tok:** Administrator odpre sekcijo Skupine. Sistem prikaže seznam vseh skupin. Administrator odpre izbrano skupino in pregleda chat.

![Pregled skupin in chata (admin) osnovni](./gradivo/img/15-Pregled%20skupin%20in%20chata.png)

**Alternativni tok A1 (filtriranje pred vpogledom):** Administrator nastavi filtre (status, obdobje, št. članov). Sistem osveži seznam skupin. Administrator nato odpre izbrano skupino.

![Pregled skupin in chata (admin) A1](./gradivo/img/15-Alt%20tok%20(filtriranje).png)

**Izjemni tok E1 (podatki chata niso dosegljivi):** Sistem ne uspe naložiti podatkov chata. Prikaže opozorilo in možnost ponovnega poskusa. Administrator ponovi nalaganje in sistem prikaže chat.

![Pregled skupin in chata (admin) E1](./gradivo/img/15-Izjemni%20(podatki%20chata%20niso%20dosegljivi).png)

---

### 16. Pregled povratnih informacij (administrator)

**Osnovni tok:** Administrator odpre sekcijo Skupine, nato izbrano skupino. Sistem prikaže povprečno oceno, število oddanih ocen in seznam komentarjev.

![Pregled povratnih informacij (admin) osnovni](./gradivo/img/16-Pregled%20povratnih%20info.png)

**Alternativni tok A1 (filtriranje povratnih informacij po skupini):** Administrator uporabi filtre za določeno skupino ali obdobje. Sistem osveži prikaz povratnih informacij.

![Pregled povratnih informacij (admin) A1](./gradivo/img/16-Alt%20tok%20(filtriranje).png)

**Izjemni tok E1 (povratne informacije za skupino niso dosegljive):** Sistem ne naloži povratnih informacij. Prikaže opozorilo in možnost ponovnega nalaganja. Administrator ponovi nalaganje in sistem prikaže podatke.

![Pregled povratnih informacij (admin) E1](./gradivo/img/16-Izjemni%20(povratne%20info%20niso%20dosegljive).png)

---

### 17. Upravljanje pametne komponente

**Osnovni tok:** Administrator odpre sekcijo Pametna komponenta. Sistem prikaže ključne metrike kakovosti. Administrator po potrebi spremeni parametre algoritma. Sistem zabeleži spremembo in prikaže primerjavo metrik pred/po spremembi.

![Upravljanje pametne komponente osnovni](./gradivo/img/17-Upravljanje%20pametne%20komponente.png)

**Alternativni tok A1 (spremljanje brez spremembe parametrov):** Administrator pregleda metrike in trend po obdobjih, vendar ne spremeni parametrov. Sistem ne zabeleži spremembe nastavitev.

![Upravljanje pametne komponente A1](./gradivo/img/17-Alt%20tok%20(brez%20spremembe%20parametrov).png)

**Izjemni tok E1 (parametri so izven dovoljenih mej):** Administrator spremeni parameter z neveljavno vrednostjo. Sistem zavrne spremembo in prikaže dovoljene meje. Administrator vnese veljavno vrednost in sistem zabeleži spremembo.

![Upravljanje pametne komponente E1](./gradivo/img/17-Izjemni%20(parametri%20izven%20mej).png)

**Izjemni tok E2 (konflikt sočasnih sprememb):** Administrator spremeni parameter, medtem ko drug administrator sočasno ureja isti parameter. Sistem pri shranjevanju zazna konflikt in zahteva osvežitev. Administrator osveži podatke, ponovno odda spremembo in sistem jo zabeleži.

![Upravljanje pametne komponente E2](./gradivo/img/17-Izjemni%20(sočasne%20spremembe).png)

- Za vsak pogled zagotovite osrednji diagram (npr. postavitveni ([deployment](https://plantuml.com/deployment-diagram)), paketni ([class](https://plantuml.com/class-diagram)) diagram oz. komponentni ([component](https://plantuml.com/component-diagram)) diagram).
  - Pri predlogu upoštevajte arhitekturne in načrtovalske vzorce.
  - Priporoča se uporaba naslednjih diagramskih tehnik (ne nujno vseh):
    - **Razredni diagram** ([Class Diagram](https://plantuml.com/class-diagram), izvorna koda :bar_chart: [PlantUML](./gradivo/plantuml/RD.puml))

      ![RD](https://teaching.lavbic.net/plantuml/svg/TPDDRi8m48NtFiN8tK2heEOFQ1O8bRO7oBeR4xlWujYLROf4sxjtY0KaG3RHwFbblZVnPEuyitvRAoXVYDj8_SKigw5Ip3du8G1BLcrMrcmrNnXbBEpMqek3RYmNDcXt-Tlpz7M1AhFMx8AuLFWc-MirFRUg6eUtJ3iy4jgJjUG2Acah9GXPD7HQihqL768Ap44PDt4YvgrSRdrSm8Sop2FWmfu4UzAn9mKuhFIgfQLjBSB7GosyuImUD76H8BKV5ZYfKOBfQr8QI6c7b1N0cHTUrgAbvZsi9B1EyOR7iKwET33i7JKB0R9EWF6vnL6QzD2pmJKl3udIynZz_3pmymv_Uir_wk6FR_0dDxHfo9JTk17y-ZG62YQAi1YDxh4kqKZ12LpjR_KfzBkMUvXHWZj17uEbSH-iES75YgBV6TxZmN0ioLneZh_5Fm00)

    - **Diagram zaporedja** ([Sequence Diagram](https://plantuml.com/sequence-diagram), izvorna koda :bar_chart: [PlantUML](./gradivo/plantuml/DZ.puml))

      ![DZ](https://teaching.lavbic.net/plantuml/svg/bPDFRvj04CNlyob6xiKvL14OgYfAhVnhJvLQkN4EKIu3Z9EjOOSk2qvTzRjt5YU69kwX1v1sv_VUl9s5iyQJysrLujKjm8Cf65SYFfD7W6PjR4sEAimeNzyxQMsHIoaElIFRQ8cj7r45hwWj_JK_-lFItDjAovZhYzs8ejoBkn1NiBlipR9ItLy1-uuxQFDWF8yXvsGpqYEEYWt_QDdc_DcizB4yxlOc_NJn_kFb0Vgh3iBafYRh_rzmC2xqHy79iXP7cJLhZ2Pu_WsN4PwUzhNv7A0UR72oeAtZ0jC9KeEBLBaik9BxgUWXCjwHiPAvME-a_0UOxC14GRqIuuDX26WwygoHG5EzdMlF4wmZFFc05NifwDtqQA0MAMYcGCLAnGCLJQFPc8i1If4QjuHTGsl1JYDOQJnWo1eS4dMO3Gw9za4S79909dio6SXqQcKpFJgCFsSBwuB_hhzSFmLH_FWOhzJvE_wgPq7y-yxgLgStlRLK0Ti28D1Fyz7QJSFxCvcUbgpWaYp3k4tSpqjbowYNVSawLW6spry40PoflVw0Vm00)

    - **Diagram aktivnosti** ([Activity Diagram](https://plantuml.com/activity-diagram-beta), izvorna koda :bar_chart: [PlantUML](./gradivo/plantuml/diagram_aktivnosti.puml))

      ![DA](./gradivo/img/diagram_aktivnosti.png)

    - **Diagram stanj**

Diagrami stanj prikazujejo življenjske cikle ključnih entitet v sistemu. Za vsako pomembno entiteto smo pripravili diagram, ki opisuje dovoljena stanja, prehode med njimi in dogodke, ki te prehode sprožijo.

*Diagram stanj za uporabnika*

Uporabniški račun je lahko v štirih stanjih: **Nepotrjen** (takoj po registraciji), **Aktiven** (po uspešni verifikaciji), **Blokiran** in **Deaktiviran** (slednji dve stanji nastavi administrator). Iz nepotrjenega stanja uporabnik preide v aktivnega z odprtjem verifikacijske povezave. Administrator lahko aktivnega uporabnika blokira ali deaktivira ter ga iz teh stanj tudi vrne nazaj v aktivnega.

![Diagram stanj - Uporabnik](./gradivo/img/Uporabnik.png)

*Diagram stanj za skupino*

Skupina (predlog za srečanje) ima štiri stanja: **Predlog** (ustvarjen s strani pametne komponente), **Aktivna** (ko vsaj trije člani potrdijo udeležbo), **Zaključena** (po izvedenem srečanju) in **Razveljavljena** (če premalo članov potrdi udeležbo ali administrator odpove srečanje).

![Diagram stanj - Skupina](./gradivo/img/Skupina.png)

*Diagram stanj za člana skupine*

Vsak član skupine ima svoj status odziva: **Neodločen** (privzeto po vstopu v skupino), **Potrdil** (uporabnik je potrdil udeležbo) in **Zavrnil** (uporabnik je zavrnil udeležbo). Dokler skupina ni aktivna, lahko uporabnik svojo odločitev poljubno spreminja.

![Diagram stanj - ČlanSkupine](./gradivo/img/ČlanSkupine.png)

*Diagram stanj za prijavo neprimernega vedenja*

Prijava, ki jo odda uporabnik, ima tri stanja: **Nova** (pravkar oddana, čaka na obravnavo), **Obdelana** (administrator jo je pregledal in zaključil) in **Eskalirana** (administrator jo je posredoval v nadaljnjo obravnavo). Eskalirano prijavo nato zaključi višji administrator.

![Diagram stanj - Prijava](./gradivo/img/Prijava.png)

*Diagram stanj za verifikacijski žeton*

Verifikacijski žeton (za potrditev e-pošte ali ponastavitev gesla) je lahko **Veljaven** (ustvarjen in poslan uporabniku), **Uporabljen** (uporabnik je odprl povezavo) ali **Potekel** (uporabnik povezave ni odprl v časovni omejitvi, npr. 24 ur).

![Diagram stanj - VerifikacijskiŽeton](./gradivo/img/VerifikacijskiŽeton.png)

*Diagram stanj za parametre algoritma*

Parametri pametne komponente (uteži w1, w2, w3) imajo tri stanja: **Osnovni** (privzeti parametri ob zagonu sistema), **Spremenjeni** (administrator je spremenil parametre) in **Arhivirani** (stara verzija parametrov, shranjena v zgodovino). Arhivirani parametri se po enem letu izbrišejo.

![Diagram stanj - ParametriAlgoritma](./gradivo/img/ParametriAlgoritma.png)

*Diagram stanj za uporabniško sejo (JWT)*

Uporabniška seja ima tri stanja: **Brez seje** (uporabnik ni prijavljen), **Aktivna seja** (uporabnik je uspešno prijavljen) in **Potekla seja** (JWT žeton je potekel zaradi neaktivnosti ali izteka časa). Iz potekle seje se uporabnik vrne v stanje brez seje, ko poskusi dostopati do zaščitene strani.

![Diagram stanj - Uporabniška seja](./gradivo/img/UporabniškaSeja.png)

    - **Psevdokoda**

      > **assume** vrednost1 &subseteq; C, vrednost2 &subseteq; C  
      > **let** maxVrednost1 = max {r | (s,r) &in; vrednost1}  
      > **for** (s, r) **in** vrednost2:  
      > &nbsp;&nbsp;&nbsp;&nbsp;**if** r &le; maxVrednost1 **return false**  
      > **return true**

- Za arhitekturne elemente v diagramu dodajte katalog elementov z imenom in namenom vsakega elementa.
- Za vsak element določite enega člana ekipe (tudi, če je več članov ekipe prispevalo k elementu), ki bo njen skrbnik.

## 5 Trenutno stanje

### Cilji te iteracije

Glavni cilji te iteracije so bili: vzpostavitev podatkovne baze, razvoj celotnega backenda z REST API-jem ter implementacija ključnih delov Angular frontenda (registracija, prijava, nadzorna plošča, potrjevanje srečanj, urejanje profila, chat).

### Kaj deluje?

- Registracija, ki sestoji iz treh korakov in vsebuje potrditev preko maila

![Prvi korak registracije](gradivo/img/kajDelujeRegistracija1.png)

![Drugi korak registracije](gradivo/img/kajDelujeRegistracija2.png)

![Tretji korak registracije](gradivo/img/kajDelujeRegistracija3.png)

![Potrditev računa](gradivo/img/kajDelujeRegistracijaPotrditev.png)

- Prijava v račun

![Prijava v račun](gradivo/img/kajDelujeLogin.png)

- Dashboard, ki poišče in prikaže predloge za skupine z največjo verjetnostjo ujemanja

![Dashboard](gradivo/img/kajDelujeDashboard.png)

- Možnost urejanja profila

![Urejanje profila](gradivo/img/kajDelujeUrediProfil.png)

- Potrjevanje srečanj in prikaz le-teh

![Potrjena srečanja](gradivo/img/kajDelujePotrjenaSrecanja.png)

- Pogovor (chat) znotraj potrjenega srečanja

![chat](gradivo/img/kajDelujeChat.png)

### Blokovni diagram trenutnega sistema

![Blokovni diagram](./gradivo/img/blockDiagram.png 'Blokovni diagram')

**Blokovni diagram sistema** (izvorna koda [PlantUML](./gradivo/plantuml/BlockDiagram.puml))

Diagram prikazuje trenutno arhitekturo sistema za spontana družabna srečanja. Uporabniki do aplikacije dostopajo prek Angular uporabniškega vmesnika, ki omogoča registracijo, prijavo, urejanje profila, pregled predlogov srečanj, chat in administratorski pregled. Zahteve se pošiljajo na backend, implementiran z Node.js in Express, kjer se izvajajo avtentikacija, upravljanje uporabnikov, predlogi srečanj, chat, ocene, prijave in administracija. Aplikacijski nivo komunicira z MongoDB podatkovno plastjo, ki vsebuje kolekcije users, meetings, messages, ratings, reports, contacts in analytics.
Sistem uporablja tudi zunanje storitve, predvsem e-poštni servis za verifikacijo računa in ponastavitev gesla ter geokodirni API za pretvorbo lokacije v koordinate.

### Testi
V tej iteraciji smo izvedli predvsem ročno funkcionalno testiranje, integracijsko testiranje med frontendom in backendom ter testiranje z ročno pripravljenimi testnimi podatki v MongoDB.
Ročno testiranje smo izvajali tako, da smo aplikacijo uporabljali kot končni uporabniki in preverjali, ali se posamezni uporabniški tokovi izvedejo pravilno. Pri tem smo preizkušali tako pravilne vnose kot tudi neveljavne podatke in robne primere.
V okviru unit testiranja smo preverjali manjše, izolirane funkcije za generiranje testnih podatkov. Testi so se osredotočali na to, ali posamezna funkcija vrne podatke v pričakovani strukturi in z vrednostmi, ki ustrezajo pravilom podatkovnega modela.

### Število vrstic kode

- Število vrstic (demo aplikacija): 2500
- Število vrstic kode naše aplikacije do tega trenutka: okrog 15000

## 6 Vodenje projekta

### Dnevnik sprememb (dopolnitev od zadnjega poročila)

| Datum | Motivacija | Opis spremembe | Posledica |
|-------|------------|----------------|------------|
| 6. 4. 2026 | Prvo testiranje z naročniki | Izdelali smo prve testne zaslonske maske (wireframe-i osnovnih tokov: registracija, vnos profila, prikaz predlogov) in jih posredovali naročnikom v pregled. | Uskladitev prioritet in zmanjšanje obsega na MVP. |
| 8. 4. 2026 | Tehnična odločitev | Potrjena je uporaba tehnologij: Node.js, MongoDB, Angular. | Ekipa lahko začne s pripravo razvojnega okolja in osnovnih ogrodij. |
| 10. 4. 2026 | Poenostavitev | Opustitev zahteve po avtomatičnem iskanju v ozadju za MVP. | Uporabnik mora eksplicitno klikniti "Išči skupino". Zmanjšana kompleksnost prve faze. |
| 22. 4. 2026 | Pomanjkljiva specifikacija scoring algoritma | Med implementacijo pametne komponente smo ugotovili, da prvotna formula (Jaccard + Haversine + čas) ne deluje dobro na sintetičnih podatkih – uteži so bile poljubno izbrane. | Razširili smo definicijo algoritma: dodana je normalizacija razdalje (sigmoindna funkcija) in utež za število že izvedenih srečanj (za spodbujanje novih uporabnikov). Sprememba je podaljšala razvoj pametne komponente za 3 dni. |
| 28. 4. 2026 | Zamik pri administratorskem vmesniku | Zaradi poznega začetka kodiranja (kot je opisano v refleksiji) nismo uspeli implementirati celotnega administratorskega vmesnika do načrtovanega roka. | Administratorska plošča je v trenutni iteraciji delno implementirana (le pregled uporabnikov). Metrike algoritma in upravljanje skupin smo prestavili v naslednjo iteracijo. |
| 2. 5. 2026 | Poenostavitev glede na čas | Zaradi skupnega zamika pri integraciji in algoritmu smo se odločili začasno opustiti WebSocket (Socket.io) za chat v trenutni iteraciji. | Chat je v 2. iteraciji implementiran le kot simulacija prek REST API-ja (pošiljanje sporočil s periodičnim osveževanjem). Pravi chat v realnem času bo v 3. iteraciji. |

### Cilji za naslednjo iteracijo (4. iteracija: 25. 5. 2026 – 5. 6. 2026)

Zadnja iteracija, namenjena zaključku projekta in predaji končnega sistema. Trajanje: **12 dni**.

**Cilji 4. iteracije:**

- **Obsežno testiranje:** Izvedba sprejemnih testov z vsaj 5 realnimi uporabniki. Testiranje ključnih tokov: registracija → profil → iskanje → predlogi → chat. Odprava vseh kritičnih napak.
- **Optimizacija zmogljivosti:** Testiranje odzivnih časov pod obremenitvijo. Dodajanje indeksov v MongoDB. Zagotovitev, da iskanje skupine ne preseže 2 sekund.
- **Priprava končne dokumentacije:** Dopolnitev arhitekturne dokumentacije in diagramov. Dokončanje API dokumentacije. Priprava kratkega uporabniškega priročnika (max 2 strani).
- **Končna predaja sistema:** 5. 6. 2026 – predaja sistema (GitHub ali zip) in končnega poročila.

### Načrt za preostanek semestra

| Obdobje | Aktivnosti | Ključni mejniki |
|---------|------------|-----------------|
| 25. 5. – 28. 5. 2026 | Testiranje z realnimi uporabniki, zbiranje napak, odprava kritičnih hroščev. | Sistem brez kritičnih napak. |
| 29. 5. – 1. 6. 2026 | Optimizacija poizvedb, testiranje zmogljivosti, dodajanje indeksov. | Odziv iskanja < 2 sekundi. |
| 2. 6. – 4. 6. 2026 | Dokončanje dokumentacije (arhitektura, API, uporabniški priročnik), priprava končnega poročila. | Končana vsa dokumentacija. |
| 5. 6. 2026 | Končna predaja sistema in poročila. | zaključek projekta |

### 6.2 Projektni načrt

![Ganttov diagram](./gradivo/img/Gantt123.png)

**Ganttov diagram**


## 7 Ekipa
### Opis aktivnosti in prispevkov članov ekipe v tej iteraciji (3. iteracija)

V tej iteraciji smo se osredotočili na dejansko implementacijo sistema. Naloge smo si razdelili glede na predznanja in interese posameznikov, pri čemer je Aleks Gogić prevzel organizacijo sestankov, spremljanje rokov in komunikacijo z naročnikom (profesorjem). Ostali člani so prav tako aktivno sodelovali pri usklajevanju, dogovarjanju o terminih in medsebojni pomoči. V tej iteraciji smo organizirali štiri krajše sestanke (ob začetku, po prvem tednu, sredi in pred zaključkom iteracije) ter redno komunicirali prek skupinskega klepeta.

#### A1: Vodenje ekipe in koordinacija

V ekipi smo si naloge razdelili glede na sposobnosti, vendar je Aleks Gogić prevzel organizacijo sestankov, spremljanje rokov in komunikacijo z naročnikom (profesorjem). Ostali člani so prav tako aktivno sodelovali pri usklajevanju, dogovarjanju o terminih in medsebojni pomoči. V tej iteraciji so bili organizirani štirje krajši sestanki in redna komunikacija prek skupinskega klepeta.

- **Aleks Gogić:** 60 % – organizacija sestankov, komunikacija z naročnikom, struktura poročila, poglavji 1 in 6, refleksija, končna integracija
- **Miha Fabčič:** 10 % – sodelovanje pri usklajevanju, organizacija terminskih zapisov
- **Jakob Jesenko:** 10 % – sodelovanje pri usklajevanju, vodenje seznama nalog
- **Tim Pezdirc:** 10 % – sodelovanje pri usklajevanju, vodenje dnevnika sprememb
- **Leja Petrič:** 10 % – sodelovanje pri usklajevanju, koordinacija pri razvoju pametne komponente

#### A2: Razvoj backenda (Node.js/Express, MongoDB, JWT, e-mail)

Aktivnost vključuje vzpostavitev MongoDB podatkovne baze z dokumentnimi modeli, implementacijo REST API endpointov, JWT avtentikacijo z zaščito poti ter integracijo e-poštnega servisa (Resend) za verifikacijo računa in ponastavitev gesla.

- **Aleks Gogić:** 20 % – implementacija JWT avtentikacije, zaščita API poti, e-mail servis, končna integracija backenda
- **Miha Fabčič:** 30 % – pomoč pri postavitvi osnovne strukture, testiranje endpointov
- **Jakob Jesenko:** 30 % – vzpostavitev MongoDB baze in modelov (Uporabnik, Profil, Interes, Skupina, Sporočilo)
- **Tim Pezdirc:** 15 % – implementacija REST API endpointov za uporabnike, profile in iskanje
- **Leja Petrič:** 5 % – priprava sintetičnih podatkov za testiranje baze

#### A3: Razvoj pametne komponente (scoring algoritem)

Aktivnost vključuje implementacijo scoring funkcije za ujemanje uporabnikov (interesi, lokacija, čas) z Jaccard indeksom, Haversine formulo in časovnim prekrivanjem ter optimizacijo algoritma za hitro delovanje.

- **Leja Petrič:** 70 % – glavna implementacija pametne komponente (scoring funkcija, uteži)
- **Tim Pezdirc:** 15 % – povezava scoring funkcije z REST API-jem
- **Aleks Gogić:** 5 % – pregled in testiranje algoritma
- **Miha Fabčič:** 5 % – testiranje na sintetičnih podatkih
- **Jakob Jesenko:** 5 % – pisanje agregacijskih poizvedb za MongoDB, optimizacija

#### A4: Razvoj frontenda (Angular – registracija, prijava, nadzorna plošča)

Aktivnost vključuje implementacijo Angular frontenda: tok registracije v treh korakih, prijavo z JWT ter uporabniško nadzorno ploščo (dashboard) za pregled predlogov skupin in profila.

- **Miha Fabčič:** 50 % – implementacija registracije v treh korakih, prijava, povezava z backend API-jem
- **Tim Pezdirc:** 20 % – implementacija nadzorne plošče uporabnika (pregled predlogov skupin in profila)
- **Aleks Gogić:** 10 % – pomoč pri integraciji JWT žetonov s frontendom
- **Jakob Jesenko:** 10 % – implementacija urejanja profila in ponastavitve gesla
- **Leja Petrič:** 10 % – testiranje uporabniškega toka

#### A5: Razvoj administratorskega vmesnika

Aktivnost vključuje implementacijo administratorske plošče za pregled uporabnikov, skupin in metrik algoritma.

- **Tim Pezdirc:** 20 % – implementacija nadzorne plošče administratorja (pregled uporabnikov, skupin, metrik)
- **Miha Fabčič:** 20 % – pomoč pri implementaciji administratorskih funkcionalnosti
- **Aleks Gogić:** 20 % – pomoč pri zaščiti administratorskih poti z JWT
- **Jakob Jesenko:** 20 % – povezava administratorskega vmesnika s podatkovnimi modeli
- **Leja Petrič:** 20 % – testiranje administratorskih funkcionalnosti

#### A6: Pisanje poročila (2. poročilo o stanju – "Izvedljiv sistem")

Aktivnost vključuje pisanje, urejanje, oblikovanje in končno integracijo celotnega poročila o stanju sistema. Pisanje je potekalo vzporedno z razvojem v zadnjem tednu iteracije.

- **Aleks Gogić:** 60 % – struktura, uvod, vodenje projekta, refleksija, končna integracija
- **Miha Fabčič:** 10 % – opis sistema (frontend, chat, kontakt), testi
- **Jakob Jesenko:** 10 % – opis sistema (baza, backend, urejanje profila), nefunkcionalne zahteve, diagrami
- **Tim Pezdirc:** 10 % – trenutno stanje, dnevnik sprememb, API specifikacija, nadzorni plošči
- **Leja Petrič:** 10 % – pametna komponenta, krmilniki, cilji, potrebe naročnika

### Preglednica vlog za 3. iteracijo (povprečni prispevki)

| Aktivnost | Aleks Gogić | Miha Fabčič | Jakob Jesenko | Tim Pezdirc | Leja Petrič |
|-----------|-------------|-------------|---------------|-------------|--------------|
| A1: Vodenje ekipe in koordinacija | 60 % | 10 % | 10 % | 10 % | 10 % |
| A2: Razvoj backenda (MongoDB, API, JWT, e-mail) | 20 % | 30 % | 30 % | 15 % | 5 % |
| A3: Razvoj pametne komponente (scoring) | 5 % | 5 % | 5 % | 15 % | 70 % |
| A4: Razvoj frontenda (Angular) | 10 % | 50 % | 10 % | 20 % | 10 % |
| A5: Razvoj administratorskega vmesnika | 20 % | 20 % | 20 % | 20 % | 20 % |
| A6: Pisanje poročila | 60 % | 10 % | 10 % | 10 % | 10 % |
| **Povprečni prispevek** | **20 %** | **20 %** | **20 %** | **20 %** | **20 %** |

### Povzetek vlog (usklajeno s seznamom elementov in skrbnikov)

| Član ekipe | Ključne odgovornosti (elementi iz poglavja 4) |
|------------|------------------------------------------------|
| **Aleks Gogić** | Vodenje ekipe, organizacija sestankov, komunikacija z naročnikom, struktura poročila, poglavji 1 in 6, refleksija, končna integracija, avtentikacija (JWT), e-mail servis (Resend) |
| **Miha Fabčič** | Sodelovanje pri usklajevanju, chat (REST simulacija), kontakt (feedback), implementacija registracije in prijave v Angularju, testiranje |
| **Jakob Jesenko** | Sodelovanje pri usklajevanju, urejanje profila, ponastavitev gesla, MongoDB baza in modeli, agregacijske poizvedbe, diagrami, nefunkcionalne zahteve |
| **Tim Pezdirc** | Sodelovanje pri usklajevanju, nadzorna plošča uporabnika, nadzorna plošča administratorja, REST API endpointi, dnevnik sprememb, API specifikacija |
| **Leja Petrič** | Sodelovanje pri usklajevanju, pametna komponenta (scoring), krmilniki, sintetični podatki, cilji, potrebe naročnika |

### Opombe k prispevkom

Kljub temu da so bili prispevki pri posameznih aktivnostih različni (nekdo je več delal na backendu, drugi na pametni komponenti, tretji na frontendu), je **povprečni prispevek vseh članov ekipe enak – 20 %**. Razlike so posledica različnih predznanj in interesov, vendar smo si med seboj pomagali, usklajevali in pokrivali manjkajoča področja. Aleks Gogić je prevzel nekoliko več organizacijskih in koordinacijskih nalog ter pisanja poročila, medtem ko so ostali člani več prispevali k specifičnim tehničnim področjem. Skupaj smo dosegli vse zastavljene cilje iteracije.



## 9 Refleksija

### Kaj je šlo po pričakovanjih?

Sodelovanje in komunikacija v ekipi sta delovali dobro. Redno smo komunicirali prek skupinskega klepeta in se uspešno organizirali za štiri krajše sestanke (ob začetku, po prvem tednu, sredi in pred zaključkom iteracije). Delitev na področja (backend, frontend, pametna komponenta) se je izkazala za učinkovito.

Hitro smo uskladili, da je treba dokumentacijo pisati vzporedno z razvojem, ne šele pred njim.

Vse ključne funkcionalnosti (avtentikacija, registracija, prijava, nadzorna plošča) smo uspešno implementirali do konca iteracije.

### Kaj ni šlo po pričakovanjih?

Glavna težava je bil zamik pri implementaciji administratorskega vmesnika in chata. Zaradi poznega začetka kodiranja nismo uspeli implementirati WebSocket chata, ampak le simulacijo prek REST API-ja. Prav tako administratorska plošča ni povsem dokončana (manjkajo metrike algoritma).

Druga težava je bila pomanjkljiva specifikacija scoring algoritma, kar je povzročilo 3 dni zamika pri razvoju pametne komponente.

### Kakšne težave so se pojavile pri ciljih, ki jih niste dosegli?

- **Nedokončan administratorski vmesnik:** Metrike algoritma in upravljanje skupin nista bila implementirana do načrtovanega roka.
- **Chat v realnem času:** WebSocket (Socket.io) ni bil implementiran, uporabili smo simulacijo prek REST API-ja.
- **Zamik pri integraciji:** CORS napake in napačne URL poti so povzročile 2 dni zamika pri povezavi backenda in frontenda.

### Kako nameravate premagati te težave?

- **Za nedokončan administratorski vmesnik in chat:** V naslednji (4.) iteraciji bomo prioritizirali dokončanje teh funkcionalnosti takoj na začetku.
- **Za zamik pri integraciji:** V naslednji iteraciji bomo najprej vzpostavili testno okolje in preverili povezavo med backendom in frontendom, preden začnemo z razvojem novih funkcij.

### Kaj boste naredili drugače v naslednji iteraciji?

- **Zgodnejše testiranje integracije:** Že na začetku iteracije bomo preverili CORS nastavitve in okoljske spremenljivke.
- **Prioritizacija nedokončanih funkcionalnosti:** Takoj na začetku 4. iteracije bomo dokončali administratorski vmesnik in WebSocket chat.
- **Rednejši kratki sestanki:** Ohranili bomo 10-minutne online sestanke 2-krat tedensko za spremljanje napredka.
- **Dnevno spremljanje napredka kodiranja:** Vsak dan bomo na kratkem sestanku preverili, kaj je bilo narejeno in kaj so ovire.
