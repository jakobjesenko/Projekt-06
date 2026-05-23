import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let http: HttpClient;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterComponent, HttpClientTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpClient);
    fixture.detectChanges();
  });

  afterEach(() => {
    // no-op
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('toggles interests selection', () => {
    expect(component.isSelected('Kava')).toBeFalse();
    component.toggleInterest('Kava');
    expect(component.isSelected('Kava')).toBeTrue();
    component.toggleInterest('Kava');
    expect(component.isSelected('Kava')).toBeFalse();
  });

  it('adds and removes availability', () => {
    expect(component.availability.length).toBe(0);
    component.toggleAvailability('Pon__morning');
    expect(component.availability.length).toBe(1);
    component.toggleAvailability('Pon__morning');
    expect(component.availability.length).toBe(0);
  });

  it('prevents nextStep when required fields missing on step 1', () => {
    spyOn(window, 'alert');
    component.currentStep = 1;
    // leave form invalid
    component.nextStep();
    expect(window.alert).toHaveBeenCalled();
    expect(component.currentStep).toBe(1);
  });

  it('submit posts payload and resets on success', fakeAsync(() => {
    // prepare valid form
    component.registerForm.patchValue({
      firstName: 'A',
      lastName: 'B',
      username: 'abc',
      birthday: '1990-01-01',
      email: 'a@b.com',
      password: 'secret',
      passwordConfirm: 'secret',
      terms: true,
      locationLat: 46.05,
      locationLng: 14.5,
      locationRadius: 5,
      availability: []
    });

    // select 3 interests
    component.toggleInterest('Kava');
    component.toggleInterest('Glasba');
    component.toggleInterest('Hrana');

    // ensure availability has at least one entry to satisfy validators
    component.toggleAvailability('Pon__morning');

    expect(component.selectedInterests.length).toBe(3);

    // replace component.http with a mock that has post()
    const postSpy = jasmine.createSpy('post').and.returnValue(of({ message: 'ok' }));
    (component as any).http = { post: postSpy };

    component.submit();
    expect(postSpy).toHaveBeenCalled();

    tick();

    expect(component.isSubmitting).toBeFalse();
    expect(component.currentStep).toBe(1);
    expect(component.selectedInterests.length).toBe(0);
  }));
});
