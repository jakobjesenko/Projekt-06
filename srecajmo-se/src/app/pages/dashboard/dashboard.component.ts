import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
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
  name: string;
  matchScore: number;
  members: string[];
  interests: string[];
  time: string;
  location: string;
}

interface ConfirmedMeeting {
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

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadDashboardUser();
  }

  loadDashboardUser(): void {
    this.loading = true;
    this.errorMessage = '';

    this.authService.getMe().subscribe({
      next: (res: any) => {
        const user = res.user;

        const rawAvailability = user.availability || [];
        const normalizedAvailability = this.normalizeAvailability(rawAvailability);

        this.user = {
          ...user,
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

        this.loading = false;
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
    if (!this.user) return;

    this.user.activeSearch = !this.user.activeSearch;

    // Later this should call backend
  }

  acceptSuggestion(suggestion: GroupSuggestion): void {
    this.confirmedMeetings.push({
      groupName: suggestion.name,
      members: suggestion.members,
      dateTime: suggestion.time,
      location: suggestion.location
    });

    this.suggestions = this.suggestions.filter(s => s !== suggestion);
  }
}