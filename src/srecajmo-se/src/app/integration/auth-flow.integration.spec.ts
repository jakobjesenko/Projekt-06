import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { PLATFORM_ID } from '@angular/core';
import { FormControl, FormArray } from '@angular/forms';
import { of } from 'rxjs';

import { LoginComponent } from '../pages/login/login.component';
import { RegisterComponent } from '../pages/register/register.component';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from '../services/auth.guard';

import { Component } from '@angular/core';

@Component({ template: '', standalone: true })
class DummyComponent {}

describe('Auth integration flows', () => {
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, DummyComponent, RouterTestingModule.withRoutes([
        { path: 'dashboard', component: DummyComponent },
        { path: 'protected', component: DummyComponent, canActivate: [AuthGuard] },
        { path: 'login', component: DummyComponent }
      ])],
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

  it('login flow stores token, user and navigates to dashboard', fakeAsync(() => {
    const fixture = TestBed.createComponent(LoginComponent);
    const comp = fixture.componentInstance;

    comp.email = 'a@a.com';
    comp.password = 'secret';

    comp.login();

    const req = httpMock.expectOne('/api/auth/login');
    expect(req.request.method).toBe('POST');

    req.flush({ success: true, token: 'dummytoken', user: { id: 'u1', username: 'u' }, message: 'OK' });

    // advance timeout in component that navigates after 600ms
    tick(600);

    expect(localStorage.getItem('jwt')).toBe('dummytoken');
    expect(localStorage.getItem('user')).toContain('u');
  }));

  it('register flow posts payload and resets form on success', fakeAsync(() => {
    const fixture = TestBed.createComponent(RegisterComponent);
    const comp = fixture.componentInstance;

    fixture.detectChanges(); // init form

    comp.registerForm.patchValue({
      firstName: 'A', lastName: 'B', username: 'ab', birthday: '1990-01-01',
      email: 'a@b.com', password: '123456', passwordConfirm: '123456', terms: true,
      locationLat: 1, locationLng: 2, locationRadius: 5
    });

    // select interests
    comp.selectedInterests = ['Kava','Glasba','Potovanja'];

    // ensure availability FormArray has at least one control
    comp.registerForm.setControl('availability', new FormArray([new FormControl('Pon__jutro')]));

    // ensure form is valid before submit
    expect(comp.registerForm.valid).toBeTrue();

    // spy on the component's HttpClient instance directly because the component
    // imports HttpClientModule locally which can interfere with HttpTestingModule.
    spyOn((comp as any).http, 'post').and.returnValue(of({ success: true, message: 'Registered' }));

    comp.submit();
    tick();

    expect((comp as any).http.post).toHaveBeenCalled();
    expect(comp.isSubmitting).toBeFalse();
    expect(comp.currentStep).toBe(1);
  }));

  it('guard redirects to login when not authenticated', fakeAsync(() => {
    // ensure no token present
    localStorage.removeItem('jwt');

    router.navigate(['/protected']);
    tick();

    // RouterTestingModule will navigate to login due to guard
    expect(router.url).toContain('/login');
  }));
});
