import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (!this.auth.isLoggedIn) {
      this.router.navigate(['/login']);
      return false;
    }

    // Mirrors your restrictTo() middleware — check required roles
    const requiredRole = route.data['role'];
    if (requiredRole && this.auth.currentUser?.role !== requiredRole) {
      this.router.navigate(['/']);
      return false;
    }

    // Mirror blocked status check
    if (this.auth.currentUser?.status === 'blocked') {
      this.auth.logout();
      return false;
    }

    return true;
  }
}