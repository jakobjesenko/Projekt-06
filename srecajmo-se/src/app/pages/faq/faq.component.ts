import { Component, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface FaqItem {
  icon: string;
  question: string;
  keywords: string;
  answerHtml: string;
  isOpen: boolean;
}

@Component({
  selector: 'app-faq',
  imports: [CommonModule, FormsModule],
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements AfterViewInit, OnDestroy {
  searchTerm = '';

  private clickHandler = (e: Event) => {
    const target = e.target as HTMLElement;
    const anchor = target.closest('a');
    if (!anchor) return;
    const href = anchor.getAttribute('href');
    if (href && href.startsWith('/')) {
      e.preventDefault();
      // navigate using router
      this.router.navigateByUrl(href).catch(() => {});
    }
  };

  items: FaqItem[] = [
    {
      icon: 'fas fa-user-plus',
      question: 'Kako se registriram?',
      keywords: 'registracija profil',
      isOpen: false,
      answerHtml: `
        <p>Registracija je preprosta in brezplačna:</p>
        <ul>
          <li>Kliknite gumb "Registracija" na začetni strani</li>
          <li>Vnesite svoj vzdevek, e-pošto in geslo</li>
          <li>Izberite vsaj 3 interese, ki vas veselijo</li>
          <li>Določite svojo lokacijo in razpoložljive termine</li>
          <li>Po potrditvi ste pripravljeni na iskanje novih prijateljev!</li>
        </ul>`
    },
    {
      icon: 'fas fa-search',
      question: 'Kako deluje iskanje skupin?',
      keywords: 'iskanje aktivacija ujemanje',
      isOpen: false,
      answerHtml: `
        <p>Naš sistem za ujemanje deluje na podlagi:</p>
        <ul>
          <li>Vaših interesov (išče ljudi s podobnimi hobiji)</li>
          <li>Lokacije (predlaga srečanja v vaši bližini)</li>
          <li>Časovne razpoložljivosti (termini, ko ste prosti)</li>
        </ul>
        <p>Ko aktivirate iskanje, vam sistem samodejno predlaga skupine z visokim odstotkom ujemanja. Predlog lahko sprejmete ali zavrnete.</p>`
    },
    {
      icon: 'fas fa-lock',
      question: 'Ali so moji podatki varni?',
      keywords: 'zasebnost varnost podatki',
      isOpen: false,
      answerHtml: `
        <p>Da, varnost vaših podatkov jemljemo zelo resno:</p>
        <ul>
          <li>Vsa gesla so šifrirana</li>
          <li>Podatki se prenašajo preko varnih povezav (SSL)</li>
          <li>Ne delimo vaših podatkov s tretjimi osebami brez vaše privolitve</li>
          <li>Sledimo GDPR predpisom za varstvo osebnih podatkov</li>
        </ul>
        <p>Več o tem si lahko preberete v našem <a href="/gdpr" style="color: #a78bfa;">GDPR dokumentu</a>.</p>`
    },
    {
      icon: 'fas fa-calendar-alt',
      question: 'Kako poteka srečanje?',
      keywords: 'srečanje skupina lokacija',
      isOpen: false,
      answerHtml: `
        <p>Srečanja organizirajo uporabniki sami:</p>
        <ul>
          <li>Sistem vam predlaga skupino in termin</li>
          <li>Ko sprejmete predlog, se srečanje doda med vaša potrjena srečanja</li>
          <li>V skupinskem klepetu se lahko dogovorite za podrobnosti</li>
          <li>Srečanja priporočamo na javnih mestih (kavarne, parki, knjižnice)</li>
          <li>Po srečanju lahko ocenite izkušnjo in podate povratno informacijo</li>
        </ul>`
    },
    {
      icon: 'fas fa-euro-sign',
      question: 'Koliko stane uporaba?',
      keywords: 'cena brezplačno',
      isOpen: false,
      answerHtml: `
        <p>Srečajmo se je popolnoma brezplačna storitev! 🎉</p>
        <p>Ni skritih stroškov, naročnin ali premium funkcij. Verjamemo, da bi moralo povezovanje ljudi biti dostopno vsem.</p>`
    },
    {
      icon: 'fas fa-user-edit',
      question: 'Kako spremenim svoj profil?',
      keywords: 'profil uredi sprememba',
      isOpen: false,
      answerHtml: `
        <p>Svoj profil lahko kadar koli uredite:</p>
        <ul>
          <li>Prijavite se v svoj račun</li>
          <li>Kliknite gumb "Uredi profil" v stranski vrstici</li>
          <li>Spremenite želene podatke (ime, interese, lokacijo, termine)</li>
          <li>Shranite spremembe</li>
        </ul>`
    },
    {
      icon: 'fas fa-trash-alt',
      question: 'Kako izbrišem svoj račun?',
      keywords: 'izbris račun odstranitev',
      isOpen: false,
      answerHtml: `
        <p>Če želite izbrisati svoj račun, nas kontaktirajte na <a href="mailto:info@srecajmose.si" style="color: #a78bfa;">info@srecajmose.si</a>. Po prejemu zahteve bomo vaš račun trajno izbrisali v roku 30 dni.</p>
        <p>Pred izbrisom priporočamo, da izvozite svoje podatke, če jih želite shraniti.</p>`
    },
    {
      icon: 'fas fa-key',
      question: 'Pozabil/a sem geslo. Kaj naj storim?',
      keywords: 'prijava geslo pozabljeno',
      isOpen: false,
      answerHtml: `
        <p>Brez skrbi! Kliknite "Pozabljeno geslo?" na prijavni strani, vnesite svoj e-poštni naslov in poslali vam bomo povezavo za ponastavitev gesla.</p>`
    },
    {
      icon: 'fas fa-ban',
      question: 'Kaj storim, če me nekdo nadleguje?',
      keywords: 'blokiranje prijava zloraba',
      isOpen: false,
      answerHtml: `
        <p>Vaša varnost je naša prioriteta. V primeru neprimernega vedenja:</p>
        <ul>
          <li>Nemudoma prekinite komunikacijo z osebo</li>
          <li>Prijavite uporabnika na <a href="mailto:prijava@srecajmose.si" style="color: #a78bfa;">prijava@srecajmose.si</a></li>
          <li>Priložite dokaze (posnetke zaslona, sporočila)</li>
        </ul>
        <p>Vašo prijavo bomo obravnavali zaupno in ustrezno ukrepali (opozorilo, začasna ali trajna prepoved).</p>`
    },
    {
      icon: 'fas fa-handshake',
      question: 'Kako lahko podjetje sodeluje z vami?',
      keywords: 'podjetje sodelovanje partner',
      isOpen: false,
      answerHtml: `
        <p>Veseli smo sodelovanja s podjetji, ki delijo našo vizijo povezovanja ljudi. Kontaktirajte nas na <a href="mailto:partnerji@srecajmose.si" style="color: #a78bfa;">partnerji@srecajmose.si</a> za več informacij o možnostih sodelovanja.</p>`
    }
  ];

  get filteredItems(): FaqItem[] {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) return this.items;
    return this.items.filter(item =>
      item.question.toLowerCase().includes(term) ||
      item.keywords.toLowerCase().includes(term)
    );
  }

  toggle(item: FaqItem): void {
    item.isOpen = !item.isOpen;
  }

  constructor(private router: Router, private elRef: ElementRef) {}

  ngAfterViewInit(): void {
    this.elRef.nativeElement.addEventListener('click', this.clickHandler);
  }

  ngOnDestroy(): void {
    this.elRef.nativeElement.removeEventListener('click', this.clickHandler);
  }
}
