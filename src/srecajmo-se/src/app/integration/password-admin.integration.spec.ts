import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { PLATFORM_ID } from '@angular/core';

import { ForgotPasswordComponent } from '../pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from '../pages/reset-password/reset-password.component';
import { AuthGuard } from '../services/auth.guard';
import { AuthService } from '../services/auth.service';
import { Component } from '@angular/core';

@Component({ template: '', standalone: true })
class DummyComponent {}

describe('Forgot/Reset and Admin-role integration', () => {
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        DummyComponent,
        RouterTestingModule.withRoutes([
          { path: 'login', component: DummyComponent },
          { path: 'dashboard', component: DummyComponent },
          { path: 'admin', component: DummyComponent, canActivate: [AuthGuard] },
          { path: 'forgot-password', component: ForgotPasswordComponent },
          { path: 'reset-password', component: ResetPasswordComponent }
        ])
      ],
      providers: [
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });

    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('forgot-password sends request and shows success', fakeAsync(() => {
    const fixture = TestBed.createComponent(ForgotPasswordComponent);
    const comp = fixture.componentInstance;

    fixture.detectChanges();

    comp.email = 'test@example.com';
    comp.sendResetLink();

    const req = httpMock.expectOne('/api/auth/forgot-password');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: 'test@example.com' });

    req.flush({ success: true, message: 'Email sent' });
    tick();

    expect(comp.successMessage).toContain('Email sent');
  }));

  it('reset-password posts token and navigates to login on success', fakeAsync(() => {
    const fixture = TestBed.createComponent(ResetPasswordComponent);
    const comp = fixture.componentInstance;

    // simulate having a token (component reads from ActivatedRoute in ngOnInit)
    comp.token = 'resettoken';
    comp.newPassword = 'newpass1';
    comp.confirmPassword = 'newpass1';

    comp.resetPassword();

    const req = httpMock.expectOne('/api/auth/reset-password');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ token: 'resettoken', newPassword: 'newpass1' });

    req.flush({ success: true, message: 'Password reset' });

    // component navigates after 1200ms
    tick(1200);

    expect(router.url).toContain('/login');
  }));

});

describe('Admin guard role enforcement', () => {
  let router: Router;

  it('redirects to login when not authenticated', fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          { path: 'login', component: DummyComponent },
          { path: 'dashboard', component: DummyComponent },
          { path: 'admin', component: DummyComponent, canActivate: [AuthGuard], data: { role: 'admin' } }
        ])
      ],
      providers: [
        { provide: PLATFORM_ID, useValue: 'browser' },
        AuthGuard
      ]
    });

    router = TestBed.inject(Router);

    // ensure not logged in
    localStorage.removeItem('jwt');

    router.navigate(['/admin']);
    tick();

    expect(router.url).toContain('/login');
  }));

  it('redirects to dashboard when user role is insufficient', fakeAsync(() => {
    const mockAuth = {
      isLoggedIn: true,
      currentUser: { role: 'user', status: 'active' }
    } as Partial<AuthService> as AuthService;

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          { path: 'login', component: DummyComponent },
          { path: 'dashboard', component: DummyComponent },
          { path: 'admin', component: DummyComponent, canActivate: [AuthGuard], data: { role: 'admin' } }
        ])
      ],
      providers: [
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: AuthService, useValue: mockAuth },
        AuthGuard
      ]
    });

    router = TestBed.inject(Router);

    router.navigate(['/admin']);
    tick();

    expect(router.url).toContain('/dashboard');
  }));

  it('allows access when user has admin role', fakeAsync(() => {
    const mockAuth = {
      isLoggedIn: true,
      currentUser: { role: 'admin', status: 'active' }
    } as Partial<AuthService> as AuthService;

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          { path: 'login', component: DummyComponent },
          { path: 'dashboard', component: DummyComponent },
          { path: 'admin', component: DummyComponent, canActivate: [AuthGuard], data: { role: 'admin' } }
        ])
      ],
      providers: [
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: AuthService, useValue: mockAuth },
        AuthGuard
      ]
    });

    router = TestBed.inject(Router);

    router.navigate(['/admin']);
    tick();

    expect(router.url).toContain('/admin');
  }));

});
