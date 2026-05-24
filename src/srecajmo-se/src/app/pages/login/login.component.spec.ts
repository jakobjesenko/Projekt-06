<<<<<<< HEAD
import { ComponentFixture, TestBed } from '@angular/core/testing';
=======
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
>>>>>>> development

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
<<<<<<< HEAD

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent]
=======
  let authMock: any;
  let routerSpy: any;

  beforeEach(async () => {
    authMock = {
      login: jasmine.createSpy('login').and.returnValue(of({ success: true, user: { id: 'u1' } })),
      resendVerification: jasmine.createSpy('resendVerification').and.returnValue(of({ success: true }))
    };

    routerSpy = null;

    await TestBed.configureTestingModule({
      imports: [LoginComponent, HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: authMock }
      ]
>>>>>>> development
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
<<<<<<< HEAD
=======
    // create a spy on the Router provided by RouterTestingModule
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    routerSpy = router;

>>>>>>> development
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
<<<<<<< HEAD
=======

  it('shows validation error when email or password missing', () => {
    component.email = '';
    component.password = '';

    component.login();

    expect(component.errorMessage).toContain('Email/uporabniško ime in geslo');
    expect(authMock.login).not.toHaveBeenCalled();
  });

  it('calls authService.login and navigates on success', fakeAsync(() => {
    component.email = 'a@b.com';
    component.password = 'secret';

    component.login();

    expect(authMock.login).toHaveBeenCalledWith('a@b.com', 'secret');

    // advance timeout in component (setTimeout navigation)
    tick(600);
    expect((routerSpy as any).navigate).toHaveBeenCalledWith(['/dashboard']);
  }));

  it('handles login error and sets requiresEmailVerification when backend requests it', () => {
    authMock.login.and.returnValue(throwError(() => ({ error: { message: 'Bad', requiresEmailVerification: true } })));

    component.email = 'a@b.com';
    component.password = 'x';

    component.login();

    expect(component.loading).toBeFalse();
    expect(component.errorMessage).toBe('Bad');
    expect(component.requiresEmailVerification).toBeTrue();
  });

  it('resendVerification requires email and calls auth service', () => {
    component.email = '';
    component.resendVerification();
    expect(component.errorMessage).toContain('Vnesite email');

    component.email = 'a@b.com';
    component.resendVerification();
    expect(authMock.resendVerification).toHaveBeenCalledWith('a@b.com');
  });
>>>>>>> development
});
