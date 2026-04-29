import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface StatCard {
  icon: string;
  value: string | number;
  label: string;
}

interface AdminUser {
  id: string;
  username: string;
  email: string;
  location: string;
  isActive: boolean;
}

@Component({
  selector: 'app-admin',
  imports: [CommonModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  stats: StatCard[] = [
    { icon: 'fas fa-users',         value: 142,  label: 'Skupaj uporabnikov' },
    { icon: 'fas fa-calendar-check', value: 318,  label: 'Skupaj srečanj' },
    { icon: 'fas fa-star',           value: '4.7', label: 'Povprečna ocena' },
    { icon: 'fas fa-search',         value: 27,   label: 'Aktivnih iskanj' }
  ];

  users: AdminUser[] = [
    { id: '001', username: 'ana_novak',    email: 'ana.novak@email.si',    location: 'Ljubljana', isActive: true  },
    { id: '002', username: 'miha_kralj',   email: 'miha.kralj@email.si',   location: 'Maribor',   isActive: true  },
    { id: '003', username: 'petra_kovac',  email: 'petra.kovac@email.si',  location: 'Celje',     isActive: false },
    { id: '004', username: 'luka_horvat',  email: 'luka.horvat@email.si',  location: 'Koper',     isActive: true  },
    { id: '005', username: 'maja_zupan',   email: 'maja.zupan@email.si',   location: 'Kranj',     isActive: false }
  ];
}
