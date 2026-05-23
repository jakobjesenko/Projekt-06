import { TestBed } from '@angular/core/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';

import { AuthInterceptor } from './auth.interceptor';
import { AuthService } from './auth.service';

describe('AuthInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;
  let authStub: Partial<AuthService> & { logout?: jasmine.Spy };

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    authStub = {
      get token() { return 'fake-token-123'; },
      logout: jasmine.createSpy('logout')
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: AuthService, useValue: authStub },
        { provide: Router, useValue: routerSpy },
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
      ]
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('adds Authorization header and withCredentials', () => {
    http.get('/api/other').subscribe();

    const req = httpMock.expectOne('/api/other');
    expect(req.request.withCredentials).toBeTrue();
    expect(req.request.headers.get('Authorization')).toBe('Bearer fake-token-123');

    req.flush({});
  });

  it('on 401 from non-auth endpoint calls logout and navigates', (done) => {
    http.get('/api/protected').subscribe({
      next: () => {},
      error: () => {
        // after error bubbled
        expect((authStub.logout as jasmine.Spy).calls.any()).toBeTrue();
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
        done();
      }
    });

    const req = httpMock.expectOne('/api/protected');
    req.flush({ error: 'unauth' }, { status: 401, statusText: 'Unauthorized' });
  });
});
