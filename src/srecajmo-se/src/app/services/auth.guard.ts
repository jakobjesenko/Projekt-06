import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    // If rendering on the server, allow the route so the client can restore
    // the session after hydration. Avoid redirecting to `/login` during SSR.
    if (!isPlatformBrowser(this.platformId)) {
      return true;
    }

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