import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';

import { EditProfileComponent } from './edit-profile.component';

describe('EditProfileComponent', () => {
  let component: EditProfileComponent;
  let fixture: ComponentFixture<EditProfileComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let httpSpy: jasmine.SpyObj<HttpClient>;

  const createBirthday = (yearsAgo: number): string => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - yearsAgo);
    return date.toISOString().split('T')[0];
  };

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate', 'navigateByUrl']);
    httpSpy = jasmine.createSpyObj<HttpClient>('HttpClient', ['put']);

    await TestBed.configureTestingModule({
      imports: [EditProfileComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: HttpClient, useValue: httpSpy },
        { provide: PLATFORM_ID, useValue: 'server' }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditProfileComponent);
    component = fixture.componentInstance;
    localStorage.clear();
    sessionStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('should create', () => {
    component.ngOnInit();
    expect(component).toBeTruthy();
  });

  it('validates minimum age correctly', () => {
    const validator = component.minimumAgeValidator(18);

    expect(validator({ value: '' } as any)).toBeNull();
    expect(validator({ value: createBirthday(19) } as any)).toBeNull();
    expect(validator({ value: createBirthday(17) } as any)).toEqual({ underage: true });
  });

  it('validates matching passwords on the form', () => {
    component.ngOnInit();

    const form = component.form;

    expect(component.passwordsMatchValidator(form)).toBeNull();

    form.patchValue({ password: 'abc12345', passwordConfirm: 'abc12345' });
    expect(component.passwordsMatchValidator(form)).toBeNull();

    form.patchValue({ password: 'abc12345', passwordConfirm: 'different' });
    expect(component.passwordsMatchValidator(form)).toEqual({ passwordsMismatch: true });
  });

  it('toggles interests and selection state', () => {
    expect(component.isSelected('Glasba')).toBeFalse();

    component.toggleInterest('Glasba');
    expect(component.isSelected('Glasba')).toBeTrue();

    component.toggleInterest('Glasba');
    expect(component.isSelected('Glasba')).toBeFalse();
  });

  it('loads the stored user from localStorage into the form', () => {
    const storedUser = {
      firstName: 'Ana',
      lastName: 'Novak',
      username: 'ana',
      birthday: '2000-01-02T00:00:00.000Z',
      email: 'ana@example.com',
      interests: ['Glasba', 'Šport'],
      availability: ['Pon__zvecer', 'Sob__jutro'],
      location: { lat: 46.05, lng: 14.5, radius: 12 },
      _id: 'user-1'
    };

    localStorage.setItem('user', JSON.stringify(storedUser));

    component.ngOnInit();

    expect(component.selectedInterests).toEqual(['Glasba', 'Šport']);
    expect(component.locationSelected).toBeTrue();
    expect(component.availability.value).toEqual(['Pon__zvecer', 'Sob__jutro']);
    expect(component.form.value.firstName).toBe('Ana');
    expect(component.form.value.locationRadius).toBe(12);
  });

  it('falls back to sessionStorage when localStorage is empty', () => {
    const storedUser = {
      firstName: 'Maja',
      lastName: 'Kovač',
      username: 'maja',
      birthday: '1999-05-10T00:00:00.000Z',
      email: 'maja@example.com',
      interests: ['Kava'],
      availability: ['Ned__popoldan'],
      _id: 'user-2'
    };

    sessionStorage.setItem('currentUser', JSON.stringify(storedUser));

    component.ngOnInit();

    expect(component.form.value.username).toBe('maja');
    expect(component.selectedInterests).toEqual(['Kava']);
    expect(component.availability.value).toEqual(['Ned__popoldan']);
  });

  it('toggles availability entries and shortcut selections', () => {
    component.ngOnInit();

    component.toggleAvailability('Pon__zvecer');
    expect(component.isAvailabilitySelected('Pon__zvecer')).toBeTrue();

    component.toggleAvailability('Pon__zvecer');
    expect(component.isAvailabilitySelected('Pon__zvecer')).toBeFalse();

    component.selectWeeknights();
    expect(component.availability.value).toEqual([
      'Pon__zvecer',
      'Tor__zvecer',
      'Sre__zvecer',
      'Čet__zvecer',
      'Pet__zvecer'
    ]);

    component.selectWeeknights();
    expect(component.availability.value).toEqual([
      'Pon__zvecer',
      'Tor__zvecer',
      'Sre__zvecer',
      'Čet__zvecer',
      'Pet__zvecer'
    ]);

    component.selectWeekends();
    expect(component.availability.value).toEqual([
      'Pon__zvecer',
      'Tor__zvecer',
      'Sre__zvecer',
      'Čet__zvecer',
      'Pet__zvecer',
      'Sob__jutro',
      'Sob__dopoldan',
      'Sob__popoldan',
      'Sob__zvecer',
      'Ned__jutro',
      'Ned__dopoldan',
      'Ned__popoldan',
      'Ned__zvecer'
    ]);

    component.clearAvailability();
    expect(component.availability.length).toBe(0);
  });

  it('skips map initialization on the server', () => {
    const setTimeoutSpy = spyOn(window, 'setTimeout');

    (component as any).initMap();

    expect(setTimeoutSpy).not.toHaveBeenCalled();
  });

  it('returns null when no stored user exists', () => {
    expect((component as any).getStoredUser()).toBeNull();
  });
});
