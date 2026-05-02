import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService, User } from '../../services/auth.service';

interface DayPart {
  key: string;
  label: string;
  range: string;
}

interface DashboardUser extends User {
  birthday?: string;
  age?: number;
  location?: {
    lat: number | null;
    lng: number | null;
    radius: number;
  };
  activeSearch?: boolean;
  interests?: string[];
  availability?: string[];
}

interface GroupSuggestion {
  id?: string;
  name: string;
  matchScore: number;
  members: string[];
  memberIds?: string[];
  interests: string[];
  time: string;
  location: string;
}

interface ConfirmedMeeting {
  id?: string;
  groupName: string;
  members: string[];
  dateTime: string;
  location: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  user: DashboardUser | null = null;

  loading = true;
  errorMessage = '';

  readonly weekdays = ['Pon', 'Tor', 'Sre', 'Čet', 'Pet', 'Sob', 'Ned'];

  readonly dayParts: DayPart[] = [
    { key: 'morning', label: 'Dopoldne', range: '6:00–12:00' },
    { key: 'afternoon', label: 'Popoldne', range: '12:00–18:00' },
    { key: 'evening', label: 'Zvečer', range: '18:00–24:00' }
  ];

  suggestions: GroupSuggestion[] = [];
  confirmedMeetings: ConfirmedMeeting[] = [];
  loadingSuggestions = false;

  constructor(
    private readonly authService: AuthService,
    private readonly http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadDashboardUser();
  }

  loadSuggestions(userId: string): void {
    if (!userId) return;
    this.loadingSuggestions = true;

    this.http
      .get<GroupSuggestion[]>(`/api/suggestions/${userId}`, {
        withCredentials: true
      })
      .subscribe({
        next: (data) => {
          this.suggestions = data || [];
          this.loadingSuggestions = false;
        },
        error: (err) => {
          console.error('Napaka pri nalaganju predlogov:', err);
          this.suggestions = [];
          this.loadingSuggestions = false;
        }
      });
  }

  loadDashboardUser(): void {
    this.loading = true;
    this.errorMessage = '';

    this.authService.getMe().subscribe({
      next: (res: any) => {
        const user = res.user;

        const rawAvailability = user.availability || [];
        const normalizedAvailability = this.normalizeAvailability(rawAvailability);

        const dashboardUser: DashboardUser = {
          ...user,
          id: user.id || user._id,
          age: this.calculateAge(user.birthday),
          interests: user.interests || [],
          availability: normalizedAvailability,
          activeSearch: user.activeSearch ?? false,
          location: user.location || {
            lat: null,
            lng: null,
            radius: 5
          }
        };

        this.user = dashboardUser;
        this.loading = false;

        if (dashboardUser.activeSearch && dashboardUser.id) {
          this.loadSuggestions(dashboardUser.id);
        }
      },
      error: (err: any) => {
        this.loading = false;
        this.errorMessage =
          err.error?.message || 'Napaka pri nalaganju uporabnika.';
      }
    });
  }

  calculateAge(birthday?: string): number | undefined {
    if (!birthday) return undefined;

    const birthDate = new Date(birthday);

    if (Number.isNaN(birthDate.getTime())) {
      return undefined;
    }

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();

    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  }

  normalizeAvailability(availability: string[] = []): string[] {
    const normalizedSlots: string[] = [];

    const dayMap: Record<string, string> = {
      pon: 'Pon',
      ponedeljek: 'Pon',

      tor: 'Tor',
      torek: 'Tor',

      sre: 'Sre',
      sreda: 'Sre',

      cet: 'Čet',
      cetrtek: 'Čet',

      pet: 'Pet',
      petek: 'Pet',

      sob: 'Sob',
      sobota: 'Sob',

      ned: 'Ned',
      nedelja: 'Ned'
    };

    const partMap: Record<string, string> = {
      morning: 'morning',
      jutro: 'morning',
      dopoldne: 'morning',
      dopoldan: 'morning',

      afternoon: 'afternoon',
      popoldne: 'afternoon',
      popoldan: 'afternoon',

      evening: 'evening',
      zvecer: 'evening',
      vecer: 'evening'
    };

    for (const slot of availability) {
      if (!slot) continue;

      const cleaned = slot
        .toLowerCase()
        .trim()
        .replaceAll('č', 'c')
        .replaceAll('š', 's')
        .replaceAll('ž', 'z')
        .replaceAll('_', '-')
        .replaceAll(' ', '-');

      const parts = cleaned.split('-').filter(Boolean);

      let matchedDay: string | null = null;
      let matchedPart: string | null = null;

      for (const part of parts) {
        if (dayMap[part]) {
          matchedDay = dayMap[part];
        }

        if (partMap[part]) {
          matchedPart = partMap[part];
        }
      }

      if (matchedDay && matchedPart) {
        normalizedSlots.push(`${matchedDay}__${matchedPart}`);
      }
    }

    return [...new Set(normalizedSlots)];
  }

  isAvailable(day: string, part: string): boolean {
    return this.user?.availability?.includes(`${day}__${part}`) ?? false;
  }

  toggleSearch(): void {
    if (!this.user?.id) return;

    const userId = this.user.id;
    const newState = !this.user.activeSearch;
    const endpoint = newState ? 'activate-search' : 'deactivate-search';

    this.http
      .put(`/api/admin/users/${endpoint}/${userId}`, {}, { withCredentials: true })
      .subscribe({
        next: () => {
          if (!this.user) return;
          this.user.activeSearch = newState;

          if (newState) {
            this.loadSuggestions(userId);
          } else {
            this.suggestions = [];
          }
        },
        error: (err) => {
          console.error('Napaka pri spremembi iskanja:', err);
        }
      });
  }

  getFutureMeetingDate(): Date {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    date.setHours(18, 0, 0, 0);
    return date;
  }
  
  acceptSuggestion(suggestion: GroupSuggestion): void {
    if (!this.user?.id) return;

    const memberIds = suggestion.memberIds || [];

    const payload = {
      groupName: suggestion.name,

      members: [
        {
          user: this.user.id,
          response: 'accepted',
          respondedAt: new Date()
        },
        ...memberIds.map((id) => ({
          user: id,
          response: 'pending',
          respondedAt: null
        }))
      ],

      sharedInterests: suggestion.interests || [],
      matchPercentage: suggestion.matchScore || 0,

      venue: {
        address: suggestion.location || 'Lokacija še ni določena',
        city: 'Ljubljana',
        country: 'Slovenia',
        coordinates: {
          lat: this.user.location?.lat || 46.0569,
          lng: this.user.location?.lng || 14.5058
        }
      },

      date: this.getFutureMeetingDate(),

      status: 'upcoming'
    };

    console.log('Creating meeting payload:', payload);

    this.http.post<any>('/api/meetings', payload, {
      withCredentials: true
    }).subscribe({
      next: (meeting) => {
        this.confirmedMeetings.push({
          id: meeting._id,
          groupName: meeting.groupName || suggestion.name,
          members: suggestion.members,
          dateTime: meeting.date
            ? new Date(meeting.date).toLocaleString('sl-SI')
            : suggestion.time,
          location: meeting.venue?.address || suggestion.location
        });

        this.suggestions = this.suggestions.filter(s => s !== suggestion);
      },
      error: (err) => {
        console.error('Napaka pri ustvarjanju srečanja:', err);
        console.error('Backend response:', err.error);
      }
    });
  }
}