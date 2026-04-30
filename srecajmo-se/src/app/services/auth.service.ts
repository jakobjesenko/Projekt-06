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
    return !!this.currentUserSubject.value;
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
    return this.http.post<any>(`${this.API}/login`, { email, password }).pipe(
      tap(res => {
        if (res.success && res.token) {
          this.saveToken(res.token);
          this.currentUserSubject.next(res.user);
        }
      })
    );
  }

  register(data: any): Observable<any> {
    return this.http.post<any>(`${this.API}/register`, data).pipe(
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

  // ─── Session restore ──────────────────────────────────────────────

  private restoreSession(): void {
    if (!isPlatformBrowser(this.platformId)) return;  // ← SSR guard

    const token = this.token;
    if (!token) return;

    if (this.isTokenExpired(token)) {
      this.logout();
      return;
    }

    this.http.get<any>(`${this.API}/me`).pipe(
      catchError(() => {
        this.logout();
        return of(null);
      })
    ).subscribe(res => {
      if (res?.success && res.user) {
        if (res.user.status === 'blocked') {
          this.logout();
          return;
        }
        this.currentUserSubject.next(res.user);
      } else {
        this.logout();
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
      const payload = JSON.parse(atob(token.split('.')[1]));
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