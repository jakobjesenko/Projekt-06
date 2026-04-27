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

![Kontekstni diagram](./gradivo/img/kontekstni_diagram_01.png 'Kontekstni diagram')

**Opis zunanjih interakcij sistema:**

Sistem komunicira s tremi zunanjimi entitetami:

1. **Geokodirni API** (npr. OpenStreetMap Nominatim): Ob vnosu lokacije v profilu sistem pošlje besedilni niz zunanjemu servisu, ki vrne standardizirane geografske koordinate. Koordinate se shranijo v MongoDB in pri vsakem klicu algoritma za oblikovanje skupin uporabijo za izračun geografske razdalje po Haversine formuli. Ob nedosegljivosti zunanjega servisa sistem prikaže napako in omogoča ponovni vnos.

2. **E-poštni servis** (SMTP prek Resenda): Sistem pošlje verifikacijsko e-pošto ob registraciji in e-pošto za ponastavitev gesla ob zahtevi. Prek tega kanala se prenašajo izključno sistemska obvestila; vsebina skupinskih chatov in osebni podatki se ne prenašajo. Ob nedosegljivosti servisa sistem zabeleži napako v dnevnik in obvesti uporabnika.

3. **Spletni brskalnik (odjemalec)**: Vsi uporabniki (gostje, registrirani uporabniki, administratorji) dostopajo do sistema prek spletnega brskalnika. Komunikacija med Angular SPA in backendom poteka prek HTTPS za REST API klice ter prek WSS (WebSocket Secure) za skupinski chat v realnem času.

Znotraj meja sistema so vse komponente: Angular frontend, Node.js/Express REST API, Socket.io strežnik, MongoDB podatkovna baza in pametna komponenta (algoritem za oblikovanje skupin).

### 4.2 Osrednji arhitekturni pogledi

