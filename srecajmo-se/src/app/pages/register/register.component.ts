import { Component, OnInit } from '@angular/core';
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
import { CommonModule } from '@angular/common';

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
export class RegisterComponent implements OnInit {
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

  constructor(private fb: FormBuilder, private http: HttpClient) {}

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
    this.registerForm.patchValue({
      locationLat: lat,
      locationLng: lng
    });
  }

  nextStep(): void {
    if (this.currentStep === 1) {
      const step1Fields = [
        'firstName',
        'lastName',
        'username',
        'birthday',
        'email',
        'password',
        'passwordConfirm',
        'terms'
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
  }

  prevStep(): void {
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
        this.registerForm.reset({
          terms: false,
          locationRadius: 5
        });
        this.clearAvailability();
        this.selectedInterests = [];
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