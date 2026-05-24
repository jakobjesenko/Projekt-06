import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { RatingService } from '../../services/rating.service';

interface MeetingDetails {
  _id: string;
  groupName: string;
  date: string;
  status: 'draft' | 'upcoming' | 'completed' | 'cancelled';
  venue?: {
    address?: string;
    city?: string;
    country?: string;
    coordinates?: {
      lat?: number;
      lng?: number;
    };
  };
}

@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.css'
})
export class RatingComponent implements OnInit {
  meetingId = '';
  meeting: MeetingDetails | null = null;

  rating = 0;
  hoveredRating = 0;
  comment = '';

  loading = true;
  submitting = false;

  errorMessage = '';
  successMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private http: HttpClient,
    private ratingService: RatingService
  ) {}

  ngOnInit(): void {
    this.meetingId = this.route.snapshot.paramMap.get('meetingId') || '';

    if (!this.meetingId) {
      this.loading = false;
      this.errorMessage = 'Manjka ID srečanja.';
      return;
    }

    this.loadMeeting();
  }

  loadMeeting(): void {
    this.loading = true;
    this.errorMessage = '';

    this.http.get<MeetingDetails>(`/api/meetings/${this.meetingId}`, {
      withCredentials: true
    }).subscribe({
      next: (meeting) => {
        this.meeting = meeting;
        this.loading = false;
      },
      error: (err: any) => {
        this.loading = false;
        this.errorMessage =
          err.error?.message ||
          err.error?.error ||
          'Napaka pri nalaganju srečanja.';
      }
    });
  }

  setRating(value: number): void {
    if (this.successMessage) return;

    this.rating = value;
    this.errorMessage = '';
  }

  setHover(value: number): void {
    if (this.successMessage) return;

    this.hoveredRating = value;
  }

  clearHover(): void {
    this.hoveredRating = 0;
  }

  isStarActive(value: number): boolean {
    return value <= (this.hoveredRating || this.rating);
  }

  get commentLength(): number {
    return this.comment.length;
  }

  get groupName(): string {
    return this.meeting?.groupName || 'Srečanje';
  }

  get meetingDate(): string {
    if (!this.meeting?.date) return '';

    return new Date(this.meeting.date).toLocaleString('sl-SI', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  get meetingLocation(): string {
    if (!this.meeting?.venue) return 'Lokacija ni določena';

    const address = this.meeting.venue.address;
    const city = this.meeting.venue.city;

    if (address && city) return `${address}, ${city}`;
    if (address) return address;
    if (city) return city;

    return 'Lokacija ni določena';
  }

  get canRateMeeting(): boolean {
    if (!this.meeting?.date) return false;

    if (this.meeting.status === 'completed') return true;

    return new Date(this.meeting.date) < new Date();
  }

  canSubmit(): boolean {
    return (
      !!this.meetingId &&
      this.canRateMeeting &&
      this.rating >= 1 &&
      this.rating <= 5 &&
      this.comment.length <= 500 &&
      !this.submitting &&
      !this.successMessage
    );
  }

  submitRating(): void {

    this.errorMessage = '';
    this.successMessage = '';

    if (!this.meetingId) {
      this.errorMessage = 'Manjka ID srečanja.';
      return;
    }

    if (!this.canRateMeeting) {
      this.errorMessage = 'Srečanje lahko oceniš šele, ko je zaključeno.';
      return;
    }

    if (this.rating < 1 || this.rating > 5) {
      this.errorMessage = 'Izberi oceno od 1 do 5.';
      return;
    }

    if (this.comment.length > 500) {
      this.errorMessage = 'Komentar je predolg. Največ 500 znakov.';
      return;
    }

    this.submitting = true;

    this.ratingService.createRating({
      meeting: this.meetingId,
      rating: this.rating,
      comment: this.comment.trim()
    }).subscribe({
      next: () => {
        this.submitting = false;
        this.successMessage = 'Ocena je bila uspešno oddana.';

        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 1000);
      },
      error: (err: any) => {
        this.submitting = false;

        console.error('Napaka pri oddaji ocene:', err);

        if (err.status === 409) {
          this.successMessage = 'To srečanje si že ocenil/a.';

          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 1000);

          return;
        }

        this.errorMessage =
          err.error?.message ||
          err.error?.error ||
          'Napaka pri oddaji ocene.';
      }
    });
  }

  goBack(): void {
    this.location.back();
  }
}
