import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  errorMessage = '';
  successMessage = '';
  showPassword = false;
  requiresEmailVerification = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.requiresEmailVerification = false;

    if (!this.email.trim() || !this.password) {
      this.errorMessage = 'Email/uporabniško ime in geslo sta obvezna.';
      return;
    }

    this.loading = true;

    this.authService.login(this.email.trim(), this.password).subscribe({
      next: (res) => {
        this.loading = false;
        this.successMessage = res.message || 'Prijava uspešna!';

        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 600);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Napaka pri prijavi.';
        this.requiresEmailVerification = !!err.error?.requiresEmailVerification;
      }
    });
  }

  resendVerification(): void {
    if (!this.email.trim()) {
      this.errorMessage = 'Vnesite email naslov.';
      return;
    }

    this.loading = true;
    this.authService.resendVerification(this.email.trim()).subscribe({
      next: (res) => {
        this.loading = false;
        this.successMessage = res.message;
        this.errorMessage = '';
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Napaka pri pošiljanju emaila.';
      }
    });
  }
}