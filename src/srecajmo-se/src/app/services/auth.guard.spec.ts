import { TestBed } from '@angular/core/testing';
<<<<<<< HEAD
import { CanActivateFn } from '@angular/router';

import { authGuard } from './auth.guard';

describe('authGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
=======
import { PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';

import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let routerSpy: jasmine.SpyObj<Router>;
  let authStub: Partial<AuthService>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
  });

  it('allows route during server render (SSR)', () => {
    TestBed.configureTestingModule({ providers: [{ provide: PLATFORM_ID, useValue: 'server' }, { provide: Router, useValue: routerSpy }, { provide: AuthService, useValue: {} }] });
    const ssrGuard = TestBed.inject(AuthGuard);
    const result = ssrGuard.canActivate({} as any, { url: '/x' } as any);
    expect(result).toBeTrue();
  });

  it('redirects to /login when not logged in', () => {
    const authMock = { get isLoggedIn() { return false; }, currentUser: null } as any;
    TestBed.configureTestingModule({ providers: [{ provide: Router, useValue: routerSpy }, { provide: PLATFORM_ID, useValue: 'browser' }, { provide: AuthService, useValue: authMock }] });
    const g = TestBed.inject(AuthGuard);

    const res = g.canActivate({} as any, { url: '/dashboard' } as any);
    expect(res).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login'], { queryParams: { returnUrl: '/dashboard' } });
  });

  it('redirects to /dashboard when role mismatch', () => {
    const authMock = { get isLoggedIn() { return true; }, currentUser: { role: 'user' } } as any;
    TestBed.configureTestingModule({ providers: [{ provide: Router, useValue: routerSpy }, { provide: PLATFORM_ID, useValue: 'browser' }, { provide: AuthService, useValue: authMock }] });
    const g = TestBed.inject(AuthGuard);

    const route = { data: { role: 'admin' } } as any;
    const res = g.canActivate(route, { url: '/admin' } as any);
    expect(res).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('logs out and redirects when user is blocked', () => {
    const logoutSpy = jasmine.createSpy('logout');
    const authMock = { get isLoggedIn() { return true; }, currentUser: { status: 'blocked' } as any, logout: logoutSpy } as any;
    TestBed.configureTestingModule({ providers: [{ provide: Router, useValue: routerSpy }, { provide: PLATFORM_ID, useValue: 'browser' }, { provide: AuthService, useValue: authMock }] });
    const g = TestBed.inject(AuthGuard);

    const res = g.canActivate({ data: {} } as any, { url: '/x' } as any);
    expect(res).toBeFalse();
    expect(logoutSpy).toHaveBeenCalledWith(false);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
>>>>>>> development
  });
});
