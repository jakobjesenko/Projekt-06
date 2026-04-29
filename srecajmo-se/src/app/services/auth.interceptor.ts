import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.auth.token;

    // Attach Bearer token if it exists (mirrors your "Authorization: Bearer" check)
    const authReq = token
      ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : req;

    return next.handle(authReq).pipe(
      catchError((err: HttpErrorResponse) => {
        // Mirror your backend's 401 responses → redirect to login
        if (err.status === 401) {
          this.auth.logout();
          this.router.navigate(['/login']);
        }
        // Mirror your backend's 403 (blocked user)
        if (err.status === 403) {
          this.auth.logout();
          this.router.navigate(['/login'], {
            queryParams: { reason: 'blocked' }
          });
        }
        return throwError(() => err);
      })
    );
  }
}