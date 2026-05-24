import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Location } from '@angular/common';
import { of } from 'rxjs';

import { ContactComponent } from './contact.component';
import { ContactService } from '../../services/contact.service';

describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;
  let nativeElement: HTMLElement;
  let contactServiceSpy: jasmine.SpyObj<ContactService>;
  let locationSpy: jasmine.SpyObj<Location>;

  beforeEach(async () => {
    contactServiceSpy = jasmine.createSpyObj<ContactService>('ContactService', ['sendContactMessage']);
    contactServiceSpy.sendContactMessage.and.returnValue(of({
      _id: 'c1',
      name: 'Janez',
      lastName: 'Novak',
      email: 'janez@example.com',
      subject: 'Splošno vprašanje',
      message: 'Pozdravljeni',
      status: 'new',
      createdAt: new Date().toISOString()
    }));

    locationSpy = jasmine.createSpyObj<Location>('Location', ['back']);

    await TestBed.configureTestingModule({
      imports: [ContactComponent],
      providers: [
        { provide: ContactService, useValue: contactServiceSpy },
        { provide: Location, useValue: locationSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    nativeElement = fixture.nativeElement as HTMLElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders the contact form fields and submit button', () => {
    expect(nativeElement.querySelector('h1')?.textContent).toContain('Piši nam');
    expect(nativeElement.querySelector('#name')).toBeTruthy();
    expect(nativeElement.querySelector('#lastName')).toBeTruthy();
    expect(nativeElement.querySelector('#email')).toBeTruthy();
    expect(nativeElement.querySelector('#subject')).toBeTruthy();
    expect(nativeElement.querySelector('#message')).toBeTruthy();
    expect(nativeElement.querySelector('#submitBtn')?.textContent).toContain('Pošlji sporočilo');
  });

  it('submits the form and clears values on success', () => {
    component.name = 'Janez';
    component.lastName = 'Novak';
    component.email = 'janez@example.com';
    component.subject = 'Splošno vprašanje';
    component.message = 'Pozdravljeni';

    component.submitForm({ resetForm: jasmine.createSpy('resetForm') } as any);

    expect(contactServiceSpy.sendContactMessage).toHaveBeenCalledWith({
      name: 'Janez',
      lastName: 'Novak',
      email: 'janez@example.com',
      subject: 'Splošno vprašanje',
      message: 'Pozdravljeni'
    });
    expect(component.success).toBeTrue();
    expect(component.loading).toBeFalse();
    expect(component.name).toBe('');
    expect(component.lastName).toBe('');
    expect(component.email).toBe('');
    expect(component.subject).toBe('');
    expect(component.message).toBe('');
  });

  it('shows contact information links', () => {
    const phoneLink = nativeElement.querySelector('a[href^="tel:"]') as HTMLAnchorElement | null;
    const emailLink = nativeElement.querySelector('a[href^="mailto:"]') as HTMLAnchorElement | null;

    expect(phoneLink?.getAttribute('href')).toBe('tel:+38612345678');
    expect(phoneLink?.textContent).toContain('+386 1 234 5678');
    expect(emailLink?.getAttribute('href')).toBe('mailto:info@srecajmose.si');
    expect(emailLink?.textContent).toContain('info@srecajmose.si');
  });
});
