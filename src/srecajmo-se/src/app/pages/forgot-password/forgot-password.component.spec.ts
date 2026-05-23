import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { throwError } from 'rxjs';
import { AuthService } from '../../services/auth.service';

import { ForgotPasswordComponent } from './forgot-password.component';

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;
  let authSpy: any;

  beforeEach(async () => {
    authSpy = { forgotPassword: jasmine.createSpy('forgotPassword').and.returnValue(of({ message: 'Email poslan' })) };

    await TestBed.configureTestingModule({
      imports: [ForgotPasswordComponent, HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => null } }, params: of({}) } },
        { provide: AuthService, useValue: authSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows validation error when email is empty', () => {
    component.email = '   ';
    component.sendResetLink();

    expect(component.errorMessage).toBe('Email je obvezen.');
    expect(component.loading).toBeFalse();
  });

  it('calls authService.forgotPassword and shows success message', () => {
    component.email = ' user@example.com ';

    component.sendResetLink();

    expect(authSpy.forgotPassword).toHaveBeenCalledWith('user@example.com');
    expect(component.loading).toBeFalse();
    expect(component.successMessage).toBe('Email poslan');
  });

  it('shows error message when forgotPassword fails', () => {
    authSpy.forgotPassword.and.returnValue(throwError(() => ({ error: { message: 'Napaka' } })));

    component.email = 'a@b.com';
    component.sendResetLink();

    expect(component.loading).toBeFalse();
    expect(component.errorMessage).toBe('Napaka');
  });
});
