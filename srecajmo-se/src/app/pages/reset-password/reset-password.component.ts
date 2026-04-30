import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent implements OnInit {
  token = '';
  newPassword = '';
  confirmPassword = '';

  loading = false;
  errorMessage = '';
  successMessage = '';
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';

    if (!this.token) {
      this.errorMessage = 'Manjka token za ponastavitev gesla.';
    }
  }

  resetPassword(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.token) {
      this.errorMessage = 'Manjka token za ponastavitev gesla.';
      return;
    }

    if (!this.newPassword || !this.confirmPassword) {
      this.errorMessage = 'Vnesite novo geslo in potrditev gesla.';
      return;
    }

    if (this.newPassword.length < 6) {
      this.errorMessage = 'Geslo mora imeti vsaj 6 znakov.';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Gesli se ne ujemata.';
      return;
    }

    this.loading = true;

    this.authService.resetPassword(this.token, this.newPassword).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.successMessage = res.message || 'Geslo uspešno ponastavljeno!';

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1200);
      },
      error: (err: any) => {
        this.loading = false;
        this.errorMessage =
          err.error?.message || 'Napaka pri ponastavitvi gesla.';
      }
    });
  }
}