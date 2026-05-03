import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface StatCard {
  icon: string;
  value: string | number;
  label: string;
}

interface AdminUser {
  _id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  location?: { lat?: number; lng?: number; radius?: number };
  isActive: boolean;
  activeSearch: boolean;
}

@Component({
  selector: 'app-admin',
  imports: [CommonModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  stats: StatCard[] = [
    { icon: 'fas fa-users',          value: '...', label: 'Skupaj uporabnikov' },
    { icon: 'fas fa-calendar-check', value: 318,   label: 'Skupaj srečanj' },
    { icon: 'fas fa-star',           value: '4.7', label: 'Povprečna ocena' },
    { icon: 'fas fa-search',         value: '...', label: 'Aktivnih iskanj' },
  ];

  users: AdminUser[] = [];
  loading = true;
  error = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.error = '';
    this.http.get<AdminUser[]>('/api/admin/users/').subscribe({
      next: (users) => {
        this.users = users;
        this.stats[0].value = users.length;
        this.stats[3].value = users.filter(u => u.activeSearch).length;
        this.loading = false;
      },
      error: () => {
        this.error = 'Napaka pri nalaganju uporabnikov.';
        this.loading = false;
      }
    });
  }

  toggleActive(user: AdminUser): void {
    const url = user.isActive
      ? `/api/admin/users/${user._id}/deactivate`
      : `/api/admin/users/${user._id}/activate`;

    this.http.put<{ success: boolean; user: AdminUser }>(url, {}).subscribe({
      next: (res) => {
        if (res.success) {
          user.isActive = res.user.isActive;
          user.activeSearch = res.user.activeSearch;
        }
      }
    });
  }

  formatLocation(location?: { lat?: number; lng?: number }): string {
    if (!location || location.lat == null) return '—';
    return `${location.lat.toFixed(2)}, ${location.lng?.toFixed(2)}`;
  }
}
