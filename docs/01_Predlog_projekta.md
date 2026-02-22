# :yellow_square: Predlog projekta

| Prejšnji dokument |          Trenutni dokument           | Naslednji dokument [:arrow_forward:](02_Osnutek_sistema_1_porocilo_o_stanju.md) |
| :---------------- | :----------------------------------: | ------------------------------------------------------------------------------: |
|                   | :yellow_square: **Predlog projekta** |                   :orange_square: **Osnutek sistema**<br>(1. poročilo o stanju) |

![Terminski načrt](https://teaching.lavbic.net/plantuml/svg/dPRFJkCm4CRlVWeB3h2LKXhdpw9LXH2mI6XN0gtsHCLXshZ1JMfNjbkMhdW4tee7st6QXZOD3LhrqauztpVpct6KSsD1snIajVJWDzTJ8Kqcg8ItLsqF2EaR-vppCrASk1AGQfZIluHIAwOy5v8NFoZzYLylLQuqFHmpzocYrqhQLHJpdZ7quZB1P6NM1OooLAkvJCfSVZgEnabTCRg-EFr-MQQ3rkffrtNhp5Jat5XLLVS_FgDS6Pvy9D3OP2xIHrjr-aBw9oKzWapb31oxOKt9Qf06_-BIagD7aN0wLieErH-IWqpda79gSZBJGbepWfpJ9ywp_1abmSvr0iy8X9V54eEosn7MOx7N2xrUJ8Mf1zdNdM3azVoc8Di8bj70yrUYhWya9IGzJ7eSniEwwqS7K3TiES2Y3mwGEwqcV6HfiS26hX8OraJ8e5yaVAlcSNQF-ymjpwXOBc02SW9qXe9JRe4U-t6NTR_qJugaimVw2BCPbuQ2tL8zsb5jCEfqVi4omPjX-O8kgCdcCzolJWTTgEK9bni-OEZWod-WEHXi8A8uEjCeURCS2WrO-r8iO8yMszAY89Cr7Mp5MHqPoYKEqFEetwLOeuQHG1QUXz0wdJj4agiKqI3Qp3ghifgYaEF0sKfHjmtMjlwgXnrZveoB01dS9WcKzD4AAgzj9nn9i7SaRld8u1vIjS1BjAEsgko-1dUdi62J26iWSclatAsD4SRowMU1H1MGiCLtZGEdCLDQlRsA7AXoP-LalkqLTyEzHDnjUoVIA5XIOIrKeaqgGGELc-K2UK_4ekHInn8sOuahBASjnciih1rBs8tsOd7Fc7SiR0-Me0LBl8abRC3oGyctL-dkgIl-axlYixRR4zUfP8KFT-jUzR9bnQ9MA2nwXzAWLo89Mv3uh6Ao-zn277pK-C0Dkl7Uyjpz9kGSTOlNZdy0 "Terminski načrt")

V 1. iteraciji ekipa predlaga projekt, ki je skladen z izzivom dejanskega naročnika (zunaj ekipe). Ekipa določi zahteve, projektne cilje, načrtuje implementacijo in se seznani z orodji in platformami, ki jih bo uporabljala. Na predavanjih v tem času obdelamo potrebe in zahteve uporabnikov. Podrobna vprašanja v predlogu omogočajo, da ekipe delajo vzporedno s predavanji.

V 5. tednu ekipe predstavijo svoj predlog na zagovoru. Povratna informacija pomaga ekipi določiti cilje projekta, ki morajo biti dovolj zahtevni, a izvedljivi.

Predlog projekta in poročila o stanju se nadgrajujejo v celovito končno poročilo. Vsa poročila imajo v osnovi enake odstavke. V predlogu sta poudarjena odseka [**2 Potrebe naročnika**](#2-potrebe-naročnika) in [**3 Cilji projekta**](#3-cilji-projekta). Gradivo iz teh odsekov se lahko uporabi v kasnejših poročilih.

## :page_with_curl: Opisni naslov, osredotočen na prednosti za naročnika

## :information_desk_person: Ime ekipe: Člani ekipe

## 0 Projektna ideja

### 0.1 Ozadje

- Opis konteksta projekta.

### 0.2 Področje in motivacija

- Opis problema, ki ga je treba rešiti.

### 0.3 Namen projekta

- Kakšne bodo koristi projekta?

### 0.4 Cilji

Glej poglavje [3 Cilji projekta](#3-cilji-projekta).

### 0.5 Smernice

- Katere smernice naj bi upoštevali (npr. ponovna uporabnost kode)?

### 0.6 Ciljna skupina in končni uporabniki

Glej poglavje [2 Potrebe naročnika](#2-potrebe-naročnika).

## 1 Uvod

### Začetni odstavek

Povzetek [0 Projektna ideja](#0-projektna-ideja) in motivacija za projekt.

### 1.1 Izzivi

- Na kratko opišite glavne izzive za ekipo.
  - Kako jih boste naslovili?
  - Je tehnologija ekipi znana ali nova?

## 2 Potrebe naročnika

- Kdo je primarni naročnik (zunaj ekipe)?
  - Kdo so sekundarni deležniki?
- Kaj deležniki želijo? Zakaj?
- Kakšna je njihova želena splošna izkušnja?

### 2.1 Uporabniške zahteve

- Zapišite **SMART** uporabniške zgodbe na podlagi potreb in želja deležnikov.
  - **`S`**`pecific` **`M`**`easurable` **`A`**`chievable` **`R`**`elevant` **`T`**`ime-bounded`
- Uporabite predlogo "Kot **_\<vloga\>_** želim **_\<akcija\>_**, da **_\<posledica\>_**."
  - npr. "Kot **_prijavljen uporabnik_** želim **_urediti podatke v svojem profilu, vključno z imenom in profilno sliko_**, da **bo profil vedno vseboval točne podatke**."
- Za uporabniške zgodbe zapišite teste sprejemljivosti z uporabo predloge "Glede **\<pogoj\>**, ko **\<akcija\>**, potem **\<posledica\>**."
  - npr. "Glede **_na to, da sem prijavljen uporabnik_**, ko **_zahtevam urejanje profila_** in **_posodobim profilno sliko_**, potem **_so informacije o mojem profilu posodobljene in vidne vsem uporabnikom_**."

## 3 Cilji projekta

- Za katero težavo naročnika ste se odločili, da jo boste obravnavali?
- Brez tehničnih podrobnosti opišite koristi sistema za naročnika.
- Kako bodo koristi podprle želeno splošno izkušnjo naročnika?
- Kaj bodo konkretni izdelki vašega projekta?
- Cilji morajo biti merljivi in preverljivi.

### 3.2 Merila uspeha

- Pri komu izven ekipe ste preverili ustreznost ideje?
  - Opišite dejanskega zunanjega naročnika.
- Kako boste vedeli, ali je naročnik dobil želene koristi?
  - Katera merila uspeha so pomembna naročniku?

## 4 Opis sistema

_V okviru predloga projekta zadostuje osnutek tega poglavja._

- Narišite blokovni diagram, ki prikazuje, kako bo predlagani sistem deloval z zunanjimi storitvami, podatkovnimi bazami ipd. Jasno označite tudi meje sistema.
- Uporabite prejšnji diagram za predstavitev sistema.
- Kaj so osrednji elementi predlaganega sistema?

## 5 Predlagan pristop

_V okviru predloga projekta zadostuje osnutek tega poglavja._

- Na kratko opišite, kako bo sistem deloval.
- Katere platforme, orodja in knjižnice boste uporabljali?
  - Kako boste sistem testirali?
  - Kako boste ovrednotili ustrezno strategije testiranja?

## 6 Vodenje projekta

_Začnite zapisovati v **dnevnik sprememb**, kjer sledite vsem spremembam projekta, kot je opisano v tem predlogu projekta. Za vsak vnos v dnevnik sprememb vključite naslednje podatke: datum, opis, motivacija in posledica spremembe._

- Kateri razvojni proces in dobre prakse boste uporabili?
  - Kakšen je minimalni delujoč sistem, ki ga nameravate zgraditi v naslednji iteraciji?
- Kakšen je vaš seznam želja glede funkcij predlaganega sistema?

### 6.1 Usklajevanje ekipe

- Kako boste razporedili in koordinirali delo v okviru ekipe?
  - Kako se boste sestajali kot ekipa? Kako pogosto?
  - Kaj nameravate doseči med sestanki?

### 6.2 Projektni načrt

- Povzetek razdelitve projekta na aktivnosti s seznamom izdelkov, vključno z Ganttovim diagramom in grafom PERT.

![Ganttov diagram](https://teaching.lavbic.net/plantuml/svg/dPBFJy8m5CVl_IjUzA1o4MQMS2060V7YmOCtmk51txQoqfBs3LmC_xlTc8jCkPWcxVfjFz_tenjxHiSf6cQuUgaMkmUfC7MulH9YvBdKz2Zg2xEJ39y2WDMMj39KRm1Um-VKQklWEecgKQjpQ_Ya1guCqh4YqUSDDS5rdZfR6DcmD4pYH7OTu_ba-3njS7JE7dv7FRkpLPeyspQx_yHPQ-j9NZBuiqYjqepRIezYTDzqJ_XScHrMlLjrdDYXyU6838jCIOB4MbxP3w7Hf0Mc15uBiNDsGsk6-h4yS4OGzJa3cy2SLgv0LmOXYeL7Bfp4qeS-KLE3y25QHnABNk_DxH4mPxKtrdEl1xU3FaYZxfQ07XPFWoLez25S9GU-OcQkI3jG_9E9MWOEH3cWaTz98zUUDnx8oChhtH5lkXcSkJsqRZ6SAhXa9yPXhd_IBm00 "Ganttov diagram")

**Ganttov diagram** (izvorna koda :bar_chart: [PlantUML](./gradivo/plantuml/Gantt.puml))

![PERT diagram](https://teaching.lavbic.net/plantuml/svg/bL9DJyCm3BtdLrZR3MsmTUeqGLN1O9mu8DXjx90rRYdD4kHcV8Zjl-Eq7LJJE718ujX-x_b5kIoT9BTPQ-ZSpnxce7APaLntX2YBtBnAZc4bao8Zkp7gscfBu4YQaajedD2OEd0MAC-U7QC94vTRm_14QeJ1wKI8g7IV6cF1KWvlQW7u4W2IoBvN4S1TRh2cNsdMuznEx4Hqrc1RupnwcWerFHYiYvCqJ9MlM598JJQydKvcrypM8b6OoersS_nmLphFp9hDGC8RagW7XKwKUFovabGGglYUtYJ8mkLlnfOkEgkgSGTa2LT3wAOfZd5yeTd77WBd43NvNdF6Mu3X0BRWbm-UpDRRRwVs-ZUqoLgAjL9GaTP6UytfII5iq30CQzRg4bHR-4jwO6fEw5x-j3NwXwtXpm11kBSrQAU4M9mieR_eDZIzbTLgsO_vzGG_ODz7GHKTQHa9TkvRc4FmN4TwV4LSeb7ycxy1 "PERT diagram")

**Graf PERT** (izvorna koda :bar_chart: [PlantUML](./gradivo/plantuml/PERT.puml))

### 6.3 Finančni načrt

- Finančni načrt projekta po metodi COCOMO II.

![COCOMO II ocena](./gradivo/img/cocomo-ii-ocena.png)

## 7 Ekipa

### 7.1 Predznanje

- Kakšno je predznanje ekipe?
  - Kakšne predhodne delovne izkušnje pri razvoju programske opreme?
  - Je kateri član ekipe že razvil kaj podobnega?
  - Ali so orodja ekipi znana ali nova?

### 7.2 Vloge

- Kakšne so načrtovane vloge članov ekipe pri projektu?

## 8 Omejitve in tveganja

- Ali obstajajo kakšne družbene, etične, politične ali pravne omejitve?
  - Opredelite možna tveganja in strategije za obvladovanje tveganj.
- Ali boste imeli dostop do podatkov, storitev in virov, ki jih potrebujete?
- Ali potrebujete še kaj drugega?
