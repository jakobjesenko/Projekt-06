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

## :page_with_curl: Naslov projekta

## :information_desk_person: Ime ekipe: Člani ekipe

## 1 Uvod

### 1.2 Poudarki

- Kakšen je bil načrt za to iteracijo?
  - Kaj je ekipa dosegla?

### 1.3 Spremembe

- Povzemite vse večje spremembe predloga projekta.
- Vključite datum, motivacijo, opis in posledice vsake spremembe.
- Če sprememb ni bilo, samo navedite, da jih ni bilo.

## 2 Potrebe naročnika

- Na kratko opišite želeno splošno izkušnjo naročnika.

## 3 Cilji projekta

- Povzamite naročnikove težave, ki jih projekt naslavlja.
- Kakšne koristi bo prinesel projekt?

### 3.1 Primeri uporabe

- Pripravite slovar pojmov z natančno opredelitvijo vseh têrminov, ki jih boste uporabljali.
- Opredelite uporabniške vloge glede na funkcionalnosti, ki jih imajo na voljo.
- Zapišite primer uporabe za vsak osrednji cilj primarnega oz. sekundarnega naročnika.
- Pri vsakem primeru uporabe opredelitev naslov, cilj uporabnika in osnovni tok. Izberite opisne naslove primerov uporabe.
- Pri alternativnih tokih dogodkov na vašem seznamu želja za implementacijo določite zgolj naslov, opis v enem stavku in kako se alternativni tok povezuje s pripadajočim osnovnim tokom.
- Narišite **diagram primerov uporabe** ([Use Case Diagram](https://plantuml.com/use-case-diagram), izvorna koda :bar_chart: [PlantUML](./gradivo/plantuml/DPU.puml))

  ![DPU](https://teaching.lavbic.net/plantuml/svg/VP9DJiCm48NtFiKeRCWYbP8c4c9HzGTOLofXWTYuoJGrTUngOgj8m64u3FV2ZbCf0jIDfRptlPdesVFES3AsbN2tBXdh3a8TEV4MjhmwDAIjgYijDO4XhZfdeJ8ZgiOTjz8yufjPID6erjbGkGDfHDaEAzuXl3COpLtrSqzxOT3hccgae5qL3ykR-vLJEP4-1N4hNP9zZiRoocXQZd81-Gtykv19t1am6aWqUmEr8AoCq8gnFWHHUTJ4jqeS88rWiO4o_UjamSdEphDLNBsA5zM9pc0x93SfOtuwLur4Y9xuznS48EeRERSJhKcqI2_AzWjmYA_TvWjGDa3P9MWwGDDBK3v0-IMe6A32tGGhCqXyZyd7pFV3oXII6LoxFuvxBtnaCNDd7aDIwvDocY_4ATCO9lOu6G9m2-uHeQgzLJWh6BatXAgahN5malxA_CumdCrTohtW7m00)

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
