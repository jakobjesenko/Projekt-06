# :orange_square: Osnutek sistema (1. poročilo o stanju)

| [:arrow_backward:](01_Predlog_projekta.md) Prejšnji dokument |                       Trenutni dokument                       | Naslednji dokument [:arrow_forward:](03_Izvedljiv_sistem_2_porocilo_o_stanju.md) |
| :----------------------------------------------------------- | :-----------------------------------------------------------: | -------------------------------------------------------------------------------: |
| :yellow_square: **Predlog projekta**                         | :orange_square: **Osnutek sistema**<br>(1. poročilo o stanju) |                    :green_square: **Izvedljiv sistem**<br>(2. poročilo o stanju) |

![Terminski načrt](https://teaching.lavbic.net/plantuml/svg/dPRFJkCm4CRlVWeB3h2LKXhdpw9LXH2mI6XN0gtsHCLXshZ1JMfNjbkMhdW4tee7st6QXZOD3LhrqauztpVpct6KSsD1snIajVJWDzTJ8Kqcg8ItLsqF2EaR-vppCrASk1AGQfZIluHIAwOy5v8NFoZzYLylLQuqFHmpzocYrqhQLHJpdZ7quZB1P6NM1OooLAkvJCfSVZgEnabTCRg-EFr-MQQ3rkffrtNhp5Jat5XLLVS_FgDS6Pvy9D3OP2xIHrjr-aBw9oKzWapb31oxOKt9Qf06_-BIagD7aN0wLieErH-IWqpda79gSZBJGbepWfpJ9ywp_1abmSvr0iy8X9V54eEosn7MOx7N2xrUJ8Mf1zdNdM3azVoc8Di8bj70yrUYhWya9IGzJ7eSniEwwqS7K3TiES2Y3mwGEwqcV6HfiS26hX8OraJ8e5yaVAlcSNQF-ymjpwXOBc02SW9qXe9JRe4U-t6NTR_qJugaimVw2BCPbuQ2tL8zsb5jCEfqVi4omPjX-O8kgCdcCzolJWTTgEK9bni-OEZWod-WEHXi8A8uEjCeURCS2WrO-r8iO8yMszAY89Cr7Mp5MHqPoYKEqFEetwLOeuQHG1QUXz0wdJj4agiKqI3Qp3ghifgYaEF0sKfHjmtMjlwgXnrZveoB01dS9WcKzD4AAgzj9nn9i7SaRld8u1vIjS1BjAEsgko-1dUdi62J26iWSclatAsD4SRowMU1H1MGiCLtZGEdCLDQlRsA7AXoP-LalkqLTyEzHDnjUoVIA5XIOIrKeaqgGGELc-K2UK_4ekHInn8sOuahBASjnciih1rBs8tsOd7Fc7SiR0-Me0LBl8abRC3oGyctL-dkgIl-axlYixRR4zUfP8KFT-jUzR9bnQ9MA2nwXzAWLo89Mv3uh6Ao-zn277pK-C0Dkl7Uyjpz9kGSTOlNZdy0 "Terminski načrt")

Namen 1. poročila o stanju je dvojni:

- ohraniti zagon projekta in
- zagotoviti funkcionalne zahteve v obliki uporabniških zgodb.

Ustrezno zajeta množica primerov uporabe zagotavlja pregled nad sistemom. Pri tem uporabniški cilji zagotavljajo pregled, osnovni tokovi pa opisujejo želeno funkcionalnost.

1. poročilo o stanju uvaja odstavek z refleksijo, kjer ekipe analizirajo kaj je šlo dobro in kaj ne. Ekipe se čez semester pogosto izboljšajo pri spremljanju procesov in komunikaciji.

> **Opomba**: Izogibajte se podvajanju informacij.

Za izdelavo diagramov uporabite orodje [**PlantUML**](https://plantuml.com/) in v poročilo vključite izvorno kodo diagrama v jeziku PlantUML (v mapi [`gradivo`](gradivo)), sliko diagrama pa vključite s povezavo (in ne preko neposredne vključitve binarne datoteke) preko storitve <https://teaching.lavbic.net/plantuml>, kot prikazujejo primeri vključenih diagram v tej predlogi poročila.

## :page_with_curl: Sistem za spontana družabna srečanja – združi ljudi s skupnimi interesi v tvoji bližini

## :information_desk_person: Ime ekipe: 06. skupina | Člani ekipe: Miha Fabčič, Aleks Gogić, Jakob Jesenko, Leja Petrič, Tim Pezdirc

## 1 Uvod

V prvi iteraciji je ekipa pripravila predlog projekta in validirala osnovno smer razvoja sistema za samodejno oblikovanje manjših skupin uporabnikov (3-5 oseb) na podlagi interesov, lokacije in časovne razpoložljivosti.

V tej iteraciji je cilj priprava osnutka sistema, ki je vsebinsko usklajen s povratnimi informacijami iz zagovora ter pripravi dovolj natančno podlago za implementacijo in podrobno specifikacijo primerov uporabe v nadaljevanju.

### 1.2 Poudarki

V nadaljevanju so povzeti ključni poudarki te iteracije, od načrtovanih aktivnosti do dejansko doseženih rezultatov.

- Kakšen je bil načrt za to iteracijo?
  - Nadgraditi predlog projekta v osnutek sistema za poglavja 1-3.
  - Uskladiti besedilo s povratnimi informacijami iz zagovora.
  - Jasneje povezati potrebe naročnika s cilji projekta.
  - Pripraviti podlago za podrobno razdelavo poglavja 3.1 (primeri uporabe).
  - V specifikacijo vključiti dogovore glede uporabniških mask in funkcionalnosti (chat, prikaz članov skupine, lokacijska pomoč).
  - Dodati nadzor kakovosti delovanja pametne komponente preko administratorskega pogleda in uporabniških ocen.

Pred zaključkom poglavja spodaj povzemamo še, kaj je ekipa v tej iteraciji dejansko dosegla.

- Kaj je ekipa dosegla?
  - Pripravljen je osnutek uvodnih vsebin in usmeritev za nadaljnjo specifikacijo.
  - Potrebe naročnika so bolj jasno povzete v obliki želene uporabniške izkušnje.
  - Cilji projekta so zapisani tako, da neposredno naslavljajo težave naročnika.
  - Evidentirane so ključne spremembe po zagovoru, ki bodo odražene tudi v predlogu projekta.
  - Dopolnjene so funkcionalne zahteve za pregled članov predlagane skupine in integriran chat po potrditvi skupine.
  - Dodane so zahteve za spremljanje kakovosti algoritma (administratorski nadzor + uporabniška povratna informacija).
  - Dopolnjen je tok registracije v treh korakih in potrditvi računa prek e-pošte.
  - Dopolnjen je opis administratorske nadzorne plošče (uporabniki, obvestila, skupine, pametna komponenta).

### 1.3 Spremembe

V tej iteraciji smo povzeli večje spremembe in usmeritve glede na predlog projekta:

| Datum | Motivacija | Opis spremembe | Posledica |
|-------|------------|----------------|-----------|
| 27. 3. 2026 | Povratne informacije iz zagovora (realnejši načrt in jasnost obsega) | V osnutku smo označili, da bo COCOMO načrt v predlogu projekta prilagojen. | Finančna in časovna ocena bo v predlogu projekta bolj realna in usklajena z MVP. |
| 27. 3. 2026 | Potreba po bolj natančni razlagi jedrne inovacije sistema | V osnutku smo označili, da bo v predlogu projekta dodatno izboljšan opis pametne komponente za oblikovanje skupin. | V naslednji verziji predloga bo jasneje, kako sistem uporablja kriterije interesov, lokacije in časovne razpoložljivosti. |
| 27. 3. 2026 | Potreba po konsistentni projektni dokumentaciji | Evidentirali smo, da bomo dnevnik sprememb in seznam tveganj v predlogu projekta dopolnili po zaključku trenutnega osnutka. | Dokumentacija bo poenotena med predlogom projekta in poročili o stanju. |
| 30. 3. 2026 | Dodatna povratna informacija profesorja na predlagane funkcionalnosti | V osnutek smo vključili odločitev, da je integriran chat po potrditvi skupine prednostna funkcionalnost, ter da uporabnik vidi člane predlagane skupine pred potrditvijo. | Uporabniški tok je bolj skladen s pričakovano izkušnjo in zmanjša potrebo po zunanjih kanalih komunikacije. |
| 30. 3. 2026 | Dodatna zahteva po spremljanju učinkovitosti pametne komponente | Dopolnili smo administratorske funkcije z nadzorno ploščo za kakovost matching algoritma in z možnostjo operativnega ukrepanja ob poslabšanju metrik. | Kakovost delovanja pametne komponente je merljiva in obvladljiva tudi po uvedbi sistema. |

## 2 Potrebe naročnika

Primarni naročnik so končni uporabniki (mladi odrasli v urbanih okoljih), ki želijo hitro in enostavno najti manjšo skupino ljudi za spontano druženje brez dolgotrajnega ročnega usklajevanja.

V nadaljevanju je povzeta želena splošna izkušnja naročnika, ki predstavlja temelj funkcionalnih in nefunkcionalnih zahtev sistema.

- da uporabnik z minimalnim vložkom (interesi, približna lokacija, razpoložljivost) hitro dobi kakovostne predloge skupin;
- da so predlogi smiselni, ker upoštevajo ujemanje interesov, geografsko bližino in časovno usklajenost;
- da je postopek pregleden in varen, brez razkrivanja nepotrebnih osebnih podatkov;
- da lahko uporabnik enostavno potrdi ali zavrne predlog in sistem prilagodi svoje naslednje predloge;
- da sistem po aktivnosti omogoča kratko povratno informacijo, s katero se izboljšuje kakovost prihodnjih predlogov.
- da uporabnik pred potrditvijo vidi osnovni pregled članov predlagane skupine;
- da je komunikacija po potrditvi skupine podprta z integriranim chatom znotraj aplikacije.
- da ima uporabnik po prijavi enotno nadzorno ploščo (profil, status iskanja, predlogi skupin, pretekla srečanja);
- da je postopek registracije razdeljen na 3 jasne korake in potrjen prek e-poštnega verifikacijskega linka.

Odprte odločitve za naslednjo iteracijo (označeno za uskladitev):
- Interese bomo v MVP modelirali kot: `oznake (tagi)` ali `drevesna struktura (kategorije-podkategorije)`.
- Lokacijski vnos bo v MVP vključeval: `ročni vnos + autocomplete` ali le `ročni vnos`; geolokacija/reverse geocoding ostane potencialna nadgradnja.

Sekundarni deležniki (lokalna skupnost in ponudniki prostorov za srečanja) pričakujejo predvsem večjo socialno povezanost in strukturiran, varen način organizacije srečanj.

Administratorski naročnik (operativni vidik) pričakuje:
- centraliziran pregled uporabnikov, obvestil in generiranih skupin;
- možnost ukrepanja nad uporabniškimi računi (blokada/deblokada, aktivacija/deaktivacija);
- spremljanje kakovosti delovanja pametne komponente in pravočasno ukrepanje ob poslabšanju.

## 3 Cilji projekta

Projekt naslavlja naslednje ključne težave naročnika:

- organizacija spontanih srečanj je trenutno počasna in pogosto nepregledna;
- težko je hkrati najti ljudi s podobnimi interesi, bližnjo lokacijo in skupnim prostim terminom;
- obstoječe platforme večinoma ne podpirajo samodejnega oblikovanja manjših, kompatibilnih skupin.

Spodaj so povzete ključne koristi, ki jih bo projekt prinesel naročniku in končnim uporabnikom.

- hitrejše oblikovanje skupin in manj organizacijskega bremena za uporabnika;
- večja verjetnost uspešnega srečanja zaradi bolj kompatibilne sestave skupin;
- bolj preprost in prilagodljiv proces (uporabnik lahko sproti spreminja preference);
- bolj strukturirano in varnejše okolje za spoznavanje novih ljudi;
- podlaga za merjenje kakovosti predlogov in iterativno izboljševanje sistema.
- enotno komunikacijsko okolje po potrditvi skupine (integriran chat);
- operativni nadzor nad kakovostjo pametne komponente preko administratorskih metrik in opozoril.


### 3.1 Primeri uporabe

V tem poglavju so primeri uporabe podani v obliki, ki neposredno podpira nadaljnjo analizo, razvoj MVP in pripravo diagrama primerov uporabe v naslednji iteraciji.

#### 3.1.1 Funkcionalne zahteve

Funkcionalne zahteve so razdeljene glede na uporabniške vloge in ključne procese, ki so opredeljeni v predlogu projekta ter uporabniških zgodbah.

##### 3.1.1.1 Funkcionalne zahteve - uporabnik

Za primarnega uporabnika sistem podpira celoten tok od ustvarjanja profila do povratne informacije po srečanju.

1. **Avtentikacija in profil**
  1. Sistem mora omogočiti registracijo novega uporabnika.
  2. Registracija mora biti izvedena v treh korakih (osnovni podatki -> interesi -> lokacija in čas).
  3. Sistem mora po registraciji poslati povezavo za potrditev računa na e-poštni naslov.
  4. Sistem mora omogočiti prijavo uporabnika.
  5. Sistem mora omogočiti posodabljanje profila (osebni podatki, interesi, lokacija, časovna razpoložljivost).
  6. Sistem mora omogočiti zahtevo za ponastavitev gesla (pozabljeno geslo) prek e-pošte.
  7. Sistem mora omogočiti nastavitev novega gesla prek veljavnega enkratnega povezovalnega žetona.
  8. Sistem mora omogočiti odjavo uporabnika.
2. **Iskanje in prikaz predlogov skupin**
  1. Sistem mora omogočiti, da prijavljen uporabnik eksplicitno sproži iskanje skupine.
  2. Sistem mora na zahtevo uporabnika izračunati in prikazati predloge skupin.
  3. Sistem mora prikazati ključne podatke predloga (skupni interesi, okvirna lokacija, predlagan termin).
  4. Sistem mora uporabniku omogočiti pregled članov posamezne predlagane skupine pred potrditvijo.
3. **Upravljanje udeležbe**
  1. Sistem mora omogočiti potrditev udeležbe v predlagani skupini.
  2. Sistem mora omogočiti zavrnitev predloga skupine.
  3. Ob potrditvi mora sistem obvestiti ostale člane predlagane skupine (obvestilo je v vidu oznake barve člana v skupini zelena/rdeča).
  4. Po potrditvi skupine mora sistem odpreti skupinski komunikacijski kanal (integriran chat).
  5. Ob zavrnitvi predlog ne izgine, temveč ostane na seznamu in ga je mogoče kasneje ponovno potrditi.
  6. Sistem mora uporabniku omogočiti vstop v chat potrjene skupine in pošiljanje sporočil.
4. **Povratne informacije**
  1. Sistem mora po srečanju omogočiti oddajo kratke ocene in komentarja.
  2. Sistem mora shraniti povratne informacije za nadaljnjo analizo kakovosti predlogov.
5. **Varnost in prijava neprimernega vedenja**
  1. Sistem mora omogočiti oddajo prijave neprimernega vedenja.
  2. Sistem mora potrditi prejem prijave.
6. **Informacijske strani in kontakt**
  1. Sistem mora iz noge strani (footer) omogočiti dostop do strani: pogoji uporabe, GDPR, pogosta vprašanja, kontakt.
  2. Sistem mora omogočiti oddajo kontaktnega sporočila prek strani "Kontakt".

##### 3.1.1.2 Funkcionalne zahteve - administrator

Administratorska vloga pokriva upravljanje varnosti in osnovni nadzor nad stanjem sistema.

1. **Upravljanje prijav neprimernega vedenja**
  1. Administrator mora imeti pregled nad oddanimi prijavami.
  2. Administrator mora imeti možnost označiti prijavo kot obravnavano.
  3. Administrator mora imeti možnost izvesti ukrep (opozorilo, začasna omejitev, odstranitev uporabnika).
2. **Osnovni pregled delovanja sistema**
  1. Administrator mora imeti vpogled v osnovne podatke o uporabi sistema (predlagane skupine, potrjene skupine, oddane povratne informacije).
3. **Upravljanje uporabnikov**
  1. Administrator mora imeti seznam uporabnikov s paginacijo.
  2. Administrator mora videti osnovne podatke uporabnika (ime, priimek, uporabniško ime, e-pošta).
  3. Administrator mora imeti možnost blokirati/deblokirati uporabnika.
  4. Administrator mora imeti možnost aktivirati/deaktivirati uporabnika.
4. **Obvestila in vprašanja uporabnikov**
  1. Administrator mora imeti pregled vseh obvestil (prijave, vprašanja, povratna sporočila) s podatkom pošiljatelja.
  2. Administrator mora imeti možnost odpreti podrobnosti posameznega obvestila.
5. **Pregled generiranih skupin**
  1. Administrator mora imeti pregled vseh ustvarjenih skupin in članov skupine.
  2. Administrator mora videti stanje odzivov (potrjeno/zavrnjeno) za posamezno skupino.
  3. Administrator mora imeti razdelitev skupin na izvedene in neizvedene.
  4. **[TODO]** Določiti natančno poslovno pravilo, kdaj se skupina označi kot izvedena (trenutni predlog: vsaj 2 potrditvi do časa srečanja).
  5. Administrator mora imeti moderatorski vpogled v vsebino chata posamezne skupine.
6. **Nadzor kakovosti pametne komponente**
  1. Administrator mora imeti vpogled v ključne metrike kakovosti ujemanja (npr. delež potrjenih predlogov, povprečna ocena predlaganih skupin, delež izvedenih srečanj).
  2. Administrator mora imeti možnost označiti poslabšanje kakovosti in sprožiti operativni pregled algoritma.
  3. Administrator mora imeti možnost upravljati osnovne parametre algoritma (uteži `w1`, `w2`, `w3`) skladno z dogovorjenim postopkom ekipe.
  4. Sistem mora omogočiti primerjavo metrik pred in po spremembi parametrov.
  5. **[TODO]** Določiti nabor metrik, pragove opozoril in postopek odobritve sprememb parametrov.
7. **Administratorski dostop**
  1. Administratorski račun je inicialno ustvarjen neposredno v bazi podatkov in nima registracijskega toka.
  2. **[TODO]** Določiti postopek varne rotacije administratorskega gesla.

##### 3.1.1.3 Funkcionalne zahteve - pametna komponenta

Pametna komponenta predstavlja jedro MVP in mora zagotavljati ponovljiv, razložljiv izračun predlogov.

1. Sistem mora izračunati ujemanje interesov med uporabniki.
2. Sistem mora upoštevati geografsko bližino uporabnikov.
3. Sistem mora upoštevati časovno prekrivanje razpoložljivosti.
4. Sistem mora izračunati skupno oceno kompatibilnosti in razvrstiti kandidate.
5. Sistem mora vrniti vsaj en predlog skupine, kadar obstajajo kandidati, ki izpolnjujejo minimalne pogoje.
6. Sistem mora shraniti podatke o kakovosti predlaganih skupin (odziv uporabnikov in povratne ocene) za nadaljnje izboljševanje modela.
7. Sistem mora omogočiti razlago ključnih faktorjev ujemanja na ravni predloga skupine (interesi, lokacija, čas).

#### 3.1.2 Nefunkcionalne zahteve

Nefunkcionalne zahteve so razdeljene na zahteve izdelka, organizacijske zahteve in zunanje zahteve ter so vezane na metrike uporabnosti, varnosti, zanesljivosti, izvedbe, razpoložljivosti in razširljivosti.

##### 3.1.2.1 Zahteve izdelka

Zahteve izdelka določajo kakovost delovanja aplikacije z vidika uporabnika in tehnične izvedbe.

1. **Uporabnost**
  1. Učinkovitost: uporabnik mora od registracije do prvega predloga skupine praviloma priti v manj kot 5 minutah.
  2. Intuitivnost: ključni tokovi (registracija, urejanje profila, iskanje skupin, potrditev udeležbe) morajo biti razumljivi brez dodatnega usposabljanja.
  3. Zaznana delovna obremenitev: za oddajo zahteve za predlog skupine naj bo potrebnih čim manj korakov in vnosov.
2. **Varnost**
  1. Dostop do računa mora biti zaščiten z e-naslovom in geslom.
  2. Gesla morajo biti shranjena s kriptografsko varnim hash algoritmom.
  3. Prenos podatkov mora potekati prek HTTPS.
  4. Obdelava osebnih podatkov mora biti skladna z načeli minimizacije podatkov.
3. **Zanesljivost**
  1. Sistem mora zanesljivo shraniti spremembe profila, potrditev udeležbe in povratne informacije brez izgube podatkov.
  2. Ciljna vrednost uspešnih zaključkov ključnih tokov brez napak: 99%.
4. **Izvedba in vzdrževanje**
  1. Arhitektura mora omogočati nadaljnje nadgradnje pametne komponente.
  2. Sistem mora omogočati diagnostično spremljanje napak (logiranje).
  3. Sistem mora omogočati spremljanje kakovosti delovanja matching algoritma skozi čas.
  4. Ciljne vrednosti metrik kakovosti algoritma (npr. minimalni delež potrjenih predlogov): 60%.
5. **Razpoložljivost**
  1. Sistem mora biti dostopen 24/7, razen v času načrtovanih vzdrževalnih del.
  2. Maksimalni mesečni čas načrtovanega vzdrževanja: 1 dan.
6. **Razširljivost**
  1. Sistem mora omogočati dodajanje novih kriterijev ujemanja brez popolne prenove celotne aplikacije.

##### 3.1.2.2 Organizacijske zahteve

Organizacijske zahteve opredeljujejo razvojni in operativni okvir projekta.

1. Sistem mora biti razvit kot spletna aplikacija z ločenim odjemalcem in strežnikom.
2. Rešitev mora podpirati iterativni razvoj in postopno razširjanje funkcionalnosti.
3. Koda mora biti strukturirana tako, da omogoča skupinsko delo, pregled kode in testiranje ključnih modulov.
4. Uporabljene tehnologije morajo biti skladne z odločitvami ekipe (Node.js, MongoDB, Angular).

##### 3.1.2.3 Zunanje zahteve

Zunanje zahteve zajemajo omejitve in pričakovanja, ki izhajajo iz okolja sistema in zunanjih deležnikov.

1. Sistem mora omogočati integracijo z zunanjimi storitvami za geokodiranje oziroma obdelavo lokacijskih podatkov.
2. Sistem mora omogočati integracijo z mehanizmom za obvestila (npr. e-pošta).
3. Sistem mora biti skladen z veljavno zakonodajo o varstvu osebnih podatkov (GDPR).

#### 3.1.3 Specifikacija vmesnikov

Vmesniki so razdeljeni na vmesnike do zunanjih sistemov in spletni uporabniški vmesnik (forme), ki ga uporablja končni uporabnik.

##### 3.1.3.1 Vmesniki do zunanjih sistemov

Spodaj so opisani ključni zunanji API vmesniki, ki jih sistem uporablja ali jih predvideva v MVP.

###### 3.1.3.1.1 Geokodiranje lokacije prek zunanjega sistema

Sistem mora omogočiti pretvorbo uporabniško podane lokacije v standardizirano obliko za namen primerjave geografske bližine.

1. Uporabnik v profilu vnese lokacijo (npr. mesto ali območje).
2. Sistem pripravi zahtevo za zunanji geokodirni API.
3. Zahteva vsebuje:
  a. besedilni niz lokacije,
  b. jezikovne nastavitve (če so na voljo),
  c. identifikator zahteve.
4. Zunanji sistem vrne odgovor preko API.
5. Odgovor vsebuje:
  a. standardizirano ime lokacije,
  b. geografske koordinate,
  c. oznako uspešnosti obdelave.
6. Odgovor je v obliki JSON.

Primer odgovora:

```json
{
  "requestId": "geo-001",
  "status": "SUCCESS",
  "normalizedLocation": "Ljubljana, SI",
  "lat": 46.0569,
  "lng": 14.5058,
  "timestamp": "2026-03-27T18:30:00"
}
```

7. Sistem na podlagi odgovora:
  - ob uspehu shrani normalizirano lokacijo,
  - ob neuspehu uporabniku prikaže opozorilo in možnost ponovnega vnosa.


##### 3.1.3.2 Spletni vmesnik aplikacije (forme)

Spletni uporabniški vmesnik je strukturiran po maskah, ki sledijo osnovnemu uporabniškemu toku sistema.

###### 3.1.3.2.1 Maska začetne strani

Maska začetne strani uporabniku predstavi namen sistema in vstopne možnosti.

1. Uporabnik vidi kratek opis platforme.
2. Uporabnik lahko izbere registracijo ali prijavo.
3. Glava strani vsebuje logo/ime aplikacije (levo) ter gumba prijava/registracija (desno).
4. Noga strani vsebuje povezave: pogosta vprašanja, kontakt, pogoji uporabe, GDPR.

###### 3.1.3.2.2 Maska za registracijo

Maska registracije omogoča prvi vnos podatkov, potrebnih za ustvarjanje računa.

1. Sistem zahteva:
  a. ime,
  b. priimek,
  c. uporabniško ime,
  d. starost,
  e. e-naslov,
  f. geslo,
  g. potrditev gesla,
  h. potrditveno kljukico za pogoje uporabe.
2. Registracija se izvaja v treh korakih:
  a. osnovni podatki,
  b. interesi (tagi + možnost lastnega vnosa),
  c. lokacija in časovna razpoložljivost.
3. Po uspešni oddaji sistem pošlje povezavo za potrditev računa na e-naslov.
4. Uporabnik lahko račun uporablja šele po uspešni potrditvi e-pošte.
5. **[TODO]** Določiti, ali so telefonska številka, naslov in drugi kontaktni podatki del MVP ali nadgradnje.

###### 3.1.3.2.3 Maska za prijavo

Maska prijave omogoča avtentikacijo obstoječega uporabnika.

1. Sistem zahteva:
  a. e-naslov,
  b. geslo.
2. Ob uspešni prijavi sistem preusmeri uporabnika na ustrezno nadzorno ploščo glede na vlogo.
3. Administrator je po prijavi takoj preusmerjen na administratorsko nadzorno ploščo.
4. Maska mora vsebovati povezavo "Pozabljeno geslo", ki vodi na obrazec za zahtevo ponastavitve gesla.

###### 3.1.3.2.4 Maska za urejanje profila

Maska profila omogoča upravljanje preferenc za delovanje algoritma.

1. Uporabnik lahko ureja:
  a. interese,
  b. približno lokacijo,
  c. časovno razpoložljivost.
2. Sistem spremembe validira in shrani.
3. **[TODO]** Končni model interesa v obrazcu: `tagi` ali `kategorije-podkategorije`.
4. **[TODO]** Dodatne lokacijske izboljšave (autocomplete, geolokacija) opredeliti glede na obseg MVP.

###### 3.1.3.2.5 Maska za predloge skupin

Maska predlogov uporabniku prikaže predlagane skupine z razlago ključnih ujemanj.

1. Uporabnik sproži iskanje skupin.
2. Sistem prikaže predloge z osnovnimi podatki, odstotkom ujemanja in tagi interesov skupine.
3. Sistem omogoča pregled članov posamezne predlagane skupine.
4. Uporabnik lahko predlog potrdi ali zavrne.
5. Po potrditvi skupine sistem odpre integriran chat za usklajevanje podrobnosti srečanja.
6. Sistem omogoča paginacijo predlogov.
7. Sistem omogoči filtre (status, lokacija, čas, interesi).

###### 3.1.3.2.6 Maska uporabniške nadzorne plošče

Maska združuje ključne funkcije uporabnika po prijavi.

1. Leva stran prikazuje kratek profil (slika, ime, priimek, vzdevek, e-pošta), status iskanja skupine in hitra dejanja.
2. Prikazani so interesi uporabnika ter dostop do urejanja profila.
3. Prikazana so pretekla srečanja z osnovnimi podatki in dostopom do preteklih chatov.
4. Sredinski del prikazuje predlagane skupine in akcije potrdi/zavrni/chat.

###### 3.1.3.2.7 Maska administratorske nadzorne plošče

Maska omogoča operativni nadzor sistema.

1. Administratorski vmesnik uporablja levi meni (sidebar) s sekcijami: Sistem, Uporabniki, Obvestila, Skupine, Pametna komponenta.
2. Sekcija Uporabniki vsebuje tabelo uporabnikov s paginacijo in akcijami blokiraj/deblokiraj/aktiviraj/deaktiviraj.
3. Sekcija Obvestila vsebuje seznam vprašanj ter vpogled v podrobnosti.
4. Sekcija Skupine vsebuje pregled vseh ustvarjenih skupin, statusov in članov.
5. V podrobnostih skupine ima administrator vpogled v skupinski chat (moderatorski način).
6. Sekcija Pametna komponenta vsebuje metrike kakovosti in nastavitve parametrov algoritma.

###### 3.1.3.2.8 Maska za povratno informacijo

Maska povratne informacije omogoča oddajo ocene po srečanju.

1. Uporabnik poda oceno in kratek komentar.
2. Sistem shrani odgovor in potrdi uspešen vnos.

###### 3.1.3.2.9 Maska za zahtevo ponastavitve gesla

Maska omogoča začetek postopka obnovitve dostopa do računa.

1. Uporabnik vnese e-naslov računa.
2. Sistem preveri, ali račun obstaja, in pošlje povezavo za ponastavitev gesla.
3. Sistem prikaže generično potrditev zahteve (ne razkrije, ali račun obstaja).

###### 3.1.3.2.10 Maska za nastavitev novega gesla

Maska omogoča zaključek ponastavitve gesla prek e-poštne povezave.

1. Uporabnik odpre veljavno povezavo iz e-pošte.
2. Uporabnik vnese novo geslo in potrditev gesla.
3. Sistem preveri veljavnost žetona in skladnost gesel.
4. Sistem shrani novo geslo in uporabnika preusmeri na masko za prijavo.

###### 3.1.3.2.11 Maska informacijskih strani in kontakta

Maska pokriva strani, dostopne iz noge strani (footer).

1. Uporabnik lahko odpre strani pogoji uporabe, GDPR in pogosta vprašanja.
2. Uporabnik lahko na strani "Kontakt" odda sporočilo podpori.
3. Sistem po oddaji kontakta prikaže potrditev prejema sporočila.

#### 3.1.4 Slovar pojmov

V nadaljevanju je slovar ključnih izrazov, ki se uporabljajo v predlogu projekta in tem poročilu.

##### 3.1.4.1 Uporabnik

Registriran končni uporabnik aplikacije, ki upravlja svoj profil, išče skupine, sprejema ali zavrača predloge, uporablja skupinski chat ter oddaja povratne informacije.

##### 3.1.4.2 Primarni naročnik

Skupina končnih uporabnikov (mladi odrasli v urbanih okoljih), za katero se sistem razvija in katere potrebe so osnova funkcionalnih zahtev.

##### 3.1.4.3 Sekundarni deležniki

Zunanji deležniki, ki od sistema nimajo neposredne operativne vloge, imajo pa posredne koristi (npr. lokalna skupnost, ponudniki prostorov).

##### 3.1.4.4 Administrator sistema

Vloga z razširjenimi pravicami za obravnavo prijav, upravljanje uporabnikov, moderatorski vpogled v skupine/chat in spremljanje kakovosti delovanja sistema.

##### 3.1.4.5 Uporabniški profil

Strukturiran zapis o uporabniku, ki vključuje podatke za delovanje sistema (interesi, lokacija, časovna razpoložljivost) in se uporablja pri izračunu predlogov skupin.

##### 3.1.4.6 Interesi

Seznam aktivnosti oziroma tem, ki predstavljajo enega ključnih vhodov za izračun podobnosti med uporabniki.

##### 3.1.4.7 Časovna razpoložljivost

Podatki o prostih terminih uporabnika, uporabljeni za izračun časovnega prekrivanja med potencialnimi člani skupine.

##### 3.1.4.8 Geografska bližina

Mera prostorske oddaljenosti med uporabniki oziroma njihovimi približnimi lokacijami, uporabljena kot kriterij pri razvrščanju predlogov.

##### 3.1.4.9 Kompatibilnost skupine

Skupna ocena ujemanja članov skupine glede na izbrane kriterije (interesi, lokacija, časovna razpoložljivost).

##### 3.1.4.10 Predlog skupine

Rezultat delovanja pametne komponente, ki vsebuje seznam potencialnih članov, predlagan termin, okvirno lokacijo in ključne razloge za ujemanje.

##### 3.1.4.11 Potrditev udeležbe

Odločitev uporabnika, da sprejme predlog skupine in sodeluje pri srečanju; odločitev je vidna ostalim članom preko statusnega indikatorja.

##### 3.1.4.12 Zavrnitev predloga

Odločitev uporabnika, da predloga skupine ne sprejme; status predloga se posodobi brez odstranitve predloga iz zgodovine.

##### 3.1.4.13 Povratna informacija

Ocena in morebitni komentar uporabnika po srečanju, namenjena merjenju kakovosti predlogov in iterativnemu izboljševanju sistema.

##### 3.1.4.14 Prijava neprimernega vedenja

Funkcionalnost, s katero uporabnik odda prijavo neprimernega ravnanja ali vsebine v obravnavo administratorju.

##### 3.1.4.15 Pametna komponenta

Notranja komponenta sistema, ki izvaja izračun kompatibilnosti in oblikovanje predlogov skupin; v kontekstu primerov uporabe ni zunanji akter.

##### 3.1.4.16 Scoring model

Ocenjevalni model, ki združuje več kriterijev ujemanja v enotno numerično oceno za razvrščanje kandidatov in predlogov skupin.

##### 3.1.4.17 MVP

Minimalni delujoči produkt z osnovnimi funkcionalnostmi, potrebnimi za validacijo ideje in preverjanje ključnih predpostavk.

##### 3.1.4.18 REST API

Slog komunikacije med odjemalcem, strežnikom in zunanjimi sistemi prek HTTP protokola.

##### 3.1.4.19 JSON

Format za strukturirano izmenjavo podatkov med sistemi in komponentami aplikacije.

##### 3.1.4.20 GDPR

Pravni okvir varstva osebnih podatkov, ki določa pravila obdelave, hrambe in zaščite osebnih podatkov uporabnikov.

##### 3.1.4.21 Razpoložljivost sistema

Stopnja dostopnosti sistema uporabnikom v določenem časovnem obdobju, izražena z dogovorjenimi ciljnimi metrikami.

##### 3.1.4.22 Razširljivost sistema

Sposobnost sistema, da podpira nove funkcionalnosti in večji obseg uporabe brez večje prenove arhitekture.

##### 3.1.4.23 Skupinski chat

Komunikacijski kanal znotraj aplikacije, ki je na voljo članom potrjene skupine za usklajevanje podrobnosti srečanja.

##### 3.1.4.24 Verifikacijska povezava

Časovno omejena povezava, poslana na e-pošto ob registraciji, s katero uporabnik potrdi lastništvo e-naslova in aktivira račun.

##### 3.1.4.25 Ponastavitveni žeton

Enkratno uporaben, časovno omejen žeton za varno nastavitev novega gesla v postopku "Pozabljeno geslo".

##### 3.1.4.26 Status odziva

Prikaz odločitve uporabnika glede predloga skupine (potrjeno/zavrnjeno), vizualno označen z barvnim indikatorjem.

#### 3.1.5 Uporabniške vloge in zunanji akterji

Spodaj so opredeljene vloge, ki sodelujejo v primerih uporabe, skupaj z njihovo naravo (vloga ali zunanji sistem). Akter v primeru uporabe je vedno zunanja entiteta glede na obravnavani sistem.

##### 3.1.5.1 Uporabnik (vloga)

Uporabnik je primarni poslovni akter sistema.
Njegova vloga je vnos in vzdrževanje profila, sprožanje iskanja skupin, odločanje o predlogih (potrditev/zavrnitev), uporaba skupinskega chata ter oddaja povratnih informacij in prijav neprimernega vedenja.

##### 3.1.5.2 Administrator (vloga)

Administrator je operativni in nadzorni akter sistema.
Njegova vloga je obravnava prijav, upravljanje uporabniških računov, pregled skupin in moderatorski vpogled v chat ter spremljanje metrik kakovosti pametne komponente.

##### 3.1.5.3 Geokodirni API (zunanji sistem)

Geokodirni API je podporni zunanji sistem.
Njegova vloga je pretvorba uporabniško vnesene lokacije v standardizirano obliko in koordinate, ki jih sistem uporabi za ocenjevanje geografske bližine.

##### 3.1.5.4 E-poštni servis (zunanji sistem)

E-poštni servis je komunikacijski zunanji sistem.
Njegova vloga je pošiljanje verifikacijskih povezav ob registraciji in povezav/obvestil za ponastavitev gesla ter komunikacije z uporabniki.

##### 3.1.5.5 Pametna komponenta (notranja komponenta sistema)

Pametna komponenta je notranji del sistema in se v strogi UML razlagi ne šteje kot zunanji akter.
V dokumentu je navedena zaradi preglednosti odgovornosti znotraj primerov uporabe, kjer izvaja izračun ujemanja in pripravo predlogov skupin.

#### 3.1.6 Opisi primerov uporabe

V nadaljevanju so za ključne cilje naročnika podani formalizirani opisi primerov uporabe po enotni strukturi.

##### 3.1.6.1 Registrirati se

1. **Naslov**: Registrirati se
2. **Akterji**:
  - Uporabnik (vloga)
3. **Povzetek funkcionalnosti**:
  - Nov uporabnik opravi registracijo v treh korakih in potrdi račun prek e-poštne povezave.
4. **Osnovni tok**:
  1. Uporabnik odpre masko za registracijo.
  2. Uporabnik izpolni korake 1/3, 2/3 in 3/3.
  3. Sistem ustvari račun v stanju "nepotrjen" in pošlje verifikacijski e-poštni link.
  4. Uporabnik potrdi e-poštni naslov.
  5. Sistem aktivira račun.
5. **Alternativni tokovi in napake**:
  - A1: Uporabnik se med registracijo premika med koraki 1/3, 2/3 in 3/3 (naprej in nazaj) ter pred oddajo popravi podatke.
      1. Uporabnik izpolni korak 1/3 in nadaljuje na 2/3.
      2. Uporabnik izpolni korak 2/3 in nadaljuje na 3/3.
      3. Uporabnik se vrne na 2/3 ali 1/3, popravi podatke in ponovno nadaljuje do 3/3.
      4. Sistem ohrani že vnesene veljavne podatke med koraki.
      5. Uporabnik odda registracijo in nadaljuje osnovni tok.
  - A2: Uporabnik začasno prekine registracijo in jo nadaljuje v isti seji.
      1. Uporabnik zapre registracijsko masko po delnem vnosu.
      2. Uporabnik se vrne na registracijo.
      3. Sistem ponudi nadaljevanje od zadnjega uspešno zaključenega koraka.
  - A3: Uporabnik uspešno registrira račun, vendar e-pošto potrdi kasneje.
      1. Sistem račun ohrani v stanju "nepotrjen".
      2. Uporabnik kasneje odpre verifikacijsko povezavo.
      3. Sistem aktivira račun.
  - E1: E-naslov je že zaseden; sistem zahteva drug e-naslov.
  - E2: Gesli se ne ujemata; sistem zahteva ponovni vnos.
  - E3: Obvezna polja niso izpolnjena; sistem ne dovoli nadaljevanja.
  - E4: Uporabnik vnese prešibko geslo; sistem zavrne in prikaže pravila kompleksnosti.
  - E5: Verifikacijska povezava je neveljavna ali potekla; sistem omogoči ponovno pošiljanje.
  - E6: Napaka pri pošiljanju verifikacijskega e-sporočila; sistem omogoči ponovni poskus.
6. **Predpogoj**:
  - Uporabnik še nima računa v sistemu.
7. **Popogoj, posledice in učinki**:
  - Uspeh: ustvarjen in aktiviran je nov uporabniški račun.
  - Neuspeh: račun ni ustvarjen ali ostane neaktiven.
8. **Posebne zahteve**:
  - Validacija obveznih polj in varna obravnava gesla.
9. **Prioriteta (MoSCoW)**:
  - Must
10. **Sprejemni testi**:

| Primer uporabe | Funkcijski sistem | Začetno stanje | Vhod | Pričakovan izhod |
|---|---|---|---|---|
| Registrirati se | Registracija uporabnika | Uporabnik ni registriran | Veljavni podatki registracije | Ustvarjen nepotrjen račun in poslan verifikacijski e-poštni link |
| Registrirati se | Preverjanje enoličnosti e-naslova | E-naslov že obstaja | Podan obstoječ e-naslov | Obvestilo o napaki, registracija ni zaključena |

11. **Razširitev - pogostost uporabe in triggerji**:
  - Pogostost: nizka (praviloma enkrat na uporabnika).
  - Trigger: uporabnik izbere možnost registracije.

##### 3.1.6.2 Prijaviti se

1. **Naslov**: Prijaviti se
2. **Akterji**:
  - Uporabnik (vloga)
  - Administrator (vloga)
3. **Povzetek funkcionalnosti**:
  - Uporabnik ali administrator se avtenticira in je preusmerjen na ustrezno nadzorno ploščo.
4. **Osnovni tok**:
  1. Uporabnik vnese e-naslov in geslo.
  2. Sistem preveri podatke in vlogo.
  3. Sistem preusmeri na uporabniško ali administratorsko nadzorno ploščo.
5. **Alternativni tokovi in napake**:
  - A1: Uporabnik po neuspešni prijavi ponovi vnos in uspešno nadaljuje.
  - A2: Uporabnik preklopi iz registracije na prijavo in uspešno nadaljuje osnovni tok.
  - A3: Administrator se prijavi in je preusmerjen na administratorsko nadzorno ploščo.
  - A4: Uporabnik se prijavi z že aktivno sejo na drugi napravi; sistem dovoli prijavo in zabeleži nov dostop.
  - E1: Napačno geslo.
  - E2: Neobstoječ račun.
  - E3: Račun je blokiran/deaktiviran.
  - E4: Račun ni verificiran; sistem prijavo zavrne in ponudi ponovno pošiljanje verifikacije.
  - E5: Preveč zaporednih neuspešnih poskusov; sistem začasno zaklene prijavo.
  - E6: Seja ni uspešno vzpostavljena zaradi sistemske napake; sistem prikaže obvestilo in ponovni poskus.
6. **Predpogoj**:
  - Uporabnik ima ustvarjen in verificiran račun.
7. **Popogoj, posledice in učinki**:
  - Uspeh: uporabnik je prijavljen.
  - Neuspeh: uporabnik ostane neprijavljen.
8. **Posebne zahteve**:
  - Varna seja in zaščita prijavnega toka.
9. **Prioriteta (MoSCoW)**:
  - Must
10. **Sprejemni testi**:

| Primer uporabe | Funkcijski sistem | Začetno stanje | Vhod | Pričakovan izhod |
|---|---|---|---|---|
| Prijaviti se | Avtentikacija uporabnika | Uporabnik ima račun | Veljaven e-naslov in geslo | Uspešna prijava in preusmeritev |
| Prijaviti se | Avtentikacija uporabnika | Uporabnik ima račun | Napačno geslo | Obvestilo o napaki in brez prijave |

11. **Razširitev - pogostost uporabe in triggerji**:
  - Pogostost: visoka.
  - Trigger: uporabnik izbere možnost prijave.

##### 3.1.6.3 Ponastaviti geslo

1. **Naslov**: Ponastaviti geslo
2. **Akterji**:
  - Uporabnik (vloga)
3. **Povzetek funkcionalnosti**:
  - Uporabnik prek funkcionalnosti "Pozabljeno geslo" zahteva povezavo za ponastavitev, nastavi novo geslo in se nato prijavi.
4. **Osnovni tok**:
  1. Uporabnik klikne "Pozabljeno geslo".
  2. Uporabnik vnese e-naslov, sistem pošlje povezavo za ponastavitev.
  3. Uporabnik odpre povezavo in vnese novo geslo 2x.
  4. Sistem shrani novo geslo in preusmeri na prijavo.
  5. Uporabnik se prijavi.
5. **Alternativni tokovi in napake**:
  - A1: Uporabnik zahteva novo povezavo za ponastavitev, ker je prejšnja potekla.
  - A2: Uporabnik po uspešni spremembi gesla takoj nadaljuje prijavo in uspešno dostopa do sistema.
  - E1: Povezava je neveljavna ali potekla.
  - E2: Gesli se ne ujemata.
  - E3: Novo geslo ne izpolnjuje varnostnih pravil; sistem zahteva močnejše geslo.
  - E4: E-sporočilo za ponastavitev ni dostavljeno; sistem omogoči ponovno pošiljanje.
  - E5: Žeton za ponastavitev je že uporabljen; sistem zahteva nov postopek ponastavitve.
6. **Predpogoj**:
  - Uporabnik ima ustvarjen račun.
7. **Popogoj, posledice in učinki**:
  - Uspeh: geslo je uspešno spremenjeno.
  - Neuspeh: geslo ostane nespremenjeno.
8. **Posebne zahteve**:
  - Ponastavitvena povezava mora biti časovno omejena in enkratno uporabna.
9. **Prioriteta (MoSCoW)**:
  - Must
10. **Sprejemni testi**:

| Primer uporabe | Funkcijski sistem | Začetno stanje | Vhod | Pričakovan izhod |
|---|---|---|---|---|
| Ponastaviti geslo | Obnovitev dostopa | Uporabnik ima račun | Veljaven e-naslov in veljavna povezava | Geslo uspešno spremenjeno in preusmeritev na prijavo |
| Ponastaviti geslo | Obnovitev dostopa | Povezava je potekla | Poskus vnosa novega gesla | Sprememba zavrnjena, zahteva za novo ponastavitev |

11. **Razširitev - pogostost uporabe in triggerji**:
  - Pogostost: nizka.
  - Trigger: uporabnik klikne možnost "Pozabljeno geslo".

##### 3.1.6.4 Odjaviti se

1. **Naslov**: Odjaviti se
2. **Akterji**:
  - Uporabnik (vloga)
  - Administrator (vloga)
3. **Povzetek funkcionalnosti**:
  - Prijavljen uporabnik ali administrator zaključi sejo in se vrne na javni del aplikacije.
4. **Osnovni tok**:
  1. Akter izbere možnost "Odjava".
  2. Sistem prekine aktivno sejo.
  3. Sistem uporabnika preusmeri na začetno/prijavno stran.
5. **Alternativni tokovi in napake**:
  - A1: Uporabnik se odjavi zaradi časovne neaktivnosti; sistem samodejno zaključi sejo.
  - A2: Uporabnik se odjavi iz vseh aktivnih sej (če bo podprto).
  - E1: Seja je že potekla; sistem vseeno preusmeri na prijavo.
  - E2: Napaka pri validaciji seje na strežniku; sistem opozori uporabnika in ga vseeno preusmeri.
6. **Predpogoj**:
  - Akter je prijavljen.
7. **Popogoj, posledice in učinki**:
  - Uspeh: seja je zaključena.
  - Neuspeh: seja ostane aktivna in sistem prikaže obvestilo.
8. **Posebne zahteve**:
  - Brisanje/invalidacija sejne identitete (token/cookie).
9. **Prioriteta (MoSCoW)**:
  - Must
10. **Sprejemni testi**:

| Primer uporabe | Funkcijski sistem | Začetno stanje | Vhod | Pričakovan izhod |
|---|---|---|---|---|
| Odjaviti se | Upravljanje seje | Uporabnik je prijavljen | Klik na odjava | Seja zaključena, preusmeritev na prijavo |
| Odjaviti se | Upravljanje seje | Seja je že potekla | Klik na odjava | Preusmeritev na prijavo brez napake |

11. **Razširitev - pogostost uporabe in triggerji**:
  - Pogostost: visoka.
  - Trigger: uporabnik/administrator izbere možnost odjave.

##### 3.1.6.5 Posodobiti profil

1. **Naslov**: Posodobiti profil
2. **Akterji**:
  - Uporabnik (vloga)
3. **Povzetek funkcionalnosti**:
  - Uporabnik posodobi preference in/ali osnovne podatke profila.
4. **Osnovni tok**:
  1. Uporabnik odpre profil.
  2. Uporabnik spremeni želene podatke.
  3. Sistem validira in shrani spremembe.
5. **Alternativni tokovi in napake**:
  - A1: Uporabnik posodobi samo en podatek (npr. interesi) in uspešno shrani.
  - A2: Uporabnik posodobi več sklopov hkrati (interesi, lokacija, razpoložljivost).
  - A3: Uporabnik prekliče spremembe pred shranjevanjem; sistem ohrani obstoječe stanje.
  - E1: Neveljaven format podatkov; shranjevanje je zavrnjeno.
  - E2: Napaka pri shranjevanju.
  - E3: Konflikt sočasne posodobitve (več odprtih sej); sistem zahteva osvežitev podatkov.
  - E4: Lokacijski podatek ni prepoznan; sistem predlaga popravek vnosa.
6. **Predpogoj**:
  - Uporabnik je prijavljen.
7. **Popogoj, posledice in učinki**:
  - Uspeh: profil je posodobljen.
  - Neuspeh: ostanejo prejšnji podatki.
8. **Posebne zahteve**:
  - Validacija obveznih profilnih podatkov.
9. **Prioriteta (MoSCoW)**:
  - Must
10. **Sprejemni testi**:

| Primer uporabe | Funkcijski sistem | Začetno stanje | Vhod | Pričakovan izhod |
|---|---|---|---|---|
| Posodobiti profil | Upravljanje profila | Uporabnik je prijavljen | Novi podatki profila | Podatki so uspešno shranjeni |
| Posodobiti profil | Upravljanje profila | Uporabnik je prijavljen | Neveljavni podatki | Shranjevanje zavrnjeno in prikazana napaka |

11. **Razširitev - pogostost uporabe in triggerji**:
  - Pogostost: srednja.
  - Trigger: uporabnik spremeni preference ali profilne podatke.

##### 3.1.6.6 Iskati skupine

1. **Naslov**: Iskati skupine
2. **Akterji**:
  - Uporabnik (vloga)
3. **Povzetek funkcionalnosti**:
  - Prijavljen uporabnik sproži iskanje skupine; sistem zažene izračun predlogov.
4. **Osnovni tok**:
  1. Uporabnik na nadzorni plošči izbere akcijo "Išči skupino".
  2. Sistem preveri, da je profil ustrezno izpolnjen.
  3. Sistem sproži izračun predlogov.
  4. Sistem pripravi seznam predlogov za prikaz.
5. **Alternativni tokovi in napake**:
  - A1: Uporabnik sproži novo iskanje po posodobitvi profila in prejme osvežene predloge.
  - A2: Uporabnik ponovi iskanje po preteku časa in dobi drugačen nabor.
  - E1: Profil ni dovolj izpolnjen; sistem zahteva dopolnitev profila.
  - E2: Trenutno ni dovolj kandidatov.
  - E3: Pametna komponenta je začasno nedosegljiva; sistem prikaže obvestilo in omogoči ponovni poskus.
  - E4: Prekoračen čas obdelave; sistem prekine iskanje in predlaga nov poskus.
6. **Predpogoj**:
  - Uporabnik je prijavljen.
7. **Popogoj, posledice in učinki**:
  - Uspeh: uporabnik lahko dostopa do predlogov skupin.
  - Neuspeh: predlogi niso pripravljeni in sistem poda razlog.
8. **Posebne zahteve**:
  - Sistem mora jasno prikazati stanje iskanja (v teku/uspeh/napaka).
9. **Prioriteta (MoSCoW)**:
  - Must
10. **Sprejemni testi**:

| Primer uporabe | Funkcijski sistem | Začetno stanje | Vhod | Pričakovan izhod |
|---|---|---|---|---|
| Iskati skupine | Iskalni tok skupin | Uporabnik je prijavljen in profil izpolnjen | Klik na "Išči skupino" | Iskanje sproženo in pripravljeni predlogi |
| Iskati skupine | Iskalni tok skupin | Profil ni izpolnjen | Klik na "Išči skupino" | Poziv k dopolnitvi profila |

11. **Razširitev - pogostost uporabe in triggerji**:
  - Pogostost: srednja do visoka.
  - Trigger: uporabnik izbere akcijo za iskanje skupine.

##### 3.1.6.7 Prejeti predlog skupine

1. **Naslov**: Prejeti predlog skupine
2. **Akterji**:
  - Uporabnik (vloga)
  - Pametna komponenta (notranja komponenta sistema)
3. **Povzetek funkcionalnosti**:
  - Sistem prikaže izračunane predloge skupin.
4. **Osnovni tok**:
  1. Sistem pridobi kandidate iz baze.
  2. Pametna komponenta izračuna ocene ujemanja.
  3. Sistem razvrsti predloge in jih prikaže uporabniku.
5. **Alternativni tokovi in napake**:
  - A1: Sistem vrne več predlogov, uporabnik jih primerja.
  - A2: Sistem vrne točno en predlog, ki izpolnjuje minimalne kriterije.
  - A3: Sistem vrne predloge po več straneh (paginacija).
  - E1: Ni dovolj kandidatov.
  - E2: Napaka pri izračunu.
  - E3: Del podatkov za prikaz predloga manjka; sistem predlog označi kot nepopoln in ga ne ponudi za odločitev.
  - E4: Predlog je med prikazom postal neveljaven; sistem ga odstrani s seznama in osveži rezultate.
6. **Predpogoj**:
  - Uporabnik je prijavljen, profil je izpolnjen in iskanje skupin je sproženo.
7. **Popogoj, posledice in učinki**:
  - Uspeh: uporabnik vidi vsaj en predlog.
  - Neuspeh: predlog ni prikazan, podano je pojasnilo.
8. **Posebne zahteve**:
  - Ciljni odzivni čas prikaza predlogov: do 5 sekund.
9. **Prioriteta (MoSCoW)**:
  - Must
10. **Sprejemni testi**:

| Primer uporabe | Funkcijski sistem | Začetno stanje | Vhod | Pričakovan izhod |
|---|---|---|---|---|
| Prejeti predlog skupine | Algoritem ujemanja | Iskanje je sproženo | Zahteva za predloge | Prikazan vsaj en predlog skupine |
| Prejeti predlog skupine | Algoritem ujemanja | Iskanje je sproženo | Premalo kandidatov | Obvestilo, da trenutno ni ustreznih predlogov |

11. **Razširitev - pogostost uporabe in triggerji**:
  - Pogostost: srednja do visoka.
  - Trigger: uspešno sproženo iskanje skupin.

##### 3.1.6.8 Potrditi ali zavrniti udeležbo

1. **Naslov**: Potrditi ali zavrniti udeležbo
2. **Akterji**:
  - Uporabnik (vloga)
3. **Povzetek funkcionalnosti**:
  - Uporabnik potrdi ali zavrne predlog; sistem posodobi status.
4. **Osnovni tok**:
  1. Uporabnik odpre podrobnosti predloga.
  2. Uporabnik izbere potrditev ali zavrnitev.
  3. Sistem zabeleži odločitev.
  4. Ob potrditvi sistem obvesti ostale člane, tako da je uporabnik v tej skupini ustrezno obarvan zeleno ali rdeče.
5. **Alternativni tokovi in napake**:
  - A1: Uporabnik predlog zavrne; predlog ostane na seznamu za kasnejšo ponovno odločitev.
  - A2: Uporabnik potrdi udeležbo, nato pred potrditvijo ostalih članov umakne odločitev.
  - A3: Uporabnik pregleda člane skupine pred potrditvijo in nato potrdi.
  - E1: Predlog ni več aktiven.
  - E2: Uporabnik se je že odločil o tem predlogu; sistem zavrne podvojeno akcijo.
6. **Predpogoj**:
  - Uporabnik ima prikazan veljaven predlog skupine.
7. **Popogoj, posledice in učinki**:
  - Uspeh: status predloga je posodobljen.
  - Neuspeh: status ostane nespremenjen.
8. **Posebne zahteve**:
  - Dosledno beleženje sprememb statusa.
9. **Prioriteta (MoSCoW)**:
  - Must
10. **Sprejemni testi**:

| Primer uporabe | Funkcijski sistem | Začetno stanje | Vhod | Pričakovan izhod |
|---|---|---|---|---|
| Potrditi ali zavrniti udeležbo | Upravljanje predlogov skupin | Prikazan je aktiven predlog | Potrditev udeležbe | Status predloga posodobljen, oznaka ostalim članom |
| Potrditi ali zavrniti udeležbo | Upravljanje predlogov skupin | Predlog ni več aktiven | Potrditev ali zavrnitev | Sistem zahtevo zavrne in prikaže obvestilo |

11. **Razširitev - pogostost uporabe in triggerji**:
  - Pogostost: srednja.
  - Trigger: uporabnik izbere akcijo na predlogu.

##### 3.1.6.9 Dostopati do skupinskega chata (uporabnik) - popravi tle vse ce bo treba

1. **Naslov**: Dostopati do skupinskega chata (uporabnik)
2. **Akterji**:
  - Uporabnik (vloga)
3. **Povzetek funkcionalnosti**:
  - Uporabnik po potrditvi udeležbe dostopa do chata in pošilja sporočila.
4. **Osnovni tok**:
  1. Uporabnik odpre skupino.
  2. Sistem omogoči dostop do chata.
  3. Uporabnik pošlje sporočilo.
  4. Sistem sporočilo shrani in prikaže članom skupine.POPRAVI CE TREBA
5. **Alternativni tokovi in napake**:
  - A1: Uporabnik bere zgodovino sporočil brez pošiljanja novega vnosa.
  - A2: Uporabnik pošlje več zaporednih sporočil in sistem jih pravilno časovno razvrsti.
  - E1: Uporabnik ni član potrjene skupine; dostop je zavrnjen. POPRAVI CE TREBA
  - E2: Sporočilo presega dovoljeno dolžino; sistem zahteva skrajšanje.
  - E3: Začasna izguba povezave; sistem označi sporočilo kot neposlano in omogoči ponovni poizkus.
  - E4: Skupina je zaprta/arhivirana; sistem onemogoči nova sporočila.
6. **Predpogoj**:
  - Uporabnik je prijavljen in je član potrjene skupine.
7. **Popogoj, posledice in učinki**:
  - Uspeh: sporočilo je uspešno poslano.
  - Neuspeh: sporočilo ni poslano.
8. **Posebne zahteve**:
  - Prikaz časa in avtorja sporočila.
9. **Prioriteta (MoSCoW)**:
  - Must
10. **Sprejemni testi**:

| Primer uporabe | Funkcijski sistem | Začetno stanje | Vhod | Pričakovan izhod |
|---|---|---|---|---|
| Dostopati do skupinskega chata (uporabnik) | Komunikacijski modul | Uporabnik je član potrjene skupine | Vnos in pošiljanje sporočila | Sporočilo je shranjeno in prikazano članom |
| Dostopati do skupinskega chata (uporabnik) | Komunikacijski modul | Uporabnik ni član skupine | Poskus dostopa do chata | Dostop zavrnjen |

11. **Razširitev - pogostost uporabe in triggerji**:
  - Pogostost: srednja.
  - Trigger: uporabnik odpre chat potrjene skupine.

##### 3.1.6.10 Oddati povratno informacijo

1. **Naslov**: Oddati povratno informacijo
2. **Akterji**:
  - Uporabnik (vloga)
3. **Povzetek funkcionalnosti**:
  - Uporabnik po srečanju odda oceno in komentar.
4. **Osnovni tok**:
  1. Sistem prikaže poziv za oddajo povratne informacije.
  2. Uporabnik vnese oceno in komentar.
  3. Sistem preveri veljavnost in shrani povratno informacijo.
5. **Alternativni tokovi in napake**:
  - A1: Uporabnik odda le oceno brez komentarja.
  - A2: Uporabnik oddajo odloži in se vrne kasneje (znotraj dovoljenega časovnega okna).
  - E1: Obvezni podatki manjkajo.
  - E2: Uporabnik je že oddal povratno informacijo za isti dogodek; sistem zavrne podvojitev.
  - E3: Napaka pri shranjevanju; sistem uporabniku prikaže obvestilo in omogoči ponovni poskus.
6. **Predpogoj**:
  - Uporabnik je sodeloval v srečanju.
7. **Popogoj, posledice in učinki**:
  - Uspeh: povratna informacija je shranjena.
  - Neuspeh: povratna informacija ni shranjena.
8. **Posebne zahteve**:
  - Vprašalnik mora biti kratek.
9. **Prioriteta (MoSCoW)**:
  - Should
10. **Sprejemni testi**:

| Primer uporabe | Funkcijski sistem | Začetno stanje | Vhod | Pričakovan izhod |
|---|---|---|---|---|
| Oddati povratno informacijo | Modul povratnih informacij | Uporabnik ima zaključen dogodek | Ocena in komentar | Podatki so shranjeni in potrjeni |
| Oddati povratno informacijo | Modul povratnih informacij | Uporabnik ima zaključen dogodek | Manjkajoči obvezni podatki | Shranjevanje zavrnjeno in prikazana napaka |

11. **Razširitev - pogostost uporabe in triggerji**:
  - Pogostost: srednja.
  - Trigger: sistem po srečanju pošlje poziv za oddajo ocene.

##### 3.1.6.11 Prijaviti neprimerno vedenje

1. **Naslov**: Prijaviti neprimerno vedenje
2. **Akterji**:
  - Uporabnik (vloga)
  - Administrator (vloga)
3. **Povzetek funkcionalnosti**:
  - Uporabnik odda prijavo incidenta, administrator jo obravnava.
4. **Osnovni tok**:
  1. Uporabnik odda prijavo.
  2. Sistem potrdi prejem prijave.
  3. Administrator prijavo pregleda in označi kot obravnavano.
5. **Alternativni tokovi in napake**:
  - A1: Uporabnik odda prijavo z minimalnim opisom; administrator zahteva dopolnitev.
  - A2: Uporabnik odda prijavo neposredno iz pogleda skupine/chata.
  - E1: Prijava nima dovolj podatkov; sistem zahteva dopolnitev.
  - E2: Napaka pri shranjevanju prijave; sistem uporabniku prikaže obvestilo in ponovni poskus.
6. **Predpogoj**:
  - Uporabnik je prijavljen.
7. **Popogoj, posledice in učinki**:
  - Uspeh: prijava je obravnavana.
  - Neuspeh: prijava ostane odprta.
8. **Posebne zahteve**:
  - Zaupna obravnava prijav.
9. **Prioriteta (MoSCoW)**:
  - Should
10. **Sprejemni testi**:

| Primer uporabe | Funkcijski sistem | Začetno stanje | Vhod | Pričakovan izhod |
|---|---|---|---|---|
| Prijaviti neprimerno vedenje | Varnostni modul | Uporabnik je prijavljen | Oddaja prijave incidenta | Prijava shranjena in potrjena |
| Prijaviti neprimerno vedenje | Varnostni modul | Prijava je oddana | Administratorska obravnava | Prijava obravnavana, status posodobljen |

11. **Razširitev - pogostost uporabe in triggerji**:
  - Pogostost: nizka.
  - Trigger: uporabnik zazna neprimerno vedenje.

##### 3.1.6.12 Dostopati do informacijskih strani in kontakta

1. **Naslov**: Dostopati do informacijskih strani in kontakta
2. **Akterji**:
  - Uporabnik (vloga)
3. **Povzetek funkcionalnosti**:
  - Uporabnik prek footer povezav dostopa do pogojev uporabe, GDPR, pogostih vprašanj ter odda kontaktno sporočilo.
4. **Osnovni tok**:
  1. Uporabnik v footerju odpre izbrano informacijsko stran.
  2. Uporabnik na strani "Kontakt" odda sporočilo.
  3. Sistem potrdi prejem sporočila.
5. **Alternativni tokovi in napake**:
  - A1: Uporabnik le pregleda informacijske strani brez oddaje kontakta.
  - A2: Uporabnik odda kontaktno sporočilo in prejme potrditev na e-pošto (če bo podprto).
  - E1: Oddaja kontakta ne uspe.
  - E2: Kontaktni obrazec ni veljavno izpolnjen; sistem označi napake v poljih.
  - E3: Informacijska stran je začasno nedosegljiva; sistem prikaže obvestilo in ponovni poskus.
6. **Predpogoj**:
  - Uporabnik ima dostop do spletnega vmesnika.
7. **Popogoj, posledice in učinki**:
  - Uspeh: informacije so prikazane oziroma kontakt je oddan.
  - Neuspeh: kontakt ni oddan.
8. **Posebne zahteve**:
  - Strani morajo biti dostopne tudi brez prijave.
9. **Prioriteta (MoSCoW)**:
  - Should
10. **Sprejemni testi**:

| Primer uporabe | Funkcijski sistem | Začetno stanje | Vhod | Pričakovan izhod |
|---|---|---|---|---|
| Dostopati do informacijskih strani in kontakta | Informacijski modul | Uporabnik je na aplikaciji | Klik na povezavo v footerju | Odprta ustrezna informacijska stran |
| Dostopati do informacijskih strani in kontakta | Kontaktni modul | Uporabnik odpre kontakt | Oddano kontaktno sporočilo | Potrditev prejema sporočila |

11. **Razširitev - pogostost uporabe in triggerji**:
  - Pogostost: nizka.
  - Trigger: uporabnik klikne povezavo v footerju.

##### 3.1.6.13 Upravljati uporabnike (administrator)

1. **Naslov**: Upravljati uporabnike
2. **Akterji**:
  - Administrator (vloga)
3. **Povzetek funkcionalnosti**:
  - Administrator pregleduje seznam uporabnikov in izvaja ukrepe nad računi.
4. **Osnovni tok**:
  1. Administrator odpre sekcijo Uporabniki.
  2. Sistem prikaže paginiran seznam uporabnikov.
  3. Administrator izvede akcijo blokiraj/deblokiraj/aktiviraj/deaktiviraj.
5. **Alternativni tokovi in napake**:
  - A1: Administrator uporabi filtriranje/iskanje uporabnikov in nato izvede akcijo.
  - A2: Administrator izvede serijsko akcijo nad več uporabniki (če bo podprto).
  - E1: Administrator nima ustreznih pravic.
  - E2: Uporabnik medtem ne obstaja več ali je bil že spremenjen; sistem osveži seznam.
  - E3: Akcija ni dovoljena za izbran status računa; sistem zavrne spremembo in poda razlog.
6. **Predpogoj**:
  - Administrator je prijavljen.
7. **Popogoj, posledice in učinki**:
  - Uspeh: status uporabnika je posodobljen.
  - Neuspeh: status ostane nespremenjen.
8. **Posebne zahteve**:
  - Revizijska sled administrativnih akcij.
9. **Prioriteta (MoSCoW)**:
  - Must
10. **Sprejemni testi**:

| Primer uporabe | Funkcijski sistem | Začetno stanje | Vhod | Pričakovan izhod |
|---|---|---|---|---|
| Upravljati uporabnike | Administratorski modul uporabnikov | Administrator je prijavljen | Akcija blokiraj/deblokiraj/aktiviraj/deaktiviraj | Status uporabnika uspešno posodobljen |
| Upravljati uporabnike | Administratorski modul uporabnikov | Administrator brez pravic | Poskus akcije | Akcija zavrnjena |

11. **Razširitev - pogostost uporabe in triggerji**:
  - Pogostost: srednja.
  - Trigger: administrator odpre sekcijo Uporabniki.

##### 3.1.6.14 Pregledati obvestila in prijave (administrator)

1. **Naslov**: Pregledati obvestila in prijave
2. **Akterji**:
  - Administrator (vloga)
3. **Povzetek funkcionalnosti**:
  - Administrator pregleda prijave, vprašanja in povratna sporočila uporabnikov.
4. **Osnovni tok**:
  1. Administrator odpre sekcijo Obvestila.
  2. Sistem prikaže seznam obvestil.
  3. Administrator odpre podrobnosti in označi obvestilo kot obdelano.
5. **Alternativni tokovi in napake**:
  - A1: Administrator obvestilo označi kot obdelano brez nadaljnjih ukrepov.
  - A2: Administrator obvestilo eskalira v dodatno obravnavo.
  - E1: Podrobnosti obvestila niso dosegljive.
  - E2: Obvestilo je medtem že obdelano v drugi administratorski seji; sistem osveži status.
  - E3: Napaka pri shranjevanju spremembe statusa obvestila.
6. **Predpogoj**:
  - Administrator je prijavljen.
7. **Popogoj, posledice in učinki**:
  - Uspeh: obvestilo je obravnavano.
  - Neuspeh: obvestilo ostane odprto.
8. **Posebne zahteve**:
  - Zaupna obravnava občutljivih vsebin.
9. **Prioriteta (MoSCoW)**:
  - Should
10. **Sprejemni testi**:

| Primer uporabe | Funkcijski sistem | Začetno stanje | Vhod | Pričakovan izhod |
|---|---|---|---|---|
| Pregledati obvestila in prijave (administrator) | Administratorski modul obvestil | Administrator je prijavljen | Odprtje obvestila | Prikazane podrobnosti obvestila |
| Pregledati obvestila in prijave (administrator) | Administratorski modul obvestil | Administrator je prijavljen | Označitev obvestila kot obdelano | Status obvestila posodobljen |

11. **Razširitev - pogostost uporabe in triggerji**:
  - Pogostost: srednja.
  - Trigger: administrator odpre sekcijo Obvestila.

##### 3.1.6.15 Pregledati skupine in chat (administrator)

1. **Naslov**: Pregledati skupine in chat
2. **Akterji**:
  - Administrator (vloga)
3. **Povzetek funkcionalnosti**:
  - Administrator ima vpogled v vse ustvarjene skupine, njihove člane in vsebino skupinskega chata.
4. **Osnovni tok**:
  1. Administrator odpre sekcijo Skupine.
  2. Sistem prikaže seznam vseh ustvarjenih skupin.
  3. Administrator odpre izbrano skupino in pregled chata.
5. **Alternativni tokovi in napake**:
  - A1: Administrator filtrira skupine po statusu, obdobju ali številu članov.
  - A2: Administrator odpre samo pregled članov brez vpogleda v chat.
  - E1: Podatki chata začasno niso dosegljivi.
  - E2: Skupina je med ogledom arhivirana/izbrisana; sistem zapre podrobnosti in osveži seznam.
  - E3: Administrator nima pravice za vpogled v chat določene skupine; sistem dostop zavrne.
6. **Predpogoj**:
  - Administrator je prijavljen.
7. **Popogoj, posledice in učinki**:
  - Uspeh: vpogled je uspešno izveden.
  - Neuspeh: vpogled ni izveden.
8. **Posebne zahteve**:
  - Revizijska sled vpogledov administratorja v chat.
9. **Prioriteta (MoSCoW)**:
  - Must
10. **Sprejemni testi**:

| Primer uporabe | Funkcijski sistem | Začetno stanje | Vhod | Pričakovan izhod |
|---|---|---|---|---|
| Pregledati skupine in chat | Administratorski modul skupin | Administrator je prijavljen | Odprtje izbrane skupine | Prikazani člani, statusi in chat |
| Pregledati skupine in chat | Administratorski modul skupin | Administrator je prijavljen | Chat podatki začasno nedosegljivi | Prikazano opozorilo in možnost ponovnega poskusa |

11. **Razširitev - pogostost uporabe in triggerji**:
  - Pogostost: srednja.
  - Trigger: administrator odpre sekcijo Skupine.

##### 3.1.6.16 Spremljati kakovost pametne komponente (administrator)

1. **Naslov**: Spremljati kakovost pametne komponente
2. **Akterji**:
  - Administrator (vloga)
  - Pametna komponenta (notranja komponenta sistema)
3. **Povzetek funkcionalnosti**:
  - Administrator spremlja metrike kakovosti matching algoritma in po potrebi prilagodi parametre.
4. **Osnovni tok**:
  1. Administrator odpre sekcijo Pametna komponenta.
  2. Sistem prikaže ključne metrike kakovosti.
  3. Administrator po potrebi spremeni parametre algoritma.
  4. Sistem zabeleži spremembo in prikaže primerjavo metrik pred/po spremembi.
5. **Alternativni tokovi in napake**:
  - A1: Administrator samo spremlja metrike brez spremembe parametrov.
  - A2: Administrator spremeni parametre in nato izvede primerjavo pred/po na izbranem obdobju.
  - E1: Parametri so izven dovoljenih mej.
  - E2: Metrike niso na voljo.
  - E3: Sprememba parametrov ni odobrena po internem postopku; sistem spremembo zavrne.
  - E4: Konflikt sočasnih sprememb parametrov; sistem zahteva ponovni pregled zadnje verzije.
6. **Predpogoj**:
  - Administrator je prijavljen in ima pravice za upravljanje parametrov.
7. **Popogoj, posledice in učinki**:
  - Uspeh: sprememba je zabeležena in uporabljena v nadaljnjih izračunih.
  - Neuspeh: parametri ostanejo nespremenjeni.
8. **Posebne zahteve**:
  - Sistem vodi zgodovino sprememb parametrov.
9. **Prioriteta (MoSCoW)**:
  - Should
10. **Sprejemni testi**:

| Primer uporabe | Funkcijski sistem | Začetno stanje | Vhod | Pričakovan izhod |
|---|---|---|---|---|
| Spremljati kakovost pametne komponente (administrator) | Administratorski modul pametne komponente | Administrator je prijavljen | Pregled metrik | Prikazane aktualne metrike kakovosti |
| Spremljati kakovost pametne komponente (administrator) | Administratorski modul pametne komponente | Administrator je prijavljen | Sprememba parametrov v dovoljenih mejah | Sprememba zabeležena, prikazana primerjava pred/po |

11. **Razširitev - pogostost uporabe in triggerji**:
  - Pogostost: srednja.
  - Trigger: administrator odpre sekcijo Pametna komponenta.

#### 3.1.7 Odprta mesta za dopolnitev

Spodnja mesta so namerno puščena odprta, ker v trenutni fazi še niso dokončno določena in jih je treba dopolniti v naslednji iteraciji.

1. Natančni pragovi metrik zanesljivosti, razpoložljivosti in vzdrževanja.
2. Končne specifikacije zunanjih API (točni endpointi, avtentikacija, omejitve klicev).
3. Končni nabor administratorskih analitičnih pregledov.
4. Končno pravilo za status "izvedeno srečanje".
5. Pravila moderatorskega vpogleda administratorja v skupinske chate (namen vpogleda, hramba logov, obveščanje uporabnikov).
6. Končna odločitev o obsegu filtrov na seznamu predlaganih skupin v MVP.

## 4 Opis sistema

- Predstavite sistem in glavne izzive.

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