- Za vsak pogled zagotovite osrednji diagram (npr. postavitveni ([deployment](https://plantuml.com/deployment-diagram)), paketni ([class](https://plantuml.com/class-diagram)) diagram oz. komponentni ([component](https://plantuml.com/component-diagram)) diagram).

  - Pri predlogu upoštevajte arhitekturne in načrtovalske vzorce.
  - Priporoča se uporaba naslednjih diagramskih tehnik (ne nujno vseh):

    - **Razredni diagram** ([Class Diagram](https://plantuml.com/class-diagram), izvorna koda :bar_chart: [PlantUML](./gradivo/plantuml/RD.puml))

      ![RD](https://teaching.lavbic.net/plantuml/svg/TPDDRi8m48NtFiN8tK2heEOFQ1O8bRO7oBeR4xlWujYLROf4sxjtY0KaG3RHwFbblZVnPEuyitvRAoXVYDj8_SKigw5Ip3du8G1BLcrMrcmrNnXbBEpMqek3RYmNDcXt-Tlpz7M1AhFMx8AuLFWc-MirFRUg6eUtJ3iy4jgJjUG2Acah9GXPD7HQihqL768Ap44PDt4YvgrSRdrSm8Sop2FWmfu4UzAn9mKuhFIgfQLjBSB7GosyuImUD76H8BKV5ZYfKOBfQr8QI6c7b1N0cHTUrgAbvZsi9B1EyOR7iKwET33i7JKB0R9EWF6vnL6QzD2pmJKl3udIynZz_3pmymv_Uir_wk6FR_0dDxHfo9JTk17y-ZG62YQAi1YDxh4kqKZ12LpjR_KfzBkMUvXHWZj17uEbSH-iES75YgBV6TxZmN0ioLneZh_5Fm00)

    - **Diagram zaporedja** ([Sequence Diagram](https://plantuml.com/sequence-diagram), izvorna koda :bar_chart: [PlantUML](./gradivo/plantuml/DZ.puml))

      ![DZ](https://teaching.lavbic.net/plantuml/svg/bPDFRvj04CNlyob6xiKvL14OgYfAhVnhJvLQkN4EKIu3Z9EjOOSk2qvTzRjt5YU69kwX1v1sv_VUl9s5iyQJysrLujKjm8Cf65SYFfD7W6PjR4sEAimeNzyxQMsHIoaElIFRQ8cj7r45hwWj_JK_-lFItDjAovZhYzs8ejoBkn1NiBlipR9ItLy1-uuxQFDWF8yXvsGpqYEEYWt_QDdc_DcizB4yxlOc_NJn_kFb0Vgh3iBafYRh_rzmC2xqHy79iXP7cJLhZ2Pu_WsN4PwUzhNv7A0UR72oeAtZ0jC9KeEBLBaik9BxgUWXCjwHiPAvME-a_0UOxC14GRqIuuDX26WwygoHG5EzdMlF4wmZFFc05NifwDtqQA0MAMYcGCLAnGCLJQFPc8i1If4QjuHTGsl1JYDOQJnWo1eS4dMO3Gw9za4S79909dio6SXqQcKpFJgCFsSBwuB_hhzSFmLH_FWOhzJvE_wgPq7y-yxgLgStlRLK0Ti28D1Fyz7QJSFxCvcUbgpWaYp3k4tSpqjbowYNVSawLW6spry40PoflVw0Vm00)

    - **Diagram aktivnosti** ([Activity Diagram](https://plantuml.com/activity-diagram-beta), izvorna koda :bar_chart: [PlantUML](./gradivo/plantuml/DA.puml))

      ![DA](https://teaching.lavbic.net/plantuml/svg/VL5DJyCm3BtxLqJY0gTfV4Y8JcDbWpCI_06lyRhGrAaIbpAX_NVSRaWH1mwnvFTU_9wJLHACqhVUR4g0r3ZkC69hBEsmz_9ENr9wLtDBBARIGZ5JRR5gwXXwjbNm8Hg9o4afrMMgj4SR1iUrsQ5Fb35LOEl41NwJWoTZ7RQA02pIs2y1At6VJWuRX_Me_mQJUQudps7lX1JtZkc4NDozFDq_hnN36CCmtShvhTSHYXtrd2t_qHnXCJl7WUcn029rX68UoaRZSKXYveLgi_xwJtzJm9Xxm6WpzBRu7QLBwFwNhw4E7sR-U3LQXGvWHMprStu0)

    - **Diagram stanj** ([State Diagram](https://plantuml.com/state-diagram), izvorna koda :bar_chart: [PlantUML](./gradivo/plantuml/DS.puml))

      ![DS](https://teaching.lavbic.net/plantuml/svg/NP91Ri8m44NtFiK8TfMG6Zkqm09HABs0kwkw66ANXYHsvJYYKjMxTuABIRoneZVFyx-bR5gFpdTD3S-IiROgpHSwRE20HNLqjZEgiBLru1sQbaRQ-86bz0TsjN_Lt_wfBe-ceJ4KT6WtiD0vUzvTrXngsZiOKRhNyCC0jZ4mcEVFqkkUMwUq2smwVzakzZkYic-TmltrxXNzqeik0HFopKb3DW5iGMPCPYjGTWLO5UK98Kj57aJE91-98XL540MJOYJEKp4FOivaFewcxBUxTvYj-rvK36Rz9uy2Zqn4Hbj4wZrGrzHxZDwDBIBB8rjIgz3WrkkU_KDgnzX66qL_oHy0)

    - **Psevdokoda**

      > **assume** vrednost1 &subseteq; C, vrednost2 &subseteq; C  
      > **let** maxVrednost1 = max {r | (s,r) &in; vrednost1}  
      > **for** (s, r) **in** vrednost2:  
      > &nbsp;&nbsp;&nbsp;&nbsp;**if** r &le; maxVrednost1 **return false**  
      > **return true**

- Za arhitekturne elemente v diagramu dodajte katalog elementov z imenom in namenom vsakega elementa.
- Za vsak element določite enega člana ekipe (tudi, če je več članov ekipe prispevalo k elementu), ki bo njen skrbnik.

## 5 Trenutno stanje

- Kakšni dodatni cilji te iteracije, poleg tega, kar je že navedeno v [uvodu](#1-uvod)?
  - Kaj deluje? Vključite posnetke zaslona.
  - Kakšni izzivi?
  - Uporabite blokovni diagram za razlago trenutnega sistema.
- Katere teste ste izvedli?
- Koliko vrstic kode ste napisali (skupno do tega trenutka)?

## 6 Vodenje projekta

_Nadaljujte z vzdrževanjem **dnevnika sprememb**. Dodaje vse nove spremembe v projektu, kjer vključite datum, opis, motivacijo in posledico vsake spremembe._

- Prikažite dnevnik sprememb do tega trenutka.
  - Kakšni so cilji za naslednjo iteracijo?
  - Kakšen je načrt za preostanek semestra?

### 6.2 Projektni načrt

- Posodobljen Ganttov diagram in graf PERT.

## 7 Ekipa

- Kakšne so bile vloge v ekipi za to iteracijo?
  - Kaj je prispeval vsak član ekipe?
  - Navedite grobo oceno prispevka posameznega člana ekipe v odstotkih.

## 9 Refleksija

- Kaj je šlo po pričakovanjih?
  - Kaj ni šlo po pričakovanjih?
  - Kakšne težave so se pojavile pri ciljih, ki jih niste dosegli?
  - Kako nameravate premagati te težave?
  - Kaj boste naredili drugače v naslednji iteraciji?
