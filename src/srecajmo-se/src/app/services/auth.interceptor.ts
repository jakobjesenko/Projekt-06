import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.auth.token;

    const authReq = req.clone({
      withCredentials: true,
      setHeaders: token
        ? {
            Authorization: `Bearer ${token}`
          }
        : {}
    });

    return next.handle(authReq).pipe(
      catchError((err: HttpErrorResponse) => {
        const isAuthEndpoint =
          req.url.includes('/api/auth/login') ||
          req.url.includes('/api/auth/register') ||
          req.url.includes('/api/auth/forgot-password') ||
          req.url.includes('/api/auth/reset-password') ||
          req.url.includes('/api/auth/resend-verification') ||
          req.url.includes('/api/auth/verify-email') ||
          req.url.includes('/api/auth/me');

        if ((err.status === 401 || err.status === 403) && !isAuthEndpoint) {
          this.auth.logout(false);
          this.router.navigate(['/login']);
        }

        return throwError(() => err);
      })
    );
  }
}