import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

interface Interest {
  name: string;
  icon: string;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  currentStep = 1;
  totalSteps = 3;

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
    { name: 'Potovanja', icon: 'fa-plane' }
  ];

  selectedInterests: string[] = [];
  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      birthday: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      passwordConfirm: ['', Validators.required],
      terms: [false, Validators.requiredTrue],

      locationLat: [''],
      locationLng: [''],
      locationRadius: [5],
      availability: this.fb.array([])
    });
  }

  get availability(): FormArray {
    return this.registerForm.get('availability') as FormArray;
  }

  toggleInterest(name: string): void {
    if (this.selectedInterests.includes(name)) {
      this.selectedInterests = this.selectedInterests.filter(i => i !== name);
    } else {
      this.selectedInterests.push(name);
    }
  }

  isSelected(name: string): boolean {
    return this.selectedInterests.includes(name);
  }

  toggleAvailability(value: string): void {
    const index = this.availability.controls.findIndex(x => x.value === value);

    if (index >= 0) {
      this.availability.removeAt(index);
    } else {
      this.availability.push(this.fb.control(value));
    }
  }

  isAvailabilitySelected(value: string): boolean {
    return this.availability.value.includes(value);
  }

  nextStep(): void {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  submit(): void {
    if (this.registerForm.invalid) {
      alert('Prosimo izpolnite vsa obvezna polja.');
      return;
    }

    if (this.selectedInterests.length < 3) {
      alert('Izberi vsaj 3 interese.');
      return;
    }

    if (this.registerForm.value.password !== this.registerForm.value.passwordConfirm) {
      alert('Gesli se ne ujemata.');
      return;
    }

    const payload = {
      ...this.registerForm.value,
      interests: this.selectedInterests
    };

    this.http.post('http://localhost:3000/api/auth/register', payload)
      .subscribe({
        next: () => {
          alert('Registracija uspešna!');
          this.registerForm.reset();
          this.selectedInterests = [];
          this.currentStep = 1;
        },
        error: (err) => {
          console.error(err);
          alert('Napaka pri registraciji.');
        }
      });
  }
}