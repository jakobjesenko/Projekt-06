import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactComponent } from './contact.component';

describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactComponent]
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
    expect(nativeElement.querySelector('h1')?.textContent).toContain('Kontaktirajte nas');
    expect(nativeElement.querySelector('#firstName')).toBeTruthy();
    expect(nativeElement.querySelector('#lastName')).toBeTruthy();
    expect(nativeElement.querySelector('#email')).toBeTruthy();
    expect(nativeElement.querySelector('#subject')).toBeTruthy();
    expect(nativeElement.querySelector('#message')).toBeTruthy();
    expect(nativeElement.querySelector('#submitBtn')?.textContent).toContain('Pošlji sporočilo');
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
