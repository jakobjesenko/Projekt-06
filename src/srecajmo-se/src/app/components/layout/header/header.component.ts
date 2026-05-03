import { Component, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { AuthService, User } from '../../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnDestroy {
  user: User | null = null;
  private sub?: Subscription;

  constructor(private router: Router, private auth: AuthService) {
    this.user = this.auth.currentUser;
    this.sub = this.auth.currentUser$.subscribe(u => this.user = u);
  }

  get isAdmin(): boolean {
    return this.auth.isAdmin;
  }

  logout(): void {
    this.auth.logout();
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}