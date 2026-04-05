# :orange_square: Osnutek sistema (1. poročilo o stanju)

| [:arrow_backward:](01_Predlog_projekta.md) Prejšnji dokument |                       Trenutni dokument                       | Naslednji dokument [:arrow_forward:](03_Izvedljiv_sistem_2_porocilo_o_stanju.md) |
| :----------------------------------------------------------- | :-----------------------------------------------------------: | -------------------------------------------------------------------------------: |
| :yellow_square: **Predlog projekta**                         | :orange_square: **Osnutek sistema**<br>(1. poročilo o stanju) |                    :green_square: **Izvedljiv sistem**<br>(2. poročilo o stanju) |

![Terminski načrt](https://teaching.lavbic.net/plantuml/svg/dPRFJkCm4CRlVWeB3h2LKXhdpw9LXH2mI6XN0gtsHCLXshZ1JMfNjbkMhdW4tee7st6QXZOD3LhrqauztpVpct6KSsD1snIajVJWDzTJ8Kqcg8ItLsqF2EaR-vppCrASk1AGQfZIluHIAwOy5v8NFoZzYLylLQuqFHmpzocYrqhQLHJpdZ7quZB1P6NM1OooLAkvJCfSVZgEnabTCRg-EFr-MQQ3rkffrtNhp5Jat5XLLVS_FgDS6Pvy9D3OP2xIHrjr-aBw9oKzWapb31oxOKt9Qf06_-BIagD7aN0wLieErH-IWqpda79gSZBJGbepWfpJ9ywp_1abmSvr0iy8X9V54eEosn7MOx7N2xrUJ8Mf1zdNdM3azVoc8Di8bj70yrUYhWya9IGzJ7eSniEwwqS7K3TiES2Y3mwGEwqcV6HfiS26hX8OraJ8e5yaVAlcSNQF-ymjpwXOBc02SW9qXe9JRe4U-t6NTR_qJugaimVw2BCPbuQ2tL8zsb5jCEfqVi4omPjX-O8kgCdcCzolJWTTgEK9bni-OEZWod-WEHXi8A8uEjCeURCS2WrO-r8iO8yMszAY89Cr7Mp5MHqPoYKEqFEetwLOeuQHG1QUXz0wdJj4agiKqI3Qp3ghifgYaEF0sKfHjmtMjlwgXnrZveoB01dS9WcKzD4AAgzj9nn9i7SaRld8u1vIjS1BjAEsgko-1dUdi62J26iWSclatAsD4SRowMU1H1MGiCLtZGEdCLDQlRsA7AXoP-LalkqLTyEzHDnjUoVIA5XIOIrKeaqgGGELc-K2UK_4ekHInn8sOuahBASjnciih1rBs8tsOd7Fc7SiR0-Me0LBl8abRC3oGyctL-dkgIl-axlYixRR4zUfP8KFT-jUzR9bnQ9MA2nwXzAWLo89Mv3uh6Ao-zn277pK-C0Dkl7Uyjpz9kGSTOlNZdy0 'Terminski načrt')

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

To poročilo predstavlja osnutek sistema za rešitev, ki povezuje uporabnike v manjše skupine za spontana družabna srečanja na podlagi interesov, lokacije in časovne razpoložljivosti. Dokument je namenjen prehodu iz konceptualnega predloga v izvedljivo specifikacijo za nadaljnji razvoj MVP. V njem so sistematično opredeljene potrebe naročnika, cilji projekta, ključni vmesniki in primeri uporabe, ki služijo kot osnova za implementacijo backend storitev, uporabniškega vmesnika ter pametne komponente za oblikovanje skupin. Poseben poudarek je na uporabniškem toku od prvega stika z aplikacijo (gost) do registracije, prijave, iskanja skupin, pregleda članov predloga, potrditve ali zavrnitve udeležbe, komunikacije v skupinskem chatu ter oddaje povratnih informacij. Hkrati dokument zajema tudi administratorski pogled za upravljanje uporabnikov, obvestil, skupin in spremljanje kakovosti algoritma. Namen te iteracije je bil uskladiti zasnovo s povratnimi informacijami zagovora, izboljšati strukturo zahtev in pripraviti enotno, berljivo podlago za naslednjo razvojno iteracijo. Ekipa je v tej iteraciji dosegla natančnejšo razdelavo uporabniških in administratorskih tokov, vključila vlogo gosta, jasneje opredelila hitri pregled članov predlagane skupine ter dopolnila moderatorske in nadzorne funkcionalnosti. Glavne spremembe vključujejo preoblikovan tok uporabniških mask, bolj dosledno opredeljene funkcionalne in nefunkcionalne zahteve ter izboljšano specifikacijo primerov uporabe s poudarkom na alternativnih in napakarskih tokovih.

### 1.1 Namen iteracije

Namen iteracije je priprava osnutka sistema, ki je usklajen s povratnimi informacijami zagovora in dovolj podroben za prehod v izvedbo MVP.

### 1.2 Dosežki iteracije

- pripravljena je bila pregledna specifikacija uporabniških in administratorskih tokov;
- razširjen je bil opis uporabniških mask, zunanjih API vmesnikov in vlog v sistemu;
- dopolnjeni so bili primeri uporabe, vključno s pregledom članov predloga skupine;
- vključena je bila vloga gosta z jasno omejenim naborom dovoljenih aktivnosti.

### 1.3 Glavne spremembe iteracije

- izboljšana je bila struktura in berljivost zahtev;
- natančneje je bil opredeljen tok med predlogi skupin in skupinskim chatom;
- razširjene so bile administratorske funkcije (opozorila, statusni pregled in nadzor kakovosti);
- poenotena je bila terminologija med vlogami, maskami in primeri uporabe.

## 2 Potrebe naročnika

Primarni naročnik so končni uporabniki (mladi odrasli v urbanih okoljih), ki želijo hitro in varno najti manjšo skupino za spontano druženje. Sekundarni deležniki (lokalna skupnost in ponudniki prostorov za srečanja) pričakujejo večjo socialno povezanost in strukturiran način organizacije srečanj. Operativni naročnik (administrator sistema) pričakuje nadzor nad varnostjo, uporabniki in kakovostjo delovanja pametne komponente.

### 2.1 Funkcionalne zahteve

Sistem mora podpirati celoten uporabniški tok od prvega obiska do zaključka srečanja. Gost mora imeti dostop do začetne strani, informacijskih vsebin v nogi ter možnosti registracije, prijave in začetka ponastavitve gesla. Registracija mora potekati v treh jasnih korakih (osnovni podatki, interesi v obliki "tagov", lokacija z opcijo autocomplete in časovna razpoložljivost), po oddaji pa mora sistem poslati verifikacijsko povezavo za aktivacijo računa. Prijavljen uporabnik mora lahko urejati profil, sprožiti iskanje skupin, pregledati predloge in za vsak predlog odpreti hiter pregled članov skupine pred odločitvijo.

Pri upravljanju predlogov mora sistem omogočiti potrditev ali zavrnitev udeležbe in dosledno beležiti status odziva. Status mora biti viden tudi ostalim članom skupine. Vsakemu uporabniku dodeljenemu v neko skupino mora biti v vidu te skupine omogočen dostop do skupinskega chata za usklajevanje podrobnosti srečanja. Po srečanju mora sistem podpreti oddajo kratke povratne informacije (ocena in komentar) ter shranjevanje podatkov za nadaljnjo analizo kakovosti predlogov. Sistem mora uporabniku omogočiti oddajo prijave neprimernega vedenja ter potrditi prejem prijave.

Administratorski del mora omogočati pregled in obravnavo prijav neprimernega vedenja, upravljanje uporabnikov (blokada/deblokada, aktivacija/deaktivacija, opozorilo), pregled obvestil in kontaktnih obrazcev uporabnikov, pregled skupin in moderatorski vpogled v chat. Pri uporabnikih z aktivnim opozorilom mora biti v seznamu prisotna rumena vizualna oznaka. Administrator mora imeti tudi vpogled v ključne metrike kakovosti ujemanja, možnost označitve poslabšanja ter upravljanje osnovnih parametrov algoritma v skladu z internim postopkom.

### 2.2 Nefunkcionalne zahteve

Sistem mora biti uporaben, varen, zanesljiv in pripravljen za nadgradnje. Ključni tok od registracije do prvega predloga skupine mora biti praviloma izvedljiv v manj kot petih minutah, uporabniški vmesnik pa mora omogočati intuitivno uporabo brez dodatnega usposabljanja. Varnostni minimum vključuje zaščiten dostop do računov, varno shranjevanje gesel s kriptografskim hash algoritmom, uporabo HTTPS ter obdelavo osebnih podatkov po načelu minimizacije.

Sistem mora zagotavljati zanesljivo shranjevanje ključnih dogodkov (posodobitve profila, odzivi na predloge, povratne informacije) in ciljno uspešnost zaključevanja ključnih tokov brez napak na ravni 99%. Arhitekturno mora rešitev omogočati iterativni razvoj, spremljanje napak z logiranjem in spremljanje kakovosti matching algoritma skozi čas. Ciljna vrednost osnovnega kazalnika kakovosti algoritma (npr. delež potrjenih predlogov) je najmanj 60%.

Razpoložljivost sistema mora biti 24/7, razen v času načrtovanega vzdrževanja, pri čemer največji mesečni čas načrtovanih izpadov ne sme presegati enega dne. Rešitev mora podpirati nadaljnje razširitve brez popolne prenove (npr. novi kriteriji ujemanja) ter integracijo z zunanjimi storitvami za geokodiranje in obveščanje. Celoten sistem mora ostati skladen z GDPR.

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

V tem poglavju so predstavljeni specifikacija vmesnikov, slovar pojmov, vloge in formalizirani primeri uporabe, ki podpirajo implementacijo sistema.

#### 3.1.1 Specifikacija vmesnikov

V tem delu so po vrsti opisani zunanji vmesniki in maske spletne aplikacije, ki jih uporabnik in administrator uporabljata v ključnih tokovih sistema.

##### 3.1.1.1 Vmesniki do zunanjih sistemov

Spodaj so opisani ključni zunanji API vmesniki, ki jih sistem uporablja ali jih predvideva v MVP.

###### 3.1.1.1.1 Geokodiranje lokacije prek zunanjega sistema

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

##### 3.1.1.2 Spletni vmesnik aplikacije (forme)

Spletni uporabniški vmesnik je strukturiran po maskah, ki sledijo osnovnemu toku uporabe: javna stran, registracija, prijava, ponastavitev gesla, uporabniška nadzorna plošča, skupinski chat, urejanje profila, administratorska nadzorna plošča in informacijske strani.

###### 3.1.1.2.1 Maska začetne strani

Maska začetne strani uporabniku predstavi namen sistema in vstopne možnosti.

Slika maske: ![Maska začetne strani](gradivo/img/homepage.png)

1. Uporabnik vidi kratek opis platforme v osrednjem delu strani.
2. Glava strani vsebuje logo ali ime aplikacije levo ter gumba za prijavo in registracijo desno.
3. Noga strani vsebuje povezave do pogostih vprašanj, kontakta, pogojev uporabe in GDPR.
4. Vsaka povezava v nogi vodi na ustrezno informacijsko masko.

###### 3.1.1.2.2 Maska za registracijo

Maska registracije omogoča prvi vnos podatkov, potrebnih za ustvarjanje računa.

Slike mask: ![Maska za registracijo 1/3](gradivo/img/registracija1_3.png)
![Maska za registracijo 2/3](gradivo/img/registracija2_3.png)
![Maska za registracijo 3/3](gradivo/img/registracija3_3.png)

1. Sistem zahteva:
   a. ime,
   b. priimek,
   c. uporabniško ime,
   d. starost,
   e. e-naslov,
   f. geslo,
   g. potrditev gesla,
   h. potrditveno kljukico za pogoje uporabe.
2. Registracija se izvaja v treh korakih in uporabniku prikazuje napredek 1/3, 2/3, 3/3:
   a. osnovni podatki,
   b. interesi,
   c. lokacija in časovna razpoložljivost.
3. Po uspešni oddaji sistem pošlje povezavo za potrditev računa na e-naslov.
4. Uporabnik lahko račun uporablja šele po uspešni potrditvi e-pošte.
5. Maska vedno vsebuje tudi povezavo za skok na prijavo.

###### 3.1.1.2.3 Maska za prijavo

Maska prijave omogoča avtentikacijo obstoječega uporabnika.

Slika maske: ![Maska za prijavo](gradivo/img/prijava.png)

1. Sistem zahteva:
   a. e-naslov,
   b. geslo.
2. Ob uspešni prijavi sistem preusmeri uporabnika na ustrezno nadzorno ploščo glede na vlogo.
3. Administrator je po prijavi takoj preusmerjen na administratorsko nadzorno ploščo.
4. Maska vsebuje povezavo "Pozabljeno geslo", ki vodi na obrazec za zahtevo ponastavitve gesla.
5. Maska vsebuje tudi povezavo za skok na registracijo za uporabnike brez računa.

###### 3.1.1.2.4 Maska za zahtevo ponastavitve gesla

Maska omogoča začetek postopka obnovitve dostopa do računa.

Slika maske: ![Maska za zahtevo ponastavitve gesla](gradivo/img/pozabljeno_geslo.png)

1. Uporabnik vnese e-naslov računa.
2. Sistem preveri, ali račun obstaja, in pošlje povezavo za ponastavitev gesla.
3. Sistem prikaže generično potrditev zahteve in ne razkrije, ali račun obstaja.
4. Po uspešni oddaji se uporabnik lahko vrne na prijavo.

###### 3.1.1.2.5 Maska za nastavitev novega gesla

Maska omogoča zaključek ponastavitve gesla prek e-poštne povezave.

Slika maske: ![Maska za nastavitev novega gesla](gradivo/img/ponastavitev_gesla.png)

1. Uporabnik odpre veljavno povezavo iz e-pošte.
2. Uporabnik vnese novo geslo in potrditev gesla.
3. Sistem preveri veljavnost žetona in skladnost gesel.
4. Sistem shrani novo geslo in uporabnika preusmeri na masko za prijavo.

###### 3.1.1.2.6 Maska uporabniške nadzorne plošče

Maska združuje ključne funkcije uporabnika po prijavi.

Slika maske: ![Maska uporabniške nadzorne plošče](gradivo/img/user_homepage.png)

1. Leva stran prikazuje kratek profil (slika, ime, priimek, vzdevek, e-pošta), status iskanja skupine in hitra dejanja.
2. Prikazani so interesi uporabnika ter dostop do urejanja profila.
3. Prikazana so pretekla srečanja z osnovnimi podatki in dostopom do preteklih chatov.
4. Sredinski del prikazuje predlagane skupine in akcije potrdi, zavrni in chat.

###### 3.1.1.2.7 Maska za predloge skupin

Maska prikazuje predlagane skupine in omogoča hiter pregled članov pred potrditvijo.

Slika maske: ![Maska za predloge skupin](gradivo/img/ena_skupina.png)

1. Uporabnik vidi seznam predlaganih skupin z osnovnimi podatki, odstotkom ujemanja in ključnimi razlogi za predlog.
2. Uporabnik lahko pri vsaki predlagani skupini odpre hiter pregled članov skupine.
3. Hiter pregled članov je dostopen neposredno iz posameznega predloga skupine.
4. Uporabnik lahko iz predloga nadaljuje na potrditev, zavrnitev ali dostop do chata.
5. Hiter pregled članov je ločen od skupinskega chata in v njem ni pošiljanja sporočil.

###### 3.1.1.2.8 Maska skupinskega chata

Maska prikazuje komunikacijo skupine.

Slika maske: ![Maska skupinskega chata](gradivo/img/chat.png)

1. Maska vsebuje osnovne informacije o skupini in seznam članov.
2. Uporabnik lahko pregleduje zgodovino sporočil.
3. Uporabnik lahko pošilja nova sporočila.
4. Seznam članov je prikazan informativno, brez potrebe po odpiranju njihovih podrobnosti iz chata.

###### 3.1.1.2.9 Maska za urejanje profila

Maska profila omogoča upravljanje preferenc za delovanje algoritma.

Slika maske: ![Maska za urejanje profila](gradivo/img/profile_edit.png)

1. Uporabnik lahko ureja:
   a. interese,
   b. približno lokacijo,
   c. časovno razpoložljivost.
2. Sistem spremembe validira in shrani.

###### 3.1.1.2.10 Maska za povratno informacijo

Maska povratne informacije omogoča oddajo ocene po srečanju.

Slika maske: ![Maska za povratno informacijo](gradivo/img/povratne_info.png)

1. Uporabnik poda oceno in kratek komentar.
2. Sistem shrani odgovor in potrdi uspešen vnos.

###### 3.1.1.2.11 Maska administratorske nadzorne plošče

Maska omogoča operativni nadzor sistema.

Slike mask: ![Maska administratorske nadzorne plošče(uporabniki)](gradivo/img/admin_dashboard_uporabniki.png)
![Maska administratorske nadzorne plošče(srečanja)](gradivo/img/admin_dashboard_srecanja.png)
![Maska administratorske nadzorne plošče(ocene in komentarji)](gradivo/img/admin_dashboard_ocene.png)
![Maska administratorske nadzorne plošče(pametna komponenta)](gradivo/img/admin_dashboard_pametna_komponenta.png)

1. Administratorski vmesnik uporablja navigacijski meni s sekcijami: Sistem, Uporabniki, Obvestila, Skupine, Pametna komponenta.
2. Začetni pogled prikazuje osnovne podatke in statistike delovanja sistema.
3. Sekcija Uporabniki vsebuje tabelo uporabnikov s paginacijo, iskanjem in akcijami blokiraj, deblokiraj, aktiviraj in deaktiviraj.
4. Uporabnik z aktivnim opozorilom je vizualno označen z rumeno barvo.
5. Sekcija Obvestila vsebuje seznam vprašanj, prijav in drugih sporočil ter vpogled v podrobnosti.
6. Sekcija Skupine vsebuje pregled vseh ustvarjenih skupin, statusov, članov in dostop do skupinskega chata.
7. Sekcija Pametna komponenta vsebuje metrike kakovosti in nastavitve parametrov algoritma.

###### 3.1.1.2.12 Maska informacijskih strani in kontakta

Maske pokrivajo strani, dostopne iz noge strani (footer).

Slik mask: ![Maska informacijskih strani in kontakta](gradivo/img/pogoji_uporabe.png)
![Maska informacijskih strani in kontakta](gradivo/img/pogosta_vprasanja.png)
![Maska informacijskih strani in kontakta](gradivo/img/gdpr.png)
![Maska informacijskih strani in kontakta](gradivo/img/kontaktni_obrazec.png)

1. Maska pogojev uporabe vsebuje opis pogojev uporabe sistema.
2. Maska GDPR vsebuje opis obdelave osebnih podatkov in uporabnikovih pravic.
3. Maska pogostih vprašanj vsebuje odgovore na najpogostejša vprašanja uporabnikov.
4. Maska kontakta omogoča oddajo sporočila z osnovnimi podatki, kot so ime, priimek, e-naslov, zadeva in sporočilo.
5. Sistem po oddaji kontakta prikaže potrditev prejema sporočila.

#### 3.1.2 Slovar pojmov

V nadaljevanju je slovar ključnih izrazov, ki se uporabljajo v predlogu projekta in tem poročilu.

##### 3.1.2.1 Uporabnik

Registriran končni uporabnik aplikacije, ki upravlja svoj profil, išče skupine, sprejema ali zavrača predloge, uporablja skupinski chat ter oddaja povratne informacije.

##### 3.1.2.2 Primarni naročnik

Skupina končnih uporabnikov (mladi odrasli v urbanih okoljih), za katero se sistem razvija in katere potrebe so osnova funkcionalnih zahtev.

##### 3.1.2.3 Sekundarni deležniki

Zunanji deležniki, ki od sistema nimajo neposredne operativne vloge, imajo pa posredne koristi (npr. lokalna skupnost, ponudniki prostorov).

##### 3.1.2.4 Administrator sistema

Vloga z razširjenimi pravicami za obravnavo prijav, upravljanje uporabnikov, moderatorski vpogled v skupine/chat in spremljanje kakovosti delovanja sistema.

##### 3.1.2.5 Uporabniški profil

Strukturiran zapis o uporabniku, ki vključuje podatke za delovanje sistema (interesi, lokacija, časovna razpoložljivost) in se uporablja pri izračunu predlogov skupin.

##### 3.1.2.6 Interesi

Seznam aktivnosti oziroma tem, ki predstavljajo enega ključnih vhodov za izračun podobnosti med uporabniki.

##### 3.1.2.7 Časovna razpoložljivost

Podatki o prostih terminih uporabnika, uporabljeni za izračun časovnega prekrivanja med potencialnimi člani skupine.

##### 3.1.2.8 Geografska bližina

Mera prostorske oddaljenosti med uporabniki oziroma njihovimi približnimi lokacijami, uporabljena kot kriterij pri razvrščanju predlogov.

##### 3.1.2.9 Kompatibilnost skupine

Skupna ocena ujemanja članov skupine glede na izbrane kriterije (interesi, lokacija, časovna razpoložljivost).

##### 3.1.2.10 Predlog skupine

Rezultat delovanja pametne komponente, ki vsebuje seznam potencialnih članov, predlagan termin, okvirno lokacijo in ključne razloge za ujemanje.

##### 3.1.2.11 Potrditev udeležbe

Odločitev uporabnika, da sprejme predlog skupine in sodeluje pri srečanju; odločitev je vidna ostalim članom preko statusnega indikatorja.

##### 3.1.2.12 Zavrnitev predloga

Odločitev uporabnika, da predloga skupine ne sprejme; status predloga se posodobi brez odstranitve predloga iz zgodovine.

##### 3.1.2.13 Povratna informacija

Ocena in morebitni komentar uporabnika po srečanju, namenjena merjenju kakovosti predlogov in iterativnemu izboljševanju sistema.

##### 3.1.2.14 Prijava neprimernega vedenja

Funkcionalnost, s katero uporabnik odda prijavo neprimernega ravnanja ali vsebine v obravnavo administratorju.

##### 3.1.2.15 Pametna komponenta

Notranja komponenta sistema, ki izvaja izračun kompatibilnosti in oblikovanje predlogov skupin; v kontekstu primerov uporabe ni zunanji akter.

##### 3.1.2.16 Scoring model

Ocenjevalni model, ki združuje več kriterijev ujemanja v enotno numerično oceno za razvrščanje kandidatov in predlogov skupin.

##### 3.1.2.17 MVP

Minimalni delujoči produkt z osnovnimi funkcionalnostmi, potrebnimi za validacijo ideje in preverjanje ključnih predpostavk.

##### 3.1.2.18 REST API

Slog komunikacije med odjemalcem, strežnikom in zunanjimi sistemi prek HTTP protokola.

##### 3.1.2.19 JSON

Format za strukturirano izmenjavo podatkov med sistemi in komponentami aplikacije.

##### 3.1.2.20 GDPR

Pravni okvir varstva osebnih podatkov, ki določa pravila obdelave, hrambe in zaščite osebnih podatkov uporabnikov.

##### 3.1.2.21 Razpoložljivost sistema

Stopnja dostopnosti sistema uporabnikom v določenem časovnem obdobju, izražena z dogovorjenimi ciljnimi metrikami.

##### 3.1.2.22 Razširljivost sistema

Sposobnost sistema, da podpira nove funkcionalnosti in večji obseg uporabe brez večje prenove arhitekture.

##### 3.1.2.23 Skupinski chat

Komunikacijski kanal znotraj aplikacije, ki je na voljo članom predlagane skupine za usklajevanje podrobnosti srečanja.

##### 3.1.2.24 Verifikacijska povezava

Časovno omejena povezava, poslana na e-pošto ob registraciji, s katero uporabnik potrdi lastništvo e-naslova in aktivira račun.

##### 3.1.2.25 Ponastavitveni žeton

Enkratno uporaben, časovno omejen žeton za varno nastavitev novega gesla v postopku "Pozabljeno geslo".

##### 3.1.2.26 Status odziva

Prikaz odločitve uporabnika glede predloga skupine (potrjeno/zavrnjeno), vizualno označen z barvnim indikatorjem.

#### 3.1.3 Uporabniške vloge in zunanji akterji

Spodaj so opredeljene vloge, ki sodelujejo v primerih uporabe, skupaj z njihovo naravo (vloga ali zunanji sistem). Akter v primeru uporabe je vedno zunanja entiteta glede na obravnavani sistem.

##### 3.1.3.1 Uporabnik (vloga)

Uporabnik je primarni poslovni akter sistema.
Njegova vloga je vnos in vzdrževanje profila, sprožanje iskanja skupin, odločanje o predlogih (potrditev/zavrnitev), uporaba skupinskega chata ter oddaja povratnih informacij in prijav neprimernega vedenja.

##### 3.1.3.2 Gost (vloga)

Gost je neprijavljen uporabnik sistema.
Njegova vloga je dostop do začetne strani ter informacijskih strani v nogi, možnost registracije, prijave in zahtevka za ponastavitev gesla.

##### 3.1.3.3 Administrator (vloga)

Administrator je operativni in nadzorni akter sistema.
Njegova vloga je obravnava prijav, upravljanje uporabniških računov, pregled skupin in moderatorski vpogled v chat ter spremljanje metrik kakovosti pametne komponente.

##### 3.1.3.4 Geokodirni API (zunanji sistem)

Geokodirni API je podporni zunanji sistem.
Njegova vloga je pretvorba uporabniško vnesene lokacije v standardizirano obliko in koordinate, ki jih sistem uporabi za ocenjevanje geografske bližine.

##### 3.1.3.5 E-poštni servis (zunanji sistem)

E-poštni servis je komunikacijski zunanji sistem.
Njegova vloga je pošiljanje verifikacijskih povezav ob registraciji in povezav/obvestil za ponastavitev gesla ter komunikacije z uporabniki.

##### 3.1.3.6 Pametna komponenta (notranja komponenta sistema)

Pametna komponenta je notranji del sistema in se v strogi UML razlagi ne šteje kot zunanji akter.
V dokumentu je navedena zaradi preglednosti odgovornosti znotraj primerov uporabe, kjer izvaja izračun ujemanja in pripravo predlogov skupin.

#### 3.1.4 Opisi primerov uporabe

V nadaljevanju so za ključne cilje naročnika podani formalizirani opisi primerov uporabe po enotni strukturi.

##### 3.1.4.1 Registracija

1. **Naslov**: Registracija
2. **Akterji**: Gost (vloga), Uporabnik (vloga)
3. **Povzetek funkcionalnosti**: Nov uporabnik opravi registracijo v treh korakih in aktivira račun prek e-pošte.
4. **Osnovni tok**:
   1. Gost odpre masko za registracijo.
   2. Izpolni korake 1/3, 2/3 in 3/3.
   3. Sistem validira podatke, ustvari račun v stanju "nepotrjen" in pošlje verifikacijsko povezavo.
   4. Gost odpre verifikacijsko povezavo.
   5. Sistem aktivira račun in zaključi primer uporabe.
5. **Alternativni tokovi in napake**:
   - A1: Gost popravi vnos v prejšnjem koraku.
     1. Gost odpre masko za registracijo.
     2. Izpolni korake 1/3, 2/3 in 3/3.
     3. Gost v tretjem koraku ugotovi, da je treba dopolniti prejšnji vnos.
     4. Gost se vrne na 2/3 ali 1/3 in popravi podatke.
     5. Sistem ohrani že veljavne podatke, da jih ni treba ponovno vpisovati.
     6. Gost znova nadaljuje do 3/3 in odda registracijo.
     7. Sistem validira podatke, ustvari račun v stanju "nepotrjen" in pošlje verifikacijsko povezavo.
     8. Gost odpre verifikacijsko povezavo.
     9. Sistem aktivira račun in zaključi primer uporabe.
   - E1: E-naslov je že registriran.
     1. Gost odpre masko za registracijo.
     2. Izpolni korake 1/3, 2/3 in 3/3.
     3. Gost pri oddaji vnese e-naslov, ki že obstaja v sistemu.
     4. Sistem zavrne registracijo in prikaže napako o že uporabljenem e-naslovu.
     5. Gost vnese drug e-naslov in ponovno odda obrazec.
     6. Sistem validira podatke, ustvari račun v stanju "nepotrjen" in pošlje verifikacijsko povezavo.
     7. Gost odpre verifikacijsko povezavo.
     8. Sistem aktivira račun in zaključi primer uporabe.
   - E2: Verifikacijska povezava je potekla.
     1. Gost odpre masko za registracijo.
     2. Izpolni korake 1/3, 2/3 in 3/3.
     3. Sistem validira podatke, ustvari račun v stanju "nepotrjen" in pošlje verifikacijsko povezavo.
     4. Gost odpre povezavo za potrditev računa po pretečenem roku.
     5. Sistem zavrne aktivacijo in prikaže obvestilo o neveljavni povezavi.
     6. Gost zahteva novo verifikacijsko povezavo.
     7. Sistem pošlje novo povezavo.
     8. Gost odpre novo verifikacijsko povezavo.
     9. Sistem aktivira račun in zaključi primer uporabe.
6. **Predpogoj**: Gost še nima računa v sistemu.
7. **Popogoj, posledice in učinki**: Uspeh: račun je aktiviran. Neuspeh: račun ostane neaktiven.
8. **Posebne zahteve**: Varna obravnava gesla in validacija obveznih polj.
9. **Prioriteta (MoSCoW)**: Must
10. **Sprejemni testi**:

| Primer uporabe  | Funkcijski sistem       | Začetno stanje   | Vhod                          | Pričakovan izhod                                  |
| --------------- | ----------------------- | ---------------- | ----------------------------- | ------------------------------------------------- |
| Registrirati se | Registracija uporabnika | Gost nima računa | Veljavni podatki registracije | Ustvarjen nepotrjen račun in poslana verifikacija |

11. **Razširitev - pogostost uporabe in triggerji**: Pogostost: nizka. Trigger: klik na registracijo.

##### 3.1.4.2 Prijava

1. **Naslov**: Prijava
2. **Akterji**: Gost (vloga), Uporabnik (vloga), Administrator (vloga)
3. **Povzetek funkcionalnosti**: Akter se avtenticira in je preusmerjen na ustrezen pogled.
4. **Osnovni tok**:
   1. Gost odpre masko za prijavo.
   2. Vnese e-naslov in geslo.
   3. Sistem preveri poverilnice in vlogo.
   4. Sistem vzpostavi sejo.
   5. Sistem preusmeri na uporabniško ali administratorsko nadzorno ploščo.
5. **Alternativni tokovi in napake**:
   - A1: Prijava administratorja.
     1. Gost odpre masko za prijavo.
     2. Vnese e-naslov in geslo za administratorski račun.
     3. Sistem preveri poverilnice in vlogo.
     4. Sistem prepozna administratorsko vlogo.
     5. Sistem vzpostavi sejo.
     6. Sistem preusmeri na administratorsko nadzorno ploščo.
   - E1: Napačno geslo.
     1. Gost odpre masko za prijavo.
     2. Vnese e-naslov in napačno geslo.
     3. Sistem preveri poverilnice in zavrne prijavo.
     4. Sistem poveča števec neuspelih poskusov in prikaže napako.
     5. Gost popravi geslo in ponovno odda prijavo.
     6. Sistem preveri poverilnice in vlogo.
     7. Sistem vzpostavi sejo.
     8. Sistem preusmeri na ustrezno nadzorno ploščo.
   - E2: Račun ni verificiran.
     1. Gost odpre masko za prijavo.
     2. Vnese e-naslov in geslo neverificiranega računa.
     3. Sistem preveri poverilnice in ugotovi, da račun ni verificiran.
     4. Sistem zavrne prijavo in ponudi ponovno pošiljanje verifikacije.
     5. Gost potrdi e-poštni naslov preko nove verifikacijske povezave.
     6. Gost ponovno odpre prijavno masko in vnese e-naslov ter geslo.
     7. Sistem preveri poverilnice in vlogo.
     8. Sistem vzpostavi sejo in preusmeri na ustrezno nadzorno ploščo.
6. **Predpogoj**: Račun obstaja.
7. **Popogoj, posledice in učinki**: Uspeh: aktivna seja. Neuspeh: seja ni vzpostavljena.
8. **Posebne zahteve**: Zaščita prijavnega toka in varna seja.
9. **Prioriteta (MoSCoW)**: Must
10. **Sprejemni testi**:

| Primer uporabe | Funkcijski sistem        | Začetno stanje      | Vhod                       | Pričakovan izhod                |
| -------------- | ------------------------ | ------------------- | -------------------------- | ------------------------------- |
| Prijaviti se   | Avtentikacija uporabnika | Uporabnik ima račun | Veljaven e-naslov in geslo | Uspešna prijava in preusmeritev |

11. **Razširitev - pogostost uporabe in triggerji**: Pogostost: visoka. Trigger: klik na prijavo.

##### 3.1.4.3 Ponastavitev gesla

1. **Naslov**: Ponastavitev gesla
2. **Akterji**: Gost (vloga), Uporabnik (vloga)
3. **Povzetek funkcionalnosti**: Uporabnik zahteva povezavo za ponastavitev in nastavi novo geslo.
4. **Osnovni tok**:
   1. Gost klikne možnost "Pozabljeno geslo".
   2. Vnese e-naslov računa.
   3. Sistem pošlje ponastavitveno povezavo.
   4. Gost odpre povezavo, vnese novo geslo in potrditev gesla.
   5. Sistem shrani geslo in preusmeri na prijavo.
      Razširitev: Neposredna prijava po ponastavitvi gesla : Geslo je uspešno ponastavljeno : Prijava.
5. **Alternativni tokovi in napake**:
   - A1: Takojšnja prijava po spremembi gesla.
     1. Gost klikne možnost "Pozabljeno geslo".
     2. Vnese e-naslov računa.
     3. Sistem pošlje ponastavitveno povezavo.
     4. Gost odpre povezavo, vnese novo geslo in potrditev gesla.
     5. Sistem shrani geslo in preusmeri na prijavo.
        Razširitev: Neposredna prijava po ponastavitvi gesla : Geslo je uspešno ponastavljeno : Prijava.
     6. Uporabnik takoj vnese nove poverilnice in odda prijavo.
     7. Sistem uspešno vzpostavi sejo.
   - E1: Povezava je neveljavna ali potekla.
     1. Gost klikne možnost "Pozabljeno geslo".
     2. Vnese e-naslov računa.
     3. Sistem pošlje ponastavitveno povezavo.
     4. Uporabnik odpre neveljavno ali poteklo povezavo za ponastavitev.
     5. Sistem zavrne spremembo in ponudi novo zahtevo.
     6. Uporabnik zahteva novo povezavo.
     7. Sistem pošlje novo povezavo.
     8. Uporabnik odpre novo povezavo, vnese novo geslo in potrditev gesla.
     9. Sistem shrani geslo in preusmeri na prijavo.
        Razširitev: Neposredna prijava po ponastavitvi gesla : Geslo je uspešno ponastavljeno : Prijava.
   - E2: Gesli se ne ujemata.
     1. Gost klikne možnost "Pozabljeno geslo".
     2. Vnese e-naslov računa.
     3. Sistem pošlje ponastavitveno povezavo.
     4. Gost odpre povezavo in vnese novo geslo ter potrditev gesla.
     5. Sistem zazna neujemanje gesel in zavrne oddajo.
     6. Uporabnik popravi vnos in znova odda obrazec.
     7. Sistem shrani geslo in preusmeri na prijavo.
        Razširitev: Neposredna prijava po ponastavitvi gesla : Geslo je uspešno ponastavljeno : Prijava.
6. **Predpogoj**: Uporabnik ima ustvarjen račun.
7. **Popogoj, posledice in učinki**: Uspeh: geslo je spremenjeno. Neuspeh: geslo ostane nespremenjeno.
8. **Posebne zahteve**: Časovna omejenost in enkratna uporaba žetona.
9. **Prioriteta (MoSCoW)**: Must
10. **Sprejemni testi**:

| Primer uporabe    | Funkcijski sistem | Začetno stanje      | Vhod                            | Pričakovan izhod          |
| ----------------- | ----------------- | ------------------- | ------------------------------- | ------------------------- |
| Ponastaviti geslo | Obnovitev dostopa | Uporabnik ima račun | Veljavna povezava in novo geslo | Geslo uspešno spremenjeno |

11. **Razširitev - pogostost uporabe in triggerji**: Pogostost: nizka. Trigger: klik na "Pozabljeno geslo".

##### 3.1.4.4 Odjava

1. **Naslov**: Odjava
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
   - A1: Samodejna odjava zaradi neaktivnosti.
     1. Akter je prijavljen in uporablja aplikacijo.
     2. Sistem zazna presežen čas neaktivnosti.
     3. Sistem opozori akterja o bližnjem izteku seje.
     4. Po izteku sistem invalidira sejo.
     5. Sistem akterja preusmeri na začetno/prijavno stran.
   - E1: Seja je že potekla.
     1. Akter izbere možnost "Odjava".
     2. Sistem preveri aktivno sejo in ugotovi, da je ta že potekla.
     3. Sistem ne izvaja dodatnega zaključevanja seje.
     4. Sistem vseeno izvede preusmeritev na začetno/prijavno stran.
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

| Primer uporabe | Funkcijski sistem | Začetno stanje          | Vhod           | Pričakovan izhod                         |
| -------------- | ----------------- | ----------------------- | -------------- | ---------------------------------------- |
| Odjaviti se    | Upravljanje seje  | Uporabnik je prijavljen | Klik na odjava | Seja zaključena, preusmeritev na prijavo |
| Odjaviti se    | Upravljanje seje  | Seja je že potekla      | Klik na odjava | Preusmeritev na prijavo brez napake      |

11. **Razširitev - pogostost uporabe in triggerji**:
    - Pogostost: visoka.
    - Trigger: uporabnik/administrator izbere možnost odjave.

##### 3.1.4.5 Urejanje profila

1. **Naslov**: Urejanje profila
2. **Akterji**:
   - Uporabnik (vloga)
3. **Povzetek funkcionalnosti**:
   - Uporabnik posodobi preference in/ali osnovne podatke profila.
4. **Osnovni tok**:
   1. Uporabnik odpre profil.
   2. Uporabnik spremeni želene podatke.
   3. Sistem validira in shrani spremembe.
5. **Alternativni tokovi in napake**:
   - A1: Posodobitev samo enega sklopa.
     1. Uporabnik odpre profil.
     2. Uporabnik spremeni le en sklop podatkov (npr. interese).
     3. Sistem validira spremenjeni sklop.
     4. Sistem shrani spremembo.
     5. Sistem potrdi uspeh in ostale podatke pusti nespremenjene.
   - E1: Neveljaven format podatkov.
     1. Uporabnik odpre profil in spremeni želene podatke.
     2. Uporabnik odda neveljaven podatek v enem od polj.
     3. Sistem zavrne shranjevanje in označi napačno polje.
     4. Uporabnik popravi podatek in ponovno odda spremembe.
     5. Sistem validira in shrani spremembe.
   - E2: Konflikt sočasnih sprememb.
     1. Uporabnik odpre profil in spremeni želene podatke.
     2. Uporabnik odda spremembe na zastarelem stanju profila.
     3. Sistem zazna konflikt in zahteva osvežitev.
     4. Uporabnik osveži podatke, ponovno uredi profil in odda spremembe.
     5. Sistem validira in shrani novo stanje profila.
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

| Primer uporabe    | Funkcijski sistem   | Začetno stanje          | Vhod                 | Pričakovan izhod                           |
| ----------------- | ------------------- | ----------------------- | -------------------- | ------------------------------------------ |
| Posodobiti profil | Upravljanje profila | Uporabnik je prijavljen | Novi podatki profila | Podatki so uspešno shranjeni               |
| Posodobiti profil | Upravljanje profila | Uporabnik je prijavljen | Neveljavni podatki   | Shranjevanje zavrnjeno in prikazana napaka |

11. **Razširitev - pogostost uporabe in triggerji**:
    - Pogostost: srednja.
    - Trigger: uporabnik spremeni preference ali profilne podatke.

##### 3.1.4.6 Iskanje skupin

1. **Naslov**: Iskanje skupin
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
   - A1: Ponovitev iskanja po posodobitvi profila.
     1. Uporabnik odpre nadzorno ploščo.
     2. Uporabnik izbere akcijo "Išči skupino".
     3. Sistem preveri profil in uporabnik ugotovi, da želi posodobiti preference.
     4. Uporabnik posodobi profil z novimi interesi, lokacijo ali razpoložljivostjo.
     5. Uporabnik ponovno izbere akcijo "Išči skupino".
     6. Sistem preveri, da je profil ustrezno izpolnjen.
     7. Sistem sproži izračun predlogov.
     8. Sistem pripravi in prikaže osvežen nabor predlogov.
   - E1: Profil ni dovolj izpolnjen.
     1. Uporabnik odpre nadzorno ploščo in izbere akcijo "Išči skupino".
     2. Sistem preveri profil in ugotovi manjkajoče podatke.
     3. Sistem zavrne iskanje in navede manjkajoča polja.
     4. Uporabnik dopolni profil in ponovno izbere akcijo "Išči skupino".
     5. Sistem ponovno preveri profil.
     6. Sistem sproži izračun predlogov.
     7. Sistem pripravi seznam predlogov za prikaz.
   - E2: Pametna komponenta je začasno nedosegljiva.
     1. Uporabnik izbere akcijo "Išči skupino".
     2. Sistem preveri profil in sproži izračun predlogov.
     3. Klic pametne komponente ne uspe.
     4. Sistem prikaže obvestilo in možnost ponovnega poskusa.
     5. Uporabnik ponovi zahtevo.
     6. Sistem ponovno sproži izračun predlogov.
     7. Sistem pripravi seznam predlogov za prikaz.
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

| Primer uporabe | Funkcijski sistem  | Začetno stanje                              | Vhod                   | Pričakovan izhod                          |
| -------------- | ------------------ | ------------------------------------------- | ---------------------- | ----------------------------------------- |
| Iskati skupine | Iskalni tok skupin | Uporabnik je prijavljen in profil izpolnjen | Klik na "Išči skupino" | Iskanje sproženo in pripravljeni predlogi |
| Iskati skupine | Iskalni tok skupin | Profil ni izpolnjen                         | Klik na "Išči skupino" | Poziv k dopolnitvi profila                |

11. **Razširitev - pogostost uporabe in triggerji**:
    - Pogostost: srednja do visoka.
    - Trigger: uporabnik izbere akcijo za iskanje skupine.

##### 3.1.4.7 Pregled skupin in chata

1. **Naslov**: Pregled skupin in chata
2. **Akterji**:
   - Uporabnik (vloga)
3. **Povzetek funkcionalnosti**:
   - Uporabnik odpre izbrano predlagano skupino in na istem mestu pregleda osnovne podatke skupine, člane ter skupinski chat.
4. **Osnovni tok**:
   1. Uporabnik iz seznama predlogov odpre izbrano skupino.
   2. Sistem prikaže čas srečanja, približno lokacijo in ključne razloge ujemanja.
   3. Sistem prikaže ikone oziroma kratke kartice članov skupine.
   4. Uporabnik odpre kratek pregled profila posameznega člana.
   5. Sistem prikaže osnovne podatke izbranega člana.
   6. Uporabnik odpre skupinski chat iste skupine.
   7. Sistem prikaže zgodovino sporočil in omogoči nadaljnjo komunikacijo.
5. **Alternativni tokovi in napake**:
   - A1: Pregled posameznega člana.
     1. Uporabnik iz seznama predlogov odpre izbrano skupino.
     2. Sistem prikaže čas srečanja, približno lokacijo in ključne razloge ujemanja.
     3. Uporabnik klikne ikono člana.
     4. Sistem odpre kratek profil člana.
     5. Uporabnik zapre kratek profil in se vrne na pregled skupine.
   - A2: Branje skupinskega chata brez pošiljanja sporočila.
     1. Uporabnik iz seznama predlogov odpre izbrano skupino.
     2. Sistem prikaže osnovne podatke skupine in člane.
     3. Uporabnik odpre skupinski chat.
     4. Sistem naloži zgodovino sporočil.
     5. Uporabnik pregleda vsebino in chat zapre brez novega vnosa.
     6. Sistem ohrani stanje pogovora nespremenjeno.
   - E1: Podatki skupine ali članov niso dosegljivi.
     1. Uporabnik iz seznama predlogov odpre izbrano skupino.
     2. Sistem poskuša prikazati podatke skupine in članov, vendar nalaganje ne uspe.
     3. Sistem prikaže opozorilo in možnost ponovnega nalaganja.
     4. Uporabnik ponovi nalaganje.
     5. Sistem prikaže podatke skupine in članov.
   - E2: Skupina med prikazom postane neveljavna.
     1. Uporabnik iz seznama predlogov odpre izbrano skupino.
     2. Sistem prikaže osnovne podatke skupine.
     3. Sistem zazna, da je skupina med prikazom postala neveljavna.
     4. Sistem zapre pregled skupine in osveži seznam predlogov.
     5. Uporabnik izbere drugo veljavno skupino.
6. **Predpogoj**:
   - Uporabnik je prijavljen in vidi vsaj en predlog skupine.
7. **Popogoj, posledice in učinki**:
   - Uspeh: uporabnik vidi podatke skupine, člane in po potrebi chat.
   - Neuspeh: pregled skupine ni prikazan.
8. **Posebne zahteve**:
   - Pregled mora vključevati čas, lokacijo, razloge ujemanja in neposreden dostop do kratkih profilov članov ter chata.
9. **Prioriteta (MoSCoW)**:
   - Must
10. **Sprejemni testi**:

| Primer uporabe             | Funkcijski sistem | Začetno stanje                  | Vhod                       | Pričakovan izhod                                   |
| -------------------------- | ----------------- | ------------------------------- | -------------------------- | -------------------------------------------------- |
| Pregledati skupino in chat | Predlog skupine   | Uporabnik vidi predlog          | Odprtje predlagane skupine | Prikazani podatki skupine, člani in chat           |
| Pregledati skupino in chat | Predlog skupine   | Podatki skupine niso dosegljivi | Odprtje predlagane skupine | Prikazano opozorilo in možnost ponovnega nalaganja |

11. **Razširitev - pogostost uporabe in triggerji**:
    - Pogostost: srednja.
    - Trigger: uporabnik odpre predlagano skupino iz seznama predlogov.

##### 3.1.4.8 Odločitev o udeležbi

1. **Naslov**: Odločitev o udeležbi
2. **Akterji**:
   - Uporabnik (vloga)
3. **Povzetek funkcionalnosti**:
   - Uporabnik po pregledu skupine potrdi ali zavrne predlog in sistem posodobi status odziva.
4. **Osnovni tok**:
   1. Uporabnik iz pregleda skupine izbere potrditev ali zavrnitev.
   2. Sistem preveri, ali je skupina še veljavna.
   3. Sistem zabeleži odločitev.
   4. Sistem posodobi status odziva in ga prikaže ostalim članom.
5. **Alternativni tokovi in napake**:
   - A1: Potrditev udeležbe.
     1. Uporabnik iz pregleda skupine izbere potrditev.
     2. Sistem preveri, ali je skupina še veljavna.
     3. Sistem zabeleži status "potrjeno".
     4. Sistem posodobi status odziva in potrdi uspeh.
   - A2: Zavrnitev predloga.
     1. Uporabnik iz pregleda skupine izbere zavrnitev.
     2. Sistem preveri, ali je skupina še veljavna.
     3. Sistem zabeleži status "zavrnjeno".
     4. Sistem posodobi status odziva in potrdi uspeh.
   - E1: Predlog ni več aktiven.
     1. Uporabnik iz pregleda skupine izbere potrditev ali zavrnitev.
     2. Sistem zazna, da predlog ni več veljaven.
     3. Sistem zavrne akcijo in osveži seznam predlogov.
     4. Uporabnik izbere drug veljaven predlog.
     5. Uporabnik ponovno odpre pregled skupine.
6. **Predpogoj**:
   - Uporabnik ima prikazan veljaven predlog skupine.
7. **Popogoj, posledice in učinki**:
   - Uspeh: status predloga je posodobljen.
   - Neuspeh: status ostane nespremenjen.
8. **Posebne zahteve**:
   - Dosledno beleženje sprememb statusa in barvno označevanje odziva.
9. **Prioriteta (MoSCoW)**:
   - Must
10. **Sprejemni testi**:

| Primer uporabe                 | Funkcijski sistem            | Začetno stanje              | Vhod               | Pričakovan izhod                                          |
| ------------------------------ | ---------------------------- | --------------------------- | ------------------ | --------------------------------------------------------- |
| Potrditi ali zavrniti udeležbo | Upravljanje predlogov skupin | Prikazan je aktiven predlog | Potrditev udeležbe | Status predloga posodobljen, oznaka ostalim članom        |
| Potrditi ali zavrniti udeležbo | Upravljanje predlogov skupin | Prikazan je aktiven predlog | Zavrnitev predloga | Status predloga posodobljen in predlog ostane v zgodovini |

11. **Razširitev - pogostost uporabe in triggerji**:
    - Pogostost: srednja.
    - Trigger: uporabnik izbere akcijo na predlogu po pregledu skupine.

##### 3.1.4.9 Oddaja povratne informacije

1. **Naslov**: Oddaja povratne informacije
2. **Akterji**:
   - Uporabnik (vloga)
3. **Povzetek funkcionalnosti**:
   - Uporabnik po srečanju odda oceno in komentar za izbrano skupino.
4. **Osnovni tok**:
   1. Sistem prikaže poziv za oddajo povratne informacije.
   2. Uporabnik vnese oceno in komentar.
   3. Sistem preveri veljavnost in shrani povratno informacijo.
5. **Alternativni tokovi in napake**:
   - A1: Oddaja samo ocene.
     1. Sistem prikaže poziv za oddajo povratne informacije.
     2. Uporabnik vnese oceno in pusti komentar prazen.
     3. Sistem preveri veljavnost in sprejme oddajo.
     4. Sistem shrani povratno informacijo in potrdi uspeh.
   - E1: Uporabnik je že oddal povratno informacijo.
     1. Sistem prikaže poziv za oddajo povratne informacije.
     2. Uporabnik vnese oceno in komentar za isti dogodek, za katerega je že oddal odgovor.
     3. Sistem zazna podvojitev in zavrne oddajo.
     4. Sistem prikaže obvestilo o obstoječi oddaji.
     5. Uporabnik obrazec zapre ali preide na drug dogodek.
   - E2: Napaka pri shranjevanju.
     1. Sistem prikaže poziv za oddajo povratne informacije.
     2. Uporabnik vnese oceno in komentar.
     3. Sistem preveri veljavnost, vendar ne uspe shraniti podatkov.
     4. Sistem ponudi ponovni poskus.
     5. Uporabnik ponovi oddajo.
     6. Sistem uspešno shrani povratno informacijo in potrdi uspeh.
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

| Primer uporabe              | Funkcijski sistem          | Začetno stanje                  | Vhod                       | Pričakovan izhod                           |
| --------------------------- | -------------------------- | ------------------------------- | -------------------------- | ------------------------------------------ |
| Oddati povratno informacijo | Modul povratnih informacij | Uporabnik ima zaključen dogodek | Ocena in komentar          | Podatki so shranjeni in potrjeni           |
| Oddati povratno informacijo | Modul povratnih informacij | Uporabnik ima zaključen dogodek | Manjkajoči obvezni podatki | Shranjevanje zavrnjeno in prikazana napaka |

11. **Razširitev - pogostost uporabe in triggerji**:
    - Pogostost: srednja.
    - Trigger: sistem po srečanju pošlje poziv za oddajo ocene.

##### 3.1.4.10 Prijava neprimernega vedenja

1. **Naslov**: Prijaviti neprimerno vedenje
2. **Akterji**:
   - Uporabnik (vloga)
3. **Povzetek funkcionalnosti**:
   - Uporabnik odda prijavo za neprimerno vedenje uporabnika znotraj gruppe.
4. **Osnovni tok**:
   1. Uporabnik odpre skupino in izbere uporabnika, ki se je neprimerno vedel.
   2. Uporabnik izbere možnost "Prijavi neprimerno vedenje".
   3. Sistem prikaže obrazec za prijavo.
   4. Uporabnik vnese opis incidenta in oddaja prijavo.
   5. Sistem preveri veljavnost podatkov.
   6. Sistem shrani prijavo in potrdi prejem.
5. **Alternativni tokovi in napake**:
   - A1: Dopolnitev prijave.
     1. Uporabnik odda prijavo.
     2. Sistem potrdi prejem prijave.
     3. Uporabnik se lahko vrne in dopolni opis, če je potrebno.
     4. Sistem shrani spremembo.
   - E1: Neprimerno izpolnjena prijava.
     1. Uporabnik odpre obrazec za prijavo.
     2. Uporabnik vpiše podatke, ki ne izpolnjujejo zahtev.
     3. Sistem zavrne oddajo in označi obavezna polja.
     4. Uporabnik popravi podatke in ponovno odda prijavo.
     5. Sistem shrani prijavo in potrdi prejem.
6. **Predpogoj**:
   - Uporabnik je prijavljen in je član aktivne skupine.
7. **Popogoj, posledice in učinki**:
   - Uspeh: prijava je shranjena in potrjena.
   - Neuspeh: prijava ni shranjena.
8. **Posebne zahteve**:
   - Zaupna obravnava prijav.
9. **Prioriteta (MoSCoW)**:
   - Should
10. **Sprejemni testi**:

| Primer uporabe               | Funkcijski sistem | Začetno stanje       | Vhod                    | Pričakovan izhod                       |
| ---------------------------- | ----------------- | -------------------- | ----------------------- | -------------------------------------- |
| Prijaviti neprimerno vedenje | Varnostni modul   | Uporabnik je v grupi | Oddaja veljavne prijave | Prijava shranjena in potrjena          |
| Prijaviti neprimerno vedenje | Varnostni modul   | Obrazec je prazan    | Oddaja praznega obrazca | Prikazana napaka, zahtevana izpolnitev |

11. **Razširitev - pogostost uporabe in triggerji**:
    - Pogostost: nizka.
    - Trigger: uporabnik zazna neprimerno vedenje znotraj skupine.

##### 3.1.4.11 Pregled informacij

1. **Naslov**: Pregled informacij
2. **Akterji**:
   - Gost (vloga)
   - Uporabnik (vloga)
3. **Povzetek funkcionalnosti**:
   - Gost ali uporabnik prek footer povezav dostopa do pogojev uporabe, GDPR in pogostih vprašanj.
4. **Osnovni tok**:
   1. Gost ali uporabnik v footerju odpre izbrano informacijsko stran.
   2. Sistem prikaže vsebino izbrane strani.
   3. Uporabnik po potrebi odpre še drugo informacijsko stran.
5. **Alternativni tokovi in napake**:
   - A1: Branje več informacijskih strani.
     1. Gost ali uporabnik v footerju odpre prvo informacijsko stran.
     2. Sistem prikaže vsebino strani.
     3. Gost ali uporabnik odpre dodatno informacijsko stran.
     4. Sistem prikaže njeno vsebino.
     5. Uporabnik zapre informacijske strani brez nadaljnjih dejanj.
   - E1: Informacijska stran ni dosegljiva.
     1. Gost ali uporabnik v footerju odpre izbrano informacijsko stran.
     2. Sistem poskuša naložiti vsebino, vendar nalaganje ne uspe.
     3. Sistem prikaže opozorilo in možnost ponovnega nalaganja.
     4. Uporabnik ponovi zahtevo.
     5. Sistem prikaže vsebino strani.
6. **Predpogoj**:
   - Gost ali uporabnik ima dostop do spletnega vmesnika.
7. **Popogoj, posledice in učinki**:
   - Uspeh: informacije so prikazane.
   - Neuspeh: izbrana stran ni prikazana.
8. **Posebne zahteve**:
   - Strani morajo biti dostopne tudi brez prijave.
9. **Prioriteta (MoSCoW)**:
   - Should
10. **Sprejemni testi**:

| Primer uporabe                     | Funkcijski sistem   | Začetno stanje              | Vhod                        | Pričakovan izhod                                   |
| ---------------------------------- | ------------------- | --------------------------- | --------------------------- | -------------------------------------------------- |
| Dostopati do informacijskih strani | Informacijski modul | Uporabnik je na aplikaciji  | Klik na povezavo v footerju | Odprta ustrezna informacijska stran                |
| Dostopati do informacijskih strani | Informacijski modul | Stran začasno ni dosegljiva | Poskus odpiranja strani     | Prikazano opozorilo in možnost ponovnega nalaganja |

11. **Razširitev - pogostost uporabe in triggerji**:
    - Pogostost: nizka.
    - Trigger: uporabnik klikne povezavo v footerju.

##### 3.1.4.12 Kontaktni obrazec

1. **Naslov**: Kontaktni obrazec
2. **Akterji**:
   - Gost (vloga)
   - Uporabnik (vloga)
3. **Povzetek funkcionalnosti**:
   - Gost ali uporabnik prek kontaktnega obrazca pošlje sporočilo sistemu.
4. **Osnovni tok**:
   1. Gost ali uporabnik v footerju odpre stran "Kontakt".
   2. Vpiše ime, priimek, e-naslov, zadevo in sporočilo.
   3. Sistem preveri veljavnost podatkov.
   4. Sistem shrani sporočilo in potrdi prejem.
5. **Alternativni tokovi in napake**:
   - A1: Dopolnitev obrazca pred oddajo.
     1. Gost ali uporabnik v footerju odpre stran "Kontakt".
     2. Vpiše del obrazca, nato opazi manjkajoče podatke.
     3. Dopolni obvezna polja in ponovno odda obrazec.
     4. Sistem preveri veljavnost podatkov.
     5. Sistem shrani sporočilo in potrdi prejem.
   - E1: Neveljavno izpolnjen kontaktni obrazec.
     1. Gost ali uporabnik v footerju odpre stran "Kontakt".
     2. Uporabnik odda obrazec z manjkajočimi ali napačnimi podatki.
     3. Sistem zavrne oddajo in označi napake v poljih.
     4. Uporabnik popravi obrazec in ponovno odda sporočilo.
     5. Sistem shrani sporočilo in potrdi prejem.
6. **Predpogoj**:
   - Gost ali uporabnik ima dostop do spletnega vmesnika.
7. **Popogoj, posledice in učinki**:
   - Uspeh: kontaktno sporočilo je oddano in potrjeno.
   - Neuspeh: sporočilo ni oddano.
8. **Posebne zahteve**:
   - Sistem mora potrditi prejem, ne glede na to, ali je vprašanje vsebinsko že obravnavano.
9. **Prioriteta (MoSCoW)**:
   - Should
10. **Sprejemni testi**:

| Primer uporabe             | Funkcijski sistem | Začetno stanje          | Vhod                        | Pričakovan izhod                              |
| -------------------------- | ----------------- | ----------------------- | --------------------------- | --------------------------------------------- |
| Oddati kontaktno sporočilo | Kontaktni modul   | Uporabnik odpre kontakt | Oddano kontaktno sporočilo  | Potrditev prejema sporočila                   |
| Oddati kontaktno sporočilo | Kontaktni modul   | Obrazec vsebuje napake  | Oddaja neveljavnega obrazca | Prikazane napake v poljih in zavrnjena oddaja |

11. **Razširitev - pogostost uporabe in triggerji**:
    - Pogostost: nizka.
    - Trigger: uporabnik klikne povezavo v footerju in odpre kontaktni obrazec.

##### 3.1.4.13 Upravljanje uporabnikov (administrator)

1. **Naslov**: Upravljanje uporabnikov
2. **Akterji**:
   - Administrator (vloga)
3. **Povzetek funkcionalnosti**:
   - Administrator pregleduje seznam uporabnikov in izvaja ukrepe nad računi, vključno z opozorilom uporabniku.
4. **Osnovni tok**:
   1. Administrator odpre sekcijo Uporabniki.
   2. Sistem prikaže paginiran seznam uporabnikov.
   3. Administrator izvede akcijo blokiraj/deblokiraj/aktiviraj/deaktiviraj/opozori.
5. **Alternativni tokovi in napake**:
   - A1: Opozorilo uporabniku.
     1. Administrator odpre sekcijo Uporabniki.
     2. Sistem prikaže paginiran seznam uporabnikov.
     3. Administrator odpre izbranega uporabnika in izbere akcijo "Opozori".
     4. Sistem shrani opozorilo.
     5. Sistem uporabnika označi z rumeno vizualno oznako.
   - E1: Administrator nima ustreznih pravic.
     1. Administrator odpre sekcijo Uporabniki.
     2. Sistem prikaže seznam uporabnikov.
     3. Administrator sproži administrativno akcijo na uporabniku.
     4. Sistem preveri pravice in akcijo zavrne.
     5. Sistem prikaže razlog zavrnitve.
     6. Seznam uporabnikov ostane nespremenjen.
   - E2: Konflikt stanja računa.
     1. Administrator odpre sekcijo Uporabniki.
     2. Sistem prikaže paginiran seznam uporabnikov.
     3. Administrator izvede akcijo nad uporabnikom.
     4. Sistem zazna konflikt stanja v drugi seji.
     5. Sistem osveži seznam uporabnikov.
     6. Administrator ponovi akcijo na osveženih podatkih.
6. **Predpogoj**:
   - Administrator je prijavljen.
7. **Popogoj, posledice in učinki**:
   - Uspeh: status uporabnika je posodobljen.
   - Neuspeh: status ostane nespremenjen.
8. **Posebne zahteve**:
   - Revizijska sled administrativnih akcij.
   - Uporabnik z opozorilom je v seznamu vizualno označen z rumeno.
9. **Prioriteta (MoSCoW)**:
   - Must
10. **Sprejemni testi**:

| Primer uporabe        | Funkcijski sistem                  | Začetno stanje              | Vhod                                             | Pričakovan izhod                      |
| --------------------- | ---------------------------------- | --------------------------- | ------------------------------------------------ | ------------------------------------- |
| Upravljati uporabnike | Administratorski modul uporabnikov | Administrator je prijavljen | Akcija blokiraj/deblokiraj/aktiviraj/deaktiviraj | Status uporabnika uspešno posodobljen |
| Upravljati uporabnike | Administratorski modul uporabnikov | Administrator brez pravic   | Poskus akcije                                    | Akcija zavrnjena                      |

11. **Razširitev - pogostost uporabe in triggerji**:
    - Pogostost: srednja.
    - Trigger: administrator odpre sekcijo Uporabniki.

##### 3.1.4.14 Pregled kontaktnih obrazcev in prijav neprimernega vedenja (administrator)

1. **Naslov**: Pregled kontaktnih obrazcev in prijav neprimernega vedenja
2. **Akterji**:
   - Administrator (vloga)
3. **Povzetek funkcionalnosti**:
   - Administrator pregleda prijave, vprašanja in povratna sporočila uporabnikov.
4. **Osnovni tok**:
   1. Administrator odpre sekcijo Obvestila.
   2. Sistem prikaže seznam obvestil.
   3. Administrator odpre podrobnosti in označi obvestilo kot obdelano.
5. **Alternativni tokovi in napake**:
   - A1: Eskalacija obvestila.
     1. Administrator odpre sekcijo Obvestila.
     2. Sistem prikaže seznam obvestil.
     3. Administrator odpre obvestilo visoke prioritete.
     4. Administrator izbere možnost eskalacije.
     5. Sistem označi obvestilo kot eskalirano in ga posreduje v nadaljnjo obravnavo.
     6. Seznam obvestil se osveži s posodobljenim statusom.
   - A2: Eskalacija na upravljanje uporabnika.
     1. Administrator odpre sekcijo Obvestila.
     2. Sistem prikaže seznam obvestil in prijav.
     3. Administrator odpre prijavo ali kontaktni obrazec.
     4. Administrator ugotovi, da je potrebna administrativna akcija (npr. opozorilo, blokiranje ali deaktivacija uporabnika).
     5. Administrator izbere možnost "Upravljaj uporabnika".
     6. Sistem ga preusmeri na sekcijo Upravljati uporabnike s podatki relevantnega uporabnika.
        Razširitev: Eskalacija na upravljanje uporabnikov : Potrebna je administrativna akcija nad uporabnikom : Upravljanje uporabnikov.
     7. Administrator izvede ustrezno akcijo (blokiraj, deblokiraj, aktiviraj, deaktiviraj, opozori).
     8. Sistem zabeleži akcijo in posodobi status v obvestilih.
   - E1: Podrobnosti obvestila niso dosegljive.
     1. Administrator odpre sekcijo Obvestila.
     2. Sistem prikaže seznam obvestil.
     3. Administrator odpre obvestilo.
     4. Sistem ne naloži podrobnosti.
     5. Sistem prikaže opozorilo in možnost ponovnega nalaganja.
     6. Administrator ponovi zahtevo.
     7. Sistem naloži podrobnosti obvestila.
     8. Administrator obvestilo označi kot obdelano.
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

| Primer uporabe                                  | Funkcijski sistem               | Začetno stanje              | Vhod                             | Pričakovan izhod                |
| ----------------------------------------------- | ------------------------------- | --------------------------- | -------------------------------- | ------------------------------- |
| Pregledati obvestila in prijave (administrator) | Administratorski modul obvestil | Administrator je prijavljen | Odprtje obvestila                | Prikazane podrobnosti obvestila |
| Pregledati obvestila in prijave (administrator) | Administratorski modul obvestil | Administrator je prijavljen | Označitev obvestila kot obdelano | Status obvestila posodobljen    |

11. **Razširitev - pogostost uporabe in triggerji**:
    - Pogostost: srednja.
    - Trigger: administrator odpre sekcijo Obvestila.

##### 3.1.4.15 Pregledati skupine in chat (administrator)

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
   - A1: Filtriranje pred vpogledom.
     1. Administrator odpre sekcijo Skupine.
     2. Sistem prikaže seznam vseh ustvarjenih skupin.
     3. Administrator nastavi filtre (status, obdobje, št. članov).
     4. Sistem osveži seznam skupin.
     5. Administrator odpre izbrano skupino in nadaljuje na pregled chata.
   - E1: Podatki chata niso dosegljivi.
     1. Administrator odpre sekcijo Skupine.
     2. Sistem prikaže seznam vseh ustvarjenih skupin.
     3. Administrator odpre izbrano skupino in pregled chata.
     4. Sistem ne uspe naložiti podatkov chata.
     5. Sistem prikaže opozorilo in možnost ponovnega poskusa.
     6. Administrator ponovi nalaganje in sistem prikaže chat.
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

| Primer uporabe             | Funkcijski sistem             | Začetno stanje              | Vhod                              | Pričakovan izhod                                 |
| -------------------------- | ----------------------------- | --------------------------- | --------------------------------- | ------------------------------------------------ |
| Pregledati skupine in chat | Administratorski modul skupin | Administrator je prijavljen | Odprtje izbrane skupine           | Prikazani člani, statusi in chat                 |
| Pregledati skupine in chat | Administratorski modul skupin | Administrator je prijavljen | Chat podatki začasno nedosegljivi | Prikazano opozorilo in možnost ponovnega poskusa |

11. **Razširitev - pogostost uporabe in triggerji**:
    - Pogostost: srednja.
    - Trigger: administrator odpre sekcijo Skupine.

##### 3.1.4.16 Pregled povratnih informacij (administrator)

1. **Naslov**: Pregled povratnih informacij
2. **Akterji**:
   - Administrator (vloga)
3. **Povzetek funkcionalnosti**:
   - Administrator pregleda povratne informacije, ki so jih člani oddali za posamezno skupino.
4. **Osnovni tok**:
   1. Administrator odpre sekcijo Skupine.
   2. Sistem prikaže seznam vseh ustvarjenih skupin.
   3. Administrator odpre izbrano skupino.
   4. Sistem prikaže povprečno oceno, število oddanih ocen in seznam komentarjev.
5. **Alternativni tokovi in napake**:
   - A1: Filtriranje povratnih informacij po skupini.
     1. Administrator odpre sekcijo Skupine.
     2. Sistem prikaže seznam vseh ustvarjenih skupin.
     3. Administrator uporabi filtre za določeno skupino ali obdobje.
     4. Sistem osveži prikaz povratnih informacij.
     5. Administrator pregleda podatke za izbrano skupino.
   - E1: Povratne informacije za skupino niso dosegljive.
     1. Administrator odpre sekcijo Skupine.
     2. Sistem prikaže seznam vseh ustvarjenih skupin.
     3. Administrator odpre izbrano skupino.
     4. Sistem ne naloži povratnih informacij.
     5. Sistem prikaže opozorilo in možnost ponovnega nalaganja.
     6. Administrator ponovi nalaganje.
     7. Sistem prikaže razpoložljive povratne informacije.
6. **Predpogoj**:
   - Administrator je prijavljen.
7. **Popogoj, posledice in učinki**:
   - Uspeh: povratne informacije za izbrano skupino so prikazane.
   - Neuspeh: podatki o povratnih informacijah niso prikazani.
8. **Posebne zahteve**:
   - Prikaz mora ločiti povprečne ocene od posameznih komentarjev.
9. **Prioriteta (MoSCoW)**:
   - Should
10. **Sprejemni testi**:

| Primer uporabe                          | Funkcijski sistem             | Začetno stanje              | Vhod                                  | Pričakovan izhod                                   |
| --------------------------------------- | ----------------------------- | --------------------------- | ------------------------------------- | -------------------------------------------------- |
| Pregledati povratne informacije skupine | Administratorski modul skupin | Administrator je prijavljen | Odprtje izbrane skupine               | Prikazane povprečne ocene in komentarji            |
| Pregledati povratne informacije skupine | Administratorski modul skupin | Podatki niso dosegljivi     | Poskus odpiranja povratnih informacij | Prikazano opozorilo in možnost ponovnega nalaganja |

11. **Razširitev - pogostost uporabe in triggerji**:
    - Pogostost: srednja.
    - Trigger: administrator odpre izbrano skupino v sekciji Skupine.

##### 3.1.4.17 Upravljanje pametne komponente (administrator)

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
   - A1: Spremljanje brez spremembe parametrov.
     1. Administrator odpre sekcijo Pametna komponenta.
     2. Sistem prikaže ključne metrike kakovosti.
     3. Administrator pregleda trend po obdobjih.
     4. Administrator ne spremeni parametrov in zapre pogled.
     5. Sistem ne zabeleži spremembe nastavitev.
   - E1: Parametri so izven dovoljenih mej.
     1. Administrator odpre sekcijo Pametna komponenta.
     2. Sistem prikaže ključne metrike kakovosti.
     3. Administrator spremeni parameter algoritma z neveljavno vrednostjo.
     4. Sistem zavrne spremembo in prikaže dovoljene meje.
     5. Administrator vnese veljavno vrednost.
     6. Sistem zabeleži spremembo in prikaže primerjavo metrik pred/po.
   - E2: Konflikt sočasnih sprememb.
     1. Administrator odpre sekcijo Pametna komponenta.
     2. Sistem prikaže ključne metrike kakovosti in trenutne parametre.
     3. Administrator spremeni parameter, medtem ko drug administrator sočasno ureja isti parameter.
     4. Sistem pri shranjevanju zazna konflikt.
     5. Sistem zahteva osvežitev zadnje verzije.
     6. Administrator osveži podatke, ponovno odda spremembo in sistem jo zabeleži.
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

| Primer uporabe                                         | Funkcijski sistem                         | Začetno stanje              | Vhod                                    | Pričakovan izhod                                   |
| ------------------------------------------------------ | ----------------------------------------- | --------------------------- | --------------------------------------- | -------------------------------------------------- |
| Spremljati kakovost pametne komponente (administrator) | Administratorski modul pametne komponente | Administrator je prijavljen | Pregled metrik                          | Prikazane aktualne metrike kakovosti               |
| Spremljati kakovost pametne komponente (administrator) | Administratorski modul pametne komponente | Administrator je prijavljen | Sprememba parametrov v dovoljenih mejah | Sprememba zabeležena, prikazana primerjava pred/po |

11. **Razširitev - pogostost uporabe in triggerji**:
    - Pogostost: srednja.
    - Trigger: administrator odpre sekcijo Pametna komponenta.

![DPU](./gradivo/img/use_case.jpg 'Ganttov diagram')

**Diagram primerov uporabe** (izvorna koda [PlantUML](./gradivo/plantuml/Use_case_diagram.puml))

## 4 Opis sistema

- Predstavite sistem in glavne izzive.

# Blokovni diagram sistema:
```
┌─────────────────────────────────────────────────────────────┐
│                    UPORABNIŠKI VMESNIK                      │
│                                                             │
│  - Javni del (gost)                                         │
│  - Uporabniška nadzorna plošča                              │
│  - Administratorska nadzorna plošča                         │
│  - Skupinski chat                                           │
└───────────────────┬─────────────────────────────────────────┘
                    │ 
                    ▼
┌─────────────────────────────────────────────────────────────┐
│                       API GATEWAY                           │
│  - Usmerjanje zahtev                                        │
│  - Avtentikacija in avtorizacija                            │
└───────────────────┬─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────────┐
│                    APLIKACIJSKI NIVO                        │
│                                                             │
│  ┌──────────────────────────────┐                           │
│  │ AVTENTIKACIJA & VARNOST      │                           │
│  │ - prijava                    │                           │
│  │ - registracija               │                           │
│  │ - ponastavitev gesla         │                           │
│  └──────────────────────────────┘                           │
│                                                             │
│  ┌──────────────────────────────┐                           │
│  │ UPRAVLJANJE UPORABNIKOV      │                           │
│  │ - profil                     │                           │
│  │ - interesi, lokacija, čas    │                           │
│  └──────────────────────────────┘                           │
│                                                             │
│  ┌──────────────────────────────┐                           │
│  │ POVEZOVANJE V SKUPINE        │                           │
│  │ - iskanje skupin             │                           │
│  │ - predlogi skupin            │                           │
│  │ - odločitev (sprejmi/zavrni) │                           │
│  └───────────────┬──────────────┘                           │
│                  │                                          │
│                  ▼                                          │
│      ┌──────────────────────────────────────┐               │
│      │ PAMETNA KOMPONENTA                   │               │
│      │ - algoritem za oblikovanje skupin    │               │
│      │ - podobnost interesov                │               │
│      │ - geografska bližina                 │               │
│      │ - časovno ujemanje                   │               │ 
│      └──────────────────────────────────────┘               │
│                                                             │
│  ┌──────────────────────────────┐                           │
│  │ CHAT                         │                           │
│  │ - pošiljanje sporočil        │                           │
│  └──────────────────────────────┘                           │
│                                                             │
│  ┌──────────────────────────────┐                           │
│  │ POVRATNE INFO IN PRIJAVE     │                           │ 
│  │ - ocene srečanj              │                           │
│  │ - prijava vedenja            │                           │
│  └──────────────────────────────┘                           │
│                                                             │
│  ┌──────────────────────────────┐                           │
│  │ ADMIN MODUL                  │                           │
│  │ - upravljanje uporabnikov    │                           │
│  │ - upravljanje skupin         │                           │
│  │ - pregled prijav             │                           │
│  │ - metrike algoritma          │                           │
│  └──────────────────────────────┘                           │
│                                                             │
└───────────────────┬──────────────────────────────────┬──────┘
                    │                                  │
                    ▼                                  │
┌───────────────────────────────────────────────────┐  │
│                 PODATKOVNA PLAST                  │  │
│                                                   │  │
│  ┌────────────────────┐  ┌────────────────────┐   │  │
│  │ Uporabniki         │  │ Skupine (predlogi, │   │  │
│  │ (profili, interesi,│  │ statusi)           │   │  │
│  │ lokacija,          │  └────────────────────┘   │  │
│  | razpoložljivost)   |                           │  │
|  └────────────────────┘                           |  |
│  ┌────────────────────┐  ┌────────────────────┐   │  │
│  │ Sporočila (chat)   │  │ Povratne           │   │  │
│  └────────────────────┘  │ informacije        │   │  │
│                          └────────────────────┘   │  │
│  ┌────────────────────┐                           │  │
│  │ Prijave vedenja    │                           │  │
│  └────────────────────┘                           │  │
└───────────────────────────────────────────────────┘  │
                                                       │
┌──────────────────────────────────────────────────────▼──────┐
│                    ZUNANJE STORITVE                         │
│                                                             │
│  - Geokodirni API (lokacije → koordinate)                   │
│  - E-poštni servis (verifikacija, ponastavitev gesla)       │
└─────────────────────────────────────────────────────────────┘
```

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

![Ganttov diagram](./gradivo/img/gantt2.png 'Ganttov diagram')

**Ganttov diagram** (izvorna koda [PlantUML](./gradivo/plantuml/Ganttov_diagram2.puml))

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
