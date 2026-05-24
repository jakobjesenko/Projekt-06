import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';

import { AuthService } from './auth.service';

function makeToken(payload: any) {
  const b64 = btoa(JSON.stringify(payload)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return `a.${b64}.c`;
}

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    // Default tests should not trigger `restoreSession` HTTP calls, use server platform.
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: PLATFORM_ID, useValue: 'server' }
      ]
    });

    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    localStorage.removeItem('jwt');
    httpMock.verify();
  });

  it('should be created', () => {
    service = TestBed.inject(AuthService);
    expect(service).toBeTruthy();
  });

  it('isTokenExpired returns false for future exp and true for past exp', () => {
    service = TestBed.inject(AuthService);

    const future = Math.floor(Date.now() / 1000) + 60 * 60; // +1h
    const past = Math.floor(Date.now() / 1000) - 60 * 60; // -1h

    const futureToken = makeToken({ id: '1', exp: future });
    const pastToken = makeToken({ id: '1', exp: past });

    expect(service.isTokenExpired(futureToken)).toBeFalse();
    expect(service.isTokenExpired(pastToken)).toBeTrue();
  });

  // Skipping full restoreSession integration here because it triggers HTTP calls
  // from the constructor; that behavior is covered by integration-style tests.

  it('logout clears token and navigates when redirect true', () => {
    // For logout to clear localStorage, run this test as if in the browser.
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule], providers: [{ provide: Router, useValue: routerSpy }, { provide: PLATFORM_ID, useValue: 'browser' }] });

    const token = makeToken({ id: 'u1', exp: Math.floor(Date.now() / 1000) + 1000 });
    localStorage.setItem('jwt', token);

    service = TestBed.inject(AuthService);

    service.logout(true);

    expect(localStorage.getItem('jwt')).toBeNull();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    expect(service.currentUser).toBeNull();
  });
});
