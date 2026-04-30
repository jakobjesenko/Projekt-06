import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (!this.auth.isLoggedIn) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: state.url }
      });
      return false;
    }

    const requiredRole = route.data['role'];

    // Only check role if currentUser is already loaded.
    // On page refresh, token exists first, user data loads shortly after.
    if (
      requiredRole &&
      this.auth.currentUser &&
      this.auth.currentUser.role !== requiredRole
    ) {
      this.router.navigate(['/dashboard']);
      return false;
    }

    if (this.auth.currentUser?.status === 'blocked') {
      this.auth.logout(false);
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }
}