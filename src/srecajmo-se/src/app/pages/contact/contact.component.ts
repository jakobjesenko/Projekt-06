<<<<<<< HEAD
import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  imports: [],
=======
import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

import { ContactService } from '../../services/contact.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
>>>>>>> development
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
<<<<<<< HEAD
=======
  name = '';
  lastName = '';
  email = '';
  subject = '';
  message = '';

  loading = false;
  success = false;
  error = '';

  readonly subjectOptions = [
    'Težave z registracijo',
    'Težave s prijavo',
    'Splošno vprašanje',
    'Drugo'
  ];

  constructor(
    private readonly contactService: ContactService,
    private readonly location: Location
  ) {}

  submitForm(form: NgForm): void {
    const payload = {
      name: this.name.trim(),
      lastName: this.lastName.trim(),
      email: this.email.trim(),
      subject: this.subject.trim(),
      message: this.message.trim()
    };

    if (!payload.name || !payload.lastName || !payload.email || !payload.subject || !payload.message) {
      this.error = 'Prosim, izpolnite vsa polja.';
      this.success = false;
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = false;

    this.contactService.sendContactMessage(payload).subscribe({
      next: () => {
        this.success = true;
        this.loading = false;
        this.name = '';
        this.lastName = '';
        this.email = '';
        this.subject = '';
        this.message = '';
        form.resetForm({
          name: '',
          lastName: '',
          email: '',
          subject: '',
          message: ''
        });
      },
      error: (err) => {
        this.error = `Napaka pri pošiljanju sporočila: ${err.message}`;
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.location.back();
  }
>>>>>>> development

}
