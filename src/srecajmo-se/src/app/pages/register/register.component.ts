import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';

declare var L: any;

interface Interest {
  name: string;
  icon: string;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {
  currentStep = 1;
  totalSteps = 3;
  isSubmitting = false;

  apiUrl = 'http://localhost:3000/api/auth/register';

  weekdays = ['Pon', 'Tor', 'Sre', 'Čet', 'Pet', 'Sob', 'Ned'];

  dayPartsWithTimes = [
    { key: 'jutro', label: 'Zjutraj', range: '6:00 - 9:00' },
    { key: 'dopoldan', label: 'Dopoldan', range: '9:00 - 12:00' },
    { key: 'popoldan', label: 'Popoldan', range: '12:00 - 19:00' },
    { key: 'zvecer', label: 'Zvečer', range: '19:00 - 00:00' }
  ];

  interestsMaster: Interest[] = [
    { name: 'Kava', icon: 'fa-mug-hot' },
    { name: 'Pohodništvo', icon: 'fa-mountain' },
    { name: 'Glasba', icon: 'fa-music' },
    { name: 'Šport', icon: 'fa-football' },
    { name: 'Filmi', icon: 'fa-film' },
    { name: 'Potovanja', icon: 'fa-plane' },
    { name: 'Knjige', icon: 'fa-book' },
    { name: 'Hrana', icon: 'fa-utensils' }
  ];

  selectedInterests: string[] = [];
  registerForm!: FormGroup;
  locationSelected = false;

  private leafletMap: any = null;
  private mapMarker: any = null;
  private mapCircle: any = null;
  private radiusSub: Subscription | null = null;

  constructor(
    private readonly fb: FormBuilder,
    private readonly http: HttpClient,
    @Inject(PLATFORM_ID) private readonly platformId: Object
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group(
      {
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        username: ['', Validators.required],
        birthday: ['', [Validators.required, this.minimumAgeValidator(18)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        passwordConfirm: ['', Validators.required],
        terms: [false, Validators.requiredTrue],

        locationLat: [null, Validators.required],
        locationLng: [null, Validators.required],
        locationRadius: [5, Validators.required],
        availability: this.fb.array([], Validators.required)
      },
      { validators: this.passwordsMatchValidator }
    );
  }

  ngOnDestroy(): void {
    this.destroyMap();
  }

  get availability(): FormArray {
    return this.registerForm.get('availability') as FormArray;
  }

  minimumAgeValidator(minAge: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const birthDate = new Date(control.value);
      const today = new Date();

      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      return age >= minAge ? null : { underage: true };
    };
  }

  passwordsMatchValidator(form: AbstractControl): ValidationErrors | null {
    const password = form.get('password')?.value;
    const confirm = form.get('passwordConfirm')?.value;

    return password === confirm ? null : { passwordsMismatch: true };
  }

  toggleInterest(name: string): void {
    this.selectedInterests = this.selectedInterests.includes(name)
      ? this.selectedInterests.filter(i => i !== name)
      : [...this.selectedInterests, name];
  }

  isSelected(name: string): boolean {
    return this.selectedInterests.includes(name);
  }

  toggleAvailability(value: string): void {
    const index = this.availability.controls.findIndex(c => c.value === value);

    if (index >= 0) {
      this.availability.removeAt(index);
    } else {
      this.availability.push(this.fb.control(value));
    }

    this.availability.markAsTouched();
  }

  isAvailabilitySelected(value: string): boolean {
    return this.availability.value.includes(value);
  }

  selectWeeknights(): void {
    ['Pon', 'Tor', 'Sre', 'Čet', 'Pet'].forEach(day => {
      this.addAvailability(`${day}__zvecer`);
    });
  }

  selectWeekends(): void {
    ['Sob', 'Ned'].forEach(day => {
      this.dayPartsWithTimes.forEach(part => {
        this.addAvailability(`${day}__${part.key}`);
      });
    });
  }

  clearAvailability(): void {
    this.availability.clear();
  }

  private addAvailability(value: string): void {
    if (!this.isAvailabilitySelected(value)) {
      this.availability.push(this.fb.control(value));
    }
  }

  setLocation(lat: number, lng: number): void {
    this.registerForm.patchValue({ locationLat: lat, locationLng: lng });
    this.locationSelected = true;
    this.placeMarker(lat, lng, true);
  }

  private placeMarker(lat: number, lng: number, panTo: boolean): void {
    if (!this.leafletMap) return;

    const radiusMeters = (this.registerForm.get('locationRadius')?.value ?? 5) * 1000;

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
        color: '#e91e8c',
        fillColor: '#e91e8c',
        fillOpacity: 0.15,
        weight: 2
      }).addTo(this.leafletMap);
    }

