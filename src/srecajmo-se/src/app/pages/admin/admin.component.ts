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

interface PaginatedUsersResponse {
  success: boolean;
  data: AdminUser[];
  pagination: {
    total: number;
    page: number;
    totalPages: number;
  };
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
  searchQuery = '';
  statusFilter = '';
  currentPage = 1;
  pageSize = 30;
  totalPages = 0;
  totalUsers = 0;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(page = this.currentPage): void {
    this.loading = true;
    this.error = '';
    const safePage = page < 1 ? 1 : page;
    const params = new URLSearchParams({
      page: String(safePage),
      limit: String(this.pageSize)
    });

    if (this.searchQuery) {
      params.set('search', this.searchQuery);
    }

    if (this.statusFilter) {
      params.set('status', this.statusFilter);
    }

    const url = `/api/users/admin/?${params.toString()}`;

    this.http.get<PaginatedUsersResponse>(url).subscribe({
      next: (res) => {
        this.users = res.data;
        this.currentPage = res.pagination.page;
        this.totalPages = res.pagination.totalPages;
        this.totalUsers = res.pagination.total;
        this.stats[0].value = res.pagination.total;
        this.stats[3].value = res.data.filter(u => u.activeSearch).length;
        this.loading = false;
      },
      error: () => {
        this.error = 'Napaka pri nalaganju uporabnikov.';
        this.loading = false;
      }
    });
  }

  searchUsers(): void {
    this.currentPage = 1;
    this.loadUsers();
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.statusFilter = '';
    this.currentPage = 1;
    this.loadUsers();
  }

  goToPage(page: number): void {
    if (page < 1 || (this.totalPages > 0 && page > this.totalPages)) return;
    this.loadUsers(page);
  }

  toggleActive(user: AdminUser): void {
    const url = user.isActive
      ? `/api/users/admin/${user._id}/deactivate`
      : `/api/users/admin/${user._id}/activate`;

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
