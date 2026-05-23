import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { FaqComponent } from './faq.component';

describe('FaqComponent', () => {
  let component: FaqComponent;
  let fixture: ComponentFixture<FaqComponent>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj<Router>('Router', ['navigateByUrl']);
    routerSpy.navigateByUrl.and.resolveTo(true);

    await TestBed.configureTestingModule({
      imports: [FaqComponent],
      providers: [{ provide: Router, useValue: routerSpy }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FaqComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('filters items by question and keywords', () => {
    expect(component.filteredItems.length).toBe(component.items.length);

    component.searchTerm = 'varnost';
    expect(component.filteredItems.length).toBe(1);
    expect(component.filteredItems[0].question).toContain('podatki');

    component.searchTerm = 'profil';
    expect(component.filteredItems.some(item => item.question.includes('profil'))).toBeTrue();
  });

  it('toggles the open state of a FAQ item', () => {
    const item = component.items[0];

    expect(item.isOpen).toBeFalse();

    component.toggle(item);
    expect(item.isOpen).toBeTrue();

    component.toggle(item);
    expect(item.isOpen).toBeFalse();
  });

  it('registers and removes the click listener', () => {
    const addSpy = spyOn(HTMLElement.prototype, 'addEventListener').and.callThrough();
    const removeSpy = spyOn(HTMLElement.prototype, 'removeEventListener').and.callThrough();

    component.ngAfterViewInit();
    expect(addSpy).toHaveBeenCalledWith('click', jasmine.any(Function));

    component.ngOnDestroy();
    expect(removeSpy).toHaveBeenCalledWith('click', jasmine.any(Function));
  });

  it('navigates for internal links and prevents default navigation', () => {
    const anchor = document.createElement('a');
    anchor.setAttribute('href', '/gdpr');
    const inner = document.createElement('span');
    anchor.appendChild(inner);

    const event = {
      target: inner,
      preventDefault: jasmine.createSpy('preventDefault')
    } as any;

    (component as any).clickHandler(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/gdpr');
  });
});
