<<<<<<< HEAD
import { ComponentFixture, TestBed } from '@angular/core/testing';
=======
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthService } from '../../services/auth.service';
>>>>>>> development

import { ResetPasswordComponent } from './reset-password.component';

describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;
<<<<<<< HEAD

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResetPasswordComponent]
=======
  let authSpy: any;
  let router: Router;

  beforeEach(async () => {
    authSpy = { resetPassword: jasmine.createSpy('resetPassword').and.returnValue(of({ message: 'OK' })) };

    await TestBed.configureTestingModule({
      imports: [ResetPasswordComponent, HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => null }, queryParamMap: { get: () => null } }, params: of({}) } },
        { provide: AuthService, useValue: authSpy }
      ]
>>>>>>> development
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;
<<<<<<< HEAD
=======
    router = TestBed.inject(Router);
>>>>>>> development
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
<<<<<<< HEAD
=======

  it('sets errorMessage on init when token is missing', () => {
    expect(component.errorMessage).toBe('Manjka token za ponastavitev gesla.');
  });

  it('validation: missing token', () => {
    component.token = '';
    component.newPassword = '123456';
    component.confirmPassword = '123456';

    component.resetPassword();

    expect(component.errorMessage).toBe('Manjka token za ponastavitev gesla.');
  });

  it('validation: missing passwords', () => {
    component.token = 'token';
    component.newPassword = '';
    component.confirmPassword = '';

    component.resetPassword();

    expect(component.errorMessage).toBe('Vnesite novo geslo in potrditev gesla.');
  });

  it('validation: short password', () => {
    component.token = 'token';
    component.newPassword = '123';
    component.confirmPassword = '123';

    component.resetPassword();

    expect(component.errorMessage).toBe('Geslo mora imeti vsaj 6 znakov.');
  });

  it('validation: mismatch', () => {
    component.token = 'token';
    component.newPassword = '123456';
    component.confirmPassword = 'abcdef';

    component.resetPassword();

    expect(component.errorMessage).toBe('Gesli se ne ujemata.');
  });

  it('success: calls resetPassword and navigates to login', fakeAsync(() => {
    spyOn(router, 'navigate');

    authSpy.resetPassword.and.returnValue(of({ message: 'Geslo ponastavljeno' }));

    component.token = 'token123';
    component.newPassword = '123456';
    component.confirmPassword = '123456';

    component.resetPassword();

    expect(authSpy.resetPassword).toHaveBeenCalledWith('token123', '123456');
    expect(component.loading).toBeFalse();
    expect(component.successMessage).toBe('Geslo ponastavljeno');

    tick(1200);

    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  }));

  it('shows error message on failure', () => {
    authSpy.resetPassword.and.returnValue(throwError(() => ({ error: { message: 'Reset failed' } })));

    component.token = 'token123';
    component.newPassword = '123456';
    component.confirmPassword = '123456';

    component.resetPassword();

    expect(component.loading).toBeFalse();
    expect(component.errorMessage).toBe('Reset failed');
  });
>>>>>>> development
});
