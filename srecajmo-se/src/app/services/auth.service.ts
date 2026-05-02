import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap, catchError, of } from 'rxjs';

export interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status?: string;
  profileImage?: string;
  spotifyConnected?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'jwt';
  private readonly API = '/api/auth';

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object  // ← inject platform
  ) {
    this.restoreSession();
  }

  // ─── Public getters ───────────────────────────────────────────────

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  get isLoggedIn(): boolean {
    const token = this.token;

    if (!token) return false;

    return !this.isTokenExpired(token);
  }

  get isAdmin(): boolean {
    return this.currentUserSubject.value?.role === 'admin';
  }

  get token(): string | null {
    if (!isPlatformBrowser(this.platformId)) return null;  // ← SSR guard
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // ─── Auth actions ─────────────────────────────────────────────────

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(
      `${this.API}/login`,
      { email, password },
      { withCredentials: true }
    ).pipe(
      tap(res => {
        if (res.success && res.token) {
          this.saveToken(res.token);
          this.currentUserSubject.next(res.user);
        }
      })
    );
  }

  register(data: any): Observable<any> {
    return this.http.post<any>(
      `${this.API}/register`,
      data,
      { withCredentials: true }
    ).pipe(
      tap(res => {
        if (res.success && res.token) {
          this.saveToken(res.token);
          this.currentUserSubject.next(res.user);
        }
      })
    );
  }

  logout(redirect = true): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.TOKEN_KEY);
    }

    this.currentUserSubject.next(null);

    if (redirect) {
      this.router.navigate(['/login']);
    }
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post<any>(
      `${this.API}/forgot-password`,
      { email },
      { withCredentials: true }
    );
  }

  resetPassword(token: string, newPassword: string) {
    return this.http.post<any>(
      `${this.API}/reset-password`,
      { token, newPassword },
      { withCredentials: true }
    );
  }

  getMe(): Observable<any> {
    return this.http.get<any>(
      `${this.API}/me?t=${Date.now()}`,
      { withCredentials: true }
    );
  }

  // ─── Session restore ──────────────────────────────────────────────

private restoreSession(): void {
  if (!isPlatformBrowser(this.platformId)) return;

  const tokenAtStart = this.token;

  if (!tokenAtStart) return;

  if (this.isTokenExpired(tokenAtStart)) {
    this.logout(false);
    return;
  }

  this.http.get<any>(`${this.API}/me?t=${Date.now()}`, {
    withCredentials: true
  }).pipe(
    catchError(() => {
      // Only logout if the token is still the same one that failed.
      // If user logged in meanwhile, do NOT delete the new token.
      if (this.token === tokenAtStart) {
        this.logout(false);
      }

      return of(null);
    })
  ).subscribe(res => {
    if (!res) return;

    if (res?.success && res.user) {
      if (res.user.status === 'blocked') {
        if (this.token === tokenAtStart) {
          this.logout(false);
        }
        return;
      }

      this.currentUserSubject.next(res.user);
    } else {
      if (this.token === tokenAtStart) {
        this.logout(false);
      }
    }
  });
}

  // ─── Token helpers ────────────────────────────────────────────────

  private saveToken(token: string): void {
    if (!isPlatformBrowser(this.platformId)) return;  // ← SSR guard
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  isTokenExpired(token: string): boolean {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return true;

      // JWT uses base64url encoding (chars - and _). Convert to base64 for atob.
      let b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      // Pad with '=' to make length a multiple of 4
      while (b64.length % 4) b64 += '=';

      const payload = JSON.parse(atob(b64));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }

  resendVerification(email: string) {
    return this.http.post<any>(
      `${this.API}/resend-verification`,
      { email },
      { withCredentials: true }
    );
  }
}