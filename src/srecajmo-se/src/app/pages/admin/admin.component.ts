import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
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
  strikes?: number;
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

interface SuggestionWeights {
  interests: number;
  geo: number;
  time: number;
}

interface SuggestionConfigResponse {
  success: boolean;
  config: { weights: SuggestionWeights };
}

interface RatingsAverageResponse {
  success: boolean;
  data: { average: number; count: number };
}

interface CompletedMeetingsResponse {
  success: boolean;
  data: { count: number };
}

interface ReportUserRef {
  _id: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  strikes?: number;
  status?: string;
  isActive?: boolean;
  activeSearch?: boolean;
}

interface ReportMeetingRef {
  _id: string;
  groupName?: string;
  date?: string;
}

type ReportStatus = 'new' | 'in-review' | 'resolved' | 'rejected';

interface AdminReport {
  _id: string;
  reporter: ReportUserRef | string | null;
  reportedUser: ReportUserRef | string | null;
  meeting: ReportMeetingRef | string | null;
  description: string;
  status: ReportStatus;
  createdAt: string;
  updatedAt: string;
}

interface PaginatedReportsResponse {
  success: boolean;
  data: AdminReport[];
  pagination: {
    total: number;
    page: number;
    totalPages: number;
  };
}

interface AdminRating {
  _id: string;
  user: string;
  meeting: string;
  username: string;
  groupName: string;
  rating: number;
  comment?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface PaginatedRatingsResponse {
  success: boolean;
  data: AdminRating[];
  pagination: {
    total: number;
    page: number;
    totalPages: number;
  };
}

interface AdminMeetingMember {
  user?: {
    _id?: string;
    id?: string;
    username?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  } | string;
  response?: 'pending' | 'accepted' | 'declined';
  respondedAt?: string | null;
}

interface AdminMeeting {
  _id: string;
  groupName: string;
  members: AdminMeetingMember[];
  sharedInterests?: string[];
  matchPercentage?: number;
  venue?: {
    address?: string;
    city?: string;
    country?: string;
    coordinates?: {
      lat?: number;
      lng?: number;
    };
  };
  date?: string;
  status: 'draft' | 'upcoming' | 'completed' | 'cancelled';
  createdAt?: string;
  updatedAt?: string;
}

interface PaginatedMeetingsResponse {
  success: boolean;
  data: AdminMeeting[];
  pagination: {
    total: number;
    page: number;
    totalPages: number;
  };
}

@Component({
  selector: 'app-admin',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  stats: StatCard[] = [
    { icon: 'fas fa-users',          value: '...', label: 'Skupaj uporabnikov' },
    { icon: 'fas fa-calendar-check', value: '...', label: 'Skupaj srečanj' },
    { icon: 'fas fa-star',           value: '...', label: 'Povprečna ocena' },
    { icon: 'fas fa-search',         value: '...', label: 'Aktivnih iskanj' },
  ];

activeTab: 'weights' | 'users' | 'meetings' | 'ratings' | 'reports' = 'users';

setActiveTab(tab: 'weights' | 'users' | 'meetings' | 'ratings' | 'reports'): void {
  this.activeTab = tab;

  if (tab === 'meetings' && this.meetings.length === 0) {
    this.loadMeetings();
  }

  if (tab === 'ratings' && this.ratings?.length === 0) {
    this.loadRatings?.();
  }
}

  users: AdminUser[] = [];
  loading = true;
  error = '';
  searchQuery = '';
  statusFilter = '';
  currentPage = 1;
  pageSize = 30;
  totalPages = 0;
  totalUsers = 0;

  weights: SuggestionWeights = { interests: 0.5, geo: 0.2, time: 0.3 };
  weightsLoading = false;
  weightsSaving = false;
  weightsError = '';
  weightsSuccess = '';

  reports: AdminReport[] = [];
  reportsLoading = false;
  reportsError = '';
  reportStatusFilter: '' | ReportStatus = 'new';
  reportSearch = '';
  reportsPage = 1;
  reportsPageSize = 20;
  reportsTotalPages = 0;
  reportsTotal = 0;
  reportActionInProgress: Record<string, boolean> = {};

  ratings: AdminRating[] = [];
  ratingsLoading = false;
  ratingsError = '';
  ratingsPage = 1;
  ratingsPageSize = 20;
  ratingsTotalPages = 0;
  ratingsTotal = 0;
  ratingFilter: '' | number = '';
  ratingSearch = '';

  meetings: AdminMeeting[] = [];
  meetingsLoading = false;
  meetingsError = '';
  meetingsPage = 1;
  meetingsPageSize = 20;
  meetingsTotalPages = 0;
  meetingsTotal = 0;
  meetingSearch = '';
  meetingStatusFilter = '';
  meetingActionInProgress: Record<string, boolean> = {};

  constructor(private http: HttpClient) {}

  // selection for bulk actions
  selectedIds: Set<string> = new Set();

  ngOnInit(): void {
    this.loadUsers();
    this.loadWeights();
    this.loadAverageRating();
    this.loadCompletedMeetings();
    this.loadReports();
    this.loadRatings();
    this.loadMeetings();
  }

  loadReports(page = this.reportsPage): void {
    this.reportsLoading = true;
    this.reportsError = '';

    const safePage = page < 1 ? 1 : page;
    const params = new URLSearchParams({
      page: String(safePage),
      limit: String(this.reportsPageSize),
    });

    if (this.reportStatusFilter) {
      params.set('status', this.reportStatusFilter);
    }

    if (this.reportSearch.trim()) {
      params.set('search', this.reportSearch.trim());
    }

    this.http.get<PaginatedReportsResponse>(`/api/reports?${params.toString()}`).subscribe({
      next: (res) => {
        this.reports = res.data || [];
        this.reportsPage = res.pagination.page;
        this.reportsTotalPages = res.pagination.totalPages;
        this.reportsTotal = res.pagination.total;
        this.reportsLoading = false;
      },
      error: () => {
        this.reportsError = 'Napaka pri nalaganju prijav.';
        this.reportsLoading = false;
      }
    });
  }

  onReportStatusFilterChange(): void {
    this.reportsPage = 1;
    this.loadReports();
  }

  searchReports(): void {
    this.reportsPage = 1;
    this.loadReports();
  }

  clearReportFilters(): void {
    this.reportSearch = '';
    this.reportStatusFilter = 'new';
    this.reportsPage = 1;
    this.loadReports();
  }

  goToReportsPage(page: number): void {
    if (page < 1 || (this.reportsTotalPages > 0 && page > this.reportsTotalPages)) return;
    this.loadReports(page);
  }

  updateReportStatus(report: AdminReport, status: 'resolved' | 'rejected' | 'in-review'): void {
    if (this.reportActionInProgress[report._id]) return;

    this.reportActionInProgress[report._id] = true;

    const body = new URLSearchParams();
    body.set('status', status);

    this.http.put<{ success: boolean; data: AdminReport }>(
      `/api/reports/${report._id}/status`,
      body.toString(),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    ).subscribe({
      next: () => {
        this.reportActionInProgress[report._id] = false;
        this.loadReports();
        // Refresh user list so the strike/deactivation change is visible
        if (status === 'resolved') {
          this.loadUsers();
        }
      },
      error: () => {
        this.reportActionInProgress[report._id] = false;
        this.reportsError = 'Napaka pri posodabljanju statusa prijave.';
      }
    });
  }

  getReportUserLabel(ref: ReportUserRef | string | null): string {
    if (!ref) return '—';
    if (typeof ref === 'string') return ref;
    return ref.username || `${ref.firstName || ''} ${ref.lastName || ''}`.trim() || ref._id;
  }

  getReportUserStrikes(ref: ReportUserRef | string | null): number | string {
    if (!ref || typeof ref === 'string') return '—';
    return ref.strikes ?? 0;
  }

  getReportMeetingLabel(ref: ReportMeetingRef | string | null): string {
    if (!ref) return '—';
    if (typeof ref === 'string') return ref;
    return ref.groupName || ref._id;
  }

  getReportStatusLabel(status: ReportStatus): string {
    switch (status) {
      case 'new': return 'Nova';
      case 'in-review': return 'V pregledu';
      case 'resolved': return 'Potrjena';
      case 'rejected': return 'Zavrnjena';
      default: return status;
    }
  }

  getReportStatusClass(status: ReportStatus): string {
    switch (status) {
      case 'new': return 'report-status-new';
      case 'in-review': return 'report-status-review';
      case 'resolved': return 'report-status-resolved';
      case 'rejected': return 'report-status-rejected';
      default: return '';
    }
  }

  loadCompletedMeetings(): void {
    this.http.get<CompletedMeetingsResponse>('/api/meetings/stats/completed').subscribe({
      next: (res) => {
        if (res.success) {
          this.stats[1].value = res.data.count;
        }
      },
      error: () => {
        this.stats[1].value = '—';
      }
    });
  }

  loadAverageRating(): void {
    this.http.get<RatingsAverageResponse>('/api/ratings/average').subscribe({
      next: (res) => {
        if (res.success) {
          const avg = res.data.average;
          this.stats[2].value = res.data.count > 0 ? avg.toFixed(1) : '—';
        }
      },
      error: () => {
        this.stats[2].value = '—';
      }
    });
  }

  loadWeights(): void {
    this.weightsLoading = true;
    this.weightsError = '';
    this.http.get<SuggestionConfigResponse>('/api/suggestions/config').subscribe({
      next: (res) => {
        if (res.success) {
          this.weights = { ...res.config.weights };
        }
        this.weightsLoading = false;
      },
      error: () => {
        this.weightsError = 'Napaka pri nalaganju uteži.';
        this.weightsLoading = false;
      }
    });
  }

  saveWeights(): void {
    this.weightsSaving = true;
    this.weightsError = '';
    this.weightsSuccess = '';

    const values = [this.weights.interests, this.weights.geo, this.weights.time];
    if (values.some(v => typeof v !== 'number' || Number.isNaN(v) || v < 0 || v > 1)) {
      this.weightsError = 'Uteži morajo biti števila med 0 in 1.';
      this.weightsSaving = false;
      return;
    }

    const sum = values.reduce((a, b) => a + b, 0);
    if (sum <= 0) {
      this.weightsError = 'Vsota uteži mora biti večja od 0.';
      this.weightsSaving = false;
      return;
    }

    this.http.put<SuggestionConfigResponse>('/api/suggestions/config', {
      weights: this.weights
    }).subscribe({
      next: (res) => {
        if (res.success) {
          this.weights = { ...res.config.weights };
          this.weightsSuccess = 'Uteži uspešno posodobljene (normalizirane na vsoto 1).';
        }
        this.weightsSaving = false;
      },
      error: (err) => {
        this.weightsError = err?.error?.message || 'Napaka pri shranjevanju uteži.';
        this.weightsSaving = false;
      }
    });
  }

  resetWeights(): void {
    this.weights = { interests: 0.5, geo: 0.2, time: 0.3 };
    this.weightsSuccess = '';
    this.weightsError = '';
  }

  get weightsSum(): number {
    return (this.weights.interests || 0) + (this.weights.geo || 0) + (this.weights.time || 0);
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

  toggleSelect(user: AdminUser): void {
    if (this.selectedIds.has(user._id)) this.selectedIds.delete(user._id);
    else this.selectedIds.add(user._id);
  }

  toggleSelectAll(ev: Event): void {
    const checked = (ev.target as HTMLInputElement).checked;
    if (checked) {
      this.users.forEach(u => this.selectedIds.add(u._id));
    } else {
      this.selectedIds.clear();
    }
  }

  bulkActivate(): void {
    const ids = Array.from(this.selectedIds);
    ids.forEach(id => {
      const user = this.users.find(u => u._id === id);
      if (user && !user.isActive) {
        this.http.put(`/api/users/admin/${id}/activate`, {}).subscribe((res: any) => {
          if (res?.success) user.isActive = true;
        });
      }
    });
  }

  bulkDeactivate(): void {
    const ids = Array.from(this.selectedIds);
    ids.forEach(id => {
      const user = this.users.find(u => u._id === id);
      if (user && user.isActive) {
        this.http.put(`/api/users/admin/${id}/deactivate`, {}).subscribe((res: any) => {
          if (res?.success) user.isActive = false;
        });
      }
    });
  }

  formatLocation(location?: { lat?: number; lng?: number }): string {
    if (!location || location.lat == null) return '—';
    return `${location.lat.toFixed(2)}, ${location.lng?.toFixed(2)}`;
  }

  loadRatings(page = this.ratingsPage): void {
    this.ratingsLoading = true;
    this.ratingsError = '';

    const safePage = page < 1 ? 1 : page;

    const params = new URLSearchParams({
      page: String(safePage),
      limit: String(this.ratingsPageSize)
    });

    if (this.ratingFilter) {
      params.set('rating', String(this.ratingFilter));
    }

    if (this.ratingSearch.trim()) {
      params.set('search', this.ratingSearch.trim());
    }

    this.http.get<PaginatedRatingsResponse>(`/api/ratings?${params.toString()}`).subscribe({
      next: (res) => {
        this.ratings = res.data || [];
        this.ratingsPage = res.pagination.page;
        this.ratingsTotalPages = res.pagination.totalPages;
        this.ratingsTotal = res.pagination.total;
        this.ratingsLoading = false;
      },
      error: (err) => {
        console.error('Napaka pri nalaganju ocen:', err);
        this.ratingsError = 'Napaka pri nalaganju ocen.';
        this.ratingsLoading = false;
      }
    });
  }

  searchRatings(): void {
    this.ratingsPage = 1;
    this.loadRatings();
  }

  clearRatingFilters(): void {
    this.ratingFilter = '';
    this.ratingSearch = '';
    this.ratingsPage = 1;
    this.loadRatings();
  }

  goToRatingsPage(page: number): void {
    if (page < 1 || (this.ratingsTotalPages > 0 && page > this.ratingsTotalPages)) return;
    this.loadRatings(page);
  }

  getStars(rating: number): string {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  }

  loadMeetings(page = this.meetingsPage): void {
    this.meetingsLoading = true;
    this.meetingsError = '';

    const safePage = page < 1 ? 1 : page;

    const params = new URLSearchParams({
      page: String(safePage),
      limit: String(this.meetingsPageSize)
    });

    if (this.meetingSearch.trim()) {
      params.set('search', this.meetingSearch.trim());
    }

    if (this.meetingStatusFilter) {
      params.set('status', this.meetingStatusFilter);
    }

    this.http.get<PaginatedMeetingsResponse>(`/api/meetings?${params.toString()}`).subscribe({
      next: (res) => {
        this.meetings = res.data || [];
        this.meetingsPage = res.pagination.page;
        this.meetingsTotalPages = res.pagination.totalPages;
        this.meetingsTotal = res.pagination.total;
        this.stats[1].value = res.pagination.total;
        this.meetingsLoading = false;
      },
      error: (err) => {
        console.error('Napaka pri nalaganju srečanj:', err);
        this.meetingsError = 'Napaka pri nalaganju srečanj.';
        this.meetingsLoading = false;
      }
    });
  }

  searchMeetings(): void {
    this.meetingsPage = 1;
    this.loadMeetings();
  }

  clearMeetingFilters(): void {
    this.meetingSearch = '';
    this.meetingStatusFilter = '';
    this.meetingsPage = 1;
    this.loadMeetings();
  }

  goToMeetingsPage(page: number): void {
    if (page < 1 || (this.meetingsTotalPages > 0 && page > this.meetingsTotalPages)) return;
    this.loadMeetings(page);
  }

  deleteMeeting(meeting: AdminMeeting): void {
    if (!confirm(`Ali želiš izbrisati srečanje "${meeting.groupName}"?`)) {
      return;
    }

    this.meetingActionInProgress[meeting._id] = true;

    this.http.delete(`/api/meetings/${meeting._id}`).subscribe({
      next: () => {
        this.meetingActionInProgress[meeting._id] = false;
        this.loadMeetings();
      },
      error: (err) => {
        console.error('Napaka pri brisanju srečanja:', err);
        this.meetingActionInProgress[meeting._id] = false;
        this.meetingsError = 'Napaka pri brisanju srečanja.';
      }
    });
  }

  getMeetingMembers(meeting: AdminMeeting): string {
    const members = meeting.members || [];

    if (members.length === 0) return '—';

    return members.map((member) => {
      const user = member.user;

      if (typeof user === 'object' && user !== null) {
        return user.username ||
          `${user.firstName || ''} ${user.lastName || ''}`.trim() ||
          user._id ||
          'Uporabnik';
      }

      return user || 'Uporabnik';
    }).join(', ');
  }

  getMeetingLocation(meeting: AdminMeeting): string {
    const venue = meeting.venue;

    if (!venue) return '—';

    if (venue.address && venue.city) {
      return `${venue.address}, ${venue.city}`;
    }

    if (venue.address) return venue.address;
    if (venue.city) return venue.city;

    return '—';
  }

  getMeetingDate(meeting: AdminMeeting): string {
    if (!meeting.date) return '—';

    return new Date(meeting.date).toLocaleString('sl-SI', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getMeetingStatusLabel(status: string): string {
    switch (status) {
      case 'draft': return 'Osnutek';
      case 'upcoming': return 'Prihajajoče';
      case 'completed': return 'Končano';
      case 'cancelled': return 'Preklicano';
      default: return status || '—';
    }
  }

  getMeetingStatusClass(status: string): string {
    switch (status) {
      case 'draft': return 'meeting-status-draft';
      case 'upcoming': return 'meeting-status-upcoming';
      case 'completed': return 'meeting-status-completed';
      case 'cancelled': return 'meeting-status-cancelled';
      default: return '';
    }
  }
}
