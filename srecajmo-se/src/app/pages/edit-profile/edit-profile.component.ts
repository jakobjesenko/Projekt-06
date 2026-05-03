import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Subscription } from 'rxjs';

declare var L: any;

interface Interest {
  name: string;
  icon: string;
}

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css'
})
export class EditProfileComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  selectedInterests: string[] = [];
  locationSelected = false;
  saving = false;

  private readonly apiUrl = 'http://localhost:3000/api/auth';

  weekdays = ['Pon', 'Tor', 'Sre', 'Čet', 'Pet', 'Sob', 'Ned'];

  dayPartsWithTimes = [
    { key: 'jutro',    label: 'Zjutraj',  range: '6:00 - 9:00' },
    { key: 'dopoldan', label: 'Dopoldan', range: '9:00 - 12:00' },
    { key: 'popoldan', label: 'Popoldan', range: '12:00 - 19:00' },
    { key: 'zvecer',   label: 'Zvečer',   range: '19:00 - 00:00' }
  ];

  interestsMaster: Interest[] = [
    { name: 'Kava',         icon: 'fa-mug-hot' },
    { name: 'Pohodništvo',  icon: 'fa-mountain' },
    { name: 'Glasba',       icon: 'fa-music' },
    { name: 'Šport',        icon: 'fa-football' },
    { name: 'Filmi',        icon: 'fa-film' },
    { name: 'Potovanja',    icon: 'fa-plane' },
    { name: 'Knjige',       icon: 'fa-book' },
    { name: 'Hrana',        icon: 'fa-utensils' }
  ];

  private leafletMap: any = null;
  private mapMarker: any = null;
  private mapCircle: any = null;
  private radiusSub: Subscription | null = null;

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly http: HttpClient,
    @Inject(PLATFORM_ID) private readonly platformId: Object
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group(
      {
        firstName:       ['', Validators.required],
        lastName:        ['', Validators.required],
        username:        ['', Validators.required],
        birthday:        ['', [Validators.required, this.minimumAgeValidator(18)]],
        email:           ['', [Validators.required, Validators.email]],
        password:        [''],
        passwordConfirm: [''],
        locationLat:     [null],
        locationLng:     [null],
        locationRadius:  [5],
        availability:    this.fb.array([])
      },
      { validators: this.passwordsMatchValidator }
    );

    this.loadUserIntoForm();
    this.initMap();
  }

  ngOnDestroy(): void {
    this.radiusSub?.unsubscribe();
    if (this.leafletMap) {
      this.leafletMap.remove();
      this.leafletMap = null;
    }
  }

  get availability(): FormArray {
    return this.form.get('availability') as FormArray;
  }

  get maxBirthday(): string {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 18);
    return d.toISOString().split('T')[0];
  }

  private getStoredUser(): any | null {
    const stored =
      localStorage.getItem('user') ||
      sessionStorage.getItem('user') ||
      localStorage.getItem('currentUser') ||
      sessionStorage.getItem('currentUser');

    if (!stored) return null;

    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }

  private getLoggedInUserId(): string | null {
    const user = this.getStoredUser();

    return user?._id || user?.id || null;
  }

  private loadUserIntoForm(): void {
    const user = this.getStoredUser();

    if (!user) {
      return;
    }

    this.selectedInterests = user.interests ?? [];

    this.availability.clear();
    (user.availability ?? []).forEach((slot: string) => {
      this.availability.push(this.fb.control(slot));
    });

    const birthday = user.birthday
      ? new Date(user.birthday).toISOString().split('T')[0]
      : '';

    this.form.patchValue({
      firstName: user.firstName ?? '',
      lastName: user.lastName ?? '',
      username: user.username ?? '',
      birthday,
      email: user.email ?? '',
      locationLat: user.location?.lat ?? null,
      locationLng: user.location?.lng ?? null,
      locationRadius: user.location?.radius ?? 5
    });

    if (user.location?.lat != null && user.location?.lng != null) {
      this.locationSelected = true;
    }
  }

  minimumAgeValidator(minAge: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const birth = new Date(control.value);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
      return age >= minAge ? null : { underage: true };
    };
  }

  passwordsMatchValidator(form: AbstractControl): ValidationErrors | null {
    const pw  = form.get('password')?.value;
    const pwc = form.get('passwordConfirm')?.value;
    if (!pw && !pwc) return null;
    return pw === pwc ? null : { passwordsMismatch: true };
  }

  // Interests

  toggleInterest(name: string): void {
    this.selectedInterests = this.selectedInterests.includes(name)
      ? this.selectedInterests.filter(i => i !== name)
      : [...this.selectedInterests, name];
  }

  isSelected(name: string): boolean {
    return this.selectedInterests.includes(name);
  }

  // Availability

  toggleAvailability(value: string): void {
    const idx = this.availability.controls.findIndex(c => c.value === value);
    if (idx >= 0) {
      this.availability.removeAt(idx);
    } else {
      this.availability.push(this.fb.control(value));
    }
  }

  isAvailabilitySelected(value: string): boolean {
    return this.availability.value.includes(value);
  }

  selectWeeknights(): void {
    ['Pon', 'Tor', 'Sre', 'Čet', 'Pet'].forEach(day =>
      this.addAvailabilityIfMissing(`${day}__zvecer`)
    );
  }

  selectWeekends(): void {
    ['Sob', 'Ned'].forEach(day =>
      this.dayPartsWithTimes.forEach(part =>
        this.addAvailabilityIfMissing(`${day}__${part.key}`)
      )
    );
  }

  clearAvailability(): void {
    this.availability.clear();
  }

  private addAvailabilityIfMissing(value: string): void {
    if (!this.isAvailabilitySelected(value)) {
      this.availability.push(this.fb.control(value));
    }
  }

  // Map

  private initMap(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    setTimeout(() => {
      if (this.leafletMap || typeof L === 'undefined') return;

      this.leafletMap = L.map('editMap').setView([46.0569, 14.5058], 11);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(this.leafletMap);

      const lat = this.form.get('locationLat')?.value;
      const lng = this.form.get('locationLng')?.value;

      if (lat != null && lng != null) {
        this.placeMarker(Number(lat), Number(lng));
        this.leafletMap.setView([Number(lat), Number(lng)], 11);
      }

      this.leafletMap.on('click', (e: any) => {
        this.form.patchValue({ locationLat: e.latlng.lat, locationLng: e.latlng.lng });
        this.locationSelected = true;
        this.placeMarker(e.latlng.lat, e.latlng.lng);
      });

      this.radiusSub = this.form.get('locationRadius')!.valueChanges.subscribe(val => {
        if (this.mapCircle) this.mapCircle.setRadius(Number(val) * 1000);
      });
    }, 0);
  }

  private placeMarker(lat: number, lng: number): void {
    if (!this.leafletMap) return;
    const radiusMeters = (this.form.get('locationRadius')?.value ?? 5) * 1000;

    if (this.mapMarker) {
      this.mapMarker.setLatLng([lat, lng]);
    } else {
      this.mapMarker = L.marker([lat, lng]).addTo(this.leafletMap);
    }

    if (this.mapCircle) {
      this.mapCircle.setLatLng([lat, lng]).setRadius(radiusMeters);
    } else {
      this.mapCircle = L.circle([lat, lng], {
        radius: radiusMeters,
        color: '#818cf8',
        fillColor: '#c084fc',
        fillOpacity: 0.2,
        weight: 2
      }).addTo(this.leafletMap);
    }
  }

  // Submit

  submit(): void {
    if (this.selectedInterests.length < 3) {
      alert('Izberi vsaj 3 interese.');
      return;
    }

    if (this.form.hasError('passwordsMismatch')) {
      alert('Gesli se ne ujemata!');
      return;
    }

    const fields = ['firstName', 'lastName', 'username', 'birthday', 'email'];
    fields.forEach(f => this.form.get(f)?.markAsTouched());

    if (fields.some(f => this.form.get(f)?.invalid)) {
      alert('Popravi označena polja.');
      return;
    }

    const userId = this.getLoggedInUserId();

    if (!userId) {
      alert('Napaka: ID uporabnika ni najden. Prijavite se ponovno.');
      this.router.navigate(['/login']);
      return;
    }

    const value = this.form.value;

    const payload: any = {
      firstName: value.firstName,
      lastName: value.lastName,
      username: value.username,
      birthday: value.birthday,
      email: value.email,
      interests: this.selectedInterests,
      availability: value.availability,
      location: {
        lat: value.locationLat,
        lng: value.locationLng,
        radius: value.locationRadius
      }
    };

    if (value.password && value.password.trim()) {
      payload.password = value.password.trim();
    }

    this.saving = true;

    this.http.put<any>(
      `${this.apiUrl}/profile/${userId}`,
      payload,
      { withCredentials: true }
    ).subscribe({
      next: (res) => {
        this.saving = false;

        if (!res.success) {
          alert(res.message || 'Napaka pri posodobitvi profila.');
          return;
        }

        if (res.user) {
          localStorage.setItem('user', JSON.stringify(res.user));
        }

        alert('Profil uspešno posodobljen.');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.saving = false;
        alert(err.error?.message || 'Napaka pri posodobitvi profila.');
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/dashboard']);
  }
}