    if (panTo) {
      this.leafletMap.setView([lat, lng], 12);
    }
  }

  private initMap(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    setTimeout(() => {
      if (this.leafletMap || typeof L === 'undefined') return;

      this.leafletMap = L.map('map').setView([46.0569, 14.5058], 11);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18
      }).addTo(this.leafletMap);

      const currentLat = this.registerForm.get('locationLat')?.value;
      const currentLng = this.registerForm.get('locationLng')?.value;
      if (currentLat && currentLng) {
        this.placeMarker(currentLat, currentLng, false);
      }

      this.leafletMap.on('click', (e: any) => {
        this.registerForm.patchValue({ locationLat: e.latlng.lat, locationLng: e.latlng.lng });
        this.locationSelected = true;
        this.placeMarker(e.latlng.lat, e.latlng.lng, false);
      });

      this.radiusSub = this.registerForm.get('locationRadius')!.valueChanges.subscribe(val => {
        if (this.mapCircle) {
          this.mapCircle.setRadius(Number(val) * 1000);
        }
      });
    }, 0);
  }

  private destroyMap(): void {
    this.radiusSub?.unsubscribe();
    this.radiusSub = null;
    if (this.leafletMap) {
      this.leafletMap.remove();
      this.leafletMap = null;
      this.mapMarker = null;
      this.mapCircle = null;
    }
  }

  nextStep(): void {
    if (this.currentStep === 1) {
      const step1Fields = [
        'firstName', 'lastName', 'username', 'birthday',
        'email', 'password', 'passwordConfirm', 'terms'
      ];

      step1Fields.forEach(field => this.registerForm.get(field)?.markAsTouched());

      if (
        step1Fields.some(field => this.registerForm.get(field)?.invalid) ||
        this.registerForm.hasError('passwordsMismatch')
      ) {
        alert('Popravi podatke na prvem koraku.');
        return;
      }
    }

    if (this.currentStep === 2 && this.selectedInterests.length < 3) {
      alert('Izberi vsaj 3 interese.');
      return;
    }

    this.currentStep++;

    if (this.currentStep === 3) {
      this.initMap();
    }
  }

  prevStep(): void {
    if (this.currentStep === 3) {
      this.destroyMap();
    }
    this.currentStep--;
  }

  submit(): void {
    if (this.selectedInterests.length < 3) {
      alert('Izberi vsaj 3 interese.');
      return;
    }

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      alert('Prosimo izpolnite vsa obvezna polja.');
      return;
    }

    const formValue = this.registerForm.value;

    const payload = {
      email: formValue.email,
      username: formValue.username,
      password: formValue.password,
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      birthday: formValue.birthday,
      terms: formValue.terms,
      interests: this.selectedInterests,
      availability: formValue.availability,
      locationLat: Number(formValue.locationLat),
      locationLng: Number(formValue.locationLng),
      locationRadius: Number(formValue.locationRadius)
    };

    this.isSubmitting = true;

    this.http.post<any>(this.apiUrl, payload).subscribe({
      next: res => {
        alert(res.message || 'Registracija uspešna! Preveri email.');
        this.registerForm.reset({ terms: false, locationRadius: 5 });
        this.clearAvailability();
        this.selectedInterests = [];
        this.locationSelected = false;
        this.currentStep = 1;
        this.isSubmitting = false;
      },
      error: err => {
        alert(err.error?.message || 'Napaka pri registraciji.');
        this.isSubmitting = false;
      }
    });
  }
}
