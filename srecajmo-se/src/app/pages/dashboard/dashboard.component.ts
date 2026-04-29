import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface DayPart {
  key: string;
  label: string;
  range: string;
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
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  user = {
    username: 'ana_novak',
    firstName: 'Ana',
    lastName: 'Novak',
    email: 'ana.novak@email.si',
    age: 27,
    location: { lat: 46.0569, lng: 14.5058, radius: 10 },
    activeSearch: true,
    interests: ['Kolesarjenje', 'Fotografija', 'Kuhanje', 'Planinarjenje', 'Branje'],
    availability: [
      'Pon__morning', 'Pon__evening',
      'Sre__morning',
      'Pet__afternoon',
      'Sob__morning', 'Sob__afternoon',
      'Ned__morning'
    ]
  };

  readonly weekdays = ['Pon', 'Tor', 'Sre', 'Čet', 'Pet', 'Sob', 'Ned'];

  readonly dayParts: DayPart[] = [
    { key: 'morning',   label: 'Dopoldne', range: '6:00–12:00'  },
    { key: 'afternoon', label: 'Popoldne', range: '12:00–18:00' },
    { key: 'evening',   label: 'Zvečer',   range: '18:00–24:00' }
  ];

  suggestions: GroupSuggestion[] = [
    {
      name: 'Skupina Ljubljana',
      matchScore: 92,
      members: ['Tilen K.', 'Maja H.', 'Luka B.'],
      interests: ['Kolesarjenje', 'Fotografija'],
      time: 'Sob, 3. maj ob 15:00',
      location: 'Ljubljana'
    },
    {
      name: 'Pohodniška ekipa',
      matchScore: 78,
      members: ['Petra Z.', 'Miha K.'],
      interests: ['Planinarjenje', 'Fotografija'],
      time: 'Ned, 4. maj ob 9:00',
      location: 'Šmarnogorska pot'
    }
  ];

  confirmedMeetings: ConfirmedMeeting[] = [
    {
      groupName: 'Knjižni klub',
      members: ['Sara M.', 'Janez P.', 'Katja L.'],
      dateTime: 'Pon, 28. apr ob 18:00',
      location: 'Knjižnica Bežigrad'
    }
  ];

  isAvailable(day: string, part: string): boolean {
    return this.user.availability.includes(`${day}__${part}`);
  }

  toggleSearch(): void {
    this.user.activeSearch = !this.user.activeSearch;
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
