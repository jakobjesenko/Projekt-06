import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { AdminComponent } from './admin.component';

describe('AdminComponent', () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;
  let httpSpy: any;

  const users = [
    { _id: 'u1', username: 'a', email: 'a@a', firstName: 'A', lastName: 'A', isActive: true, activeSearch: true },
    { _id: 'u2', username: 'b', email: 'b@b', firstName: 'B', lastName: 'B', isActive: false, activeSearch: false }
  ];

  beforeEach(async () => {
    httpSpy = {
      get: jasmine.createSpy('get').and.returnValue(of({ success: true, data: users, pagination: { total: 2, page: 1, totalPages: 1 } })),
      put: jasmine.createSpy('put').and.returnValue(of({ success: true, user: { ...users[1], isActive: true, activeSearch: true } }))
    };

    await TestBed.configureTestingModule({
      imports: [AdminComponent, RouterTestingModule],
      providers: [
        { provide: HttpClient, useValue: httpSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminComponent);
    component = fixture.componentInstance;
  });

  it('creates and loads users on init', () => {
    fixture.detectChanges();

    expect(httpSpy.get).toHaveBeenCalled();
    expect(component.users.length).toBe(2);
    expect(component.totalUsers).toBe(2);
    expect(component.stats[0].value).toBe(2);
    expect(component.loading).toBeFalse();
  });

  it('handles loadUsers error', () => {
    httpSpy.get.and.returnValue({ subscribe: (obs: any) => obs.error && obs.error() });

    fixture.detectChanges();

    // simulate error path by calling loadUsers directly
    component.loadUsers();

    expect(component.error).toBe('Napaka pri nalaganju uporabnikov.');
    expect(component.loading).toBeFalse();
  });

  it('searchUsers resets page and calls loadUsers', () => {
    spyOn(component, 'loadUsers');
    component.currentPage = 3;
    component.searchQuery = 'foo';

    component.searchUsers();

    expect(component.currentPage).toBe(1);
    expect(component.loadUsers).toHaveBeenCalled();
  });

  it('clearSearch resets filters and calls loadUsers', () => {
    spyOn(component, 'loadUsers');
    component.searchQuery = 'x';
    component.statusFilter = 'active';

    component.clearSearch();

    expect(component.searchQuery).toBe('');
    expect(component.statusFilter).toBe('');
    expect(component.currentPage).toBe(1);
    expect(component.loadUsers).toHaveBeenCalled();
  });

  it('goToPage prevents invalid pages', () => {
    component.totalPages = 2;
    spyOn(component, 'loadUsers');

    component.goToPage(0);
    expect(component.loadUsers).not.toHaveBeenCalled();

    component.goToPage(3);
    expect(component.loadUsers).not.toHaveBeenCalled();
  });

  it('toggleActive calls put and updates user', () => {
    fixture.detectChanges();
    const user = component.users[1];

    component.toggleActive(user);

    expect(httpSpy.put).toHaveBeenCalled();
    expect(user.isActive).toBeTrue();
    expect(user.activeSearch).toBeTrue();
  });

  it('renders bulk controls and updates selected count through checkbox interaction', () => {
    fixture.detectChanges();

    const textBefore = fixture.nativeElement.textContent as string;
    expect(textBefore).toContain('Aktiviraj izbrane');
    expect(textBefore).toContain('Deaktiviraj izbrane');
    expect(textBefore).toContain('Izbranih: 0');

    const checkboxes = fixture.debugElement.queryAll(By.css('input[type="checkbox"]'));
    expect(checkboxes.length).toBe(3);

    checkboxes[1].nativeElement.click();
    fixture.detectChanges();

    expect(component.selectedIds.has('u1')).toBeTrue();
    expect((fixture.nativeElement.textContent as string)).toContain('Izbranih: 1');

    checkboxes[0].nativeElement.click();
    fixture.detectChanges();

    expect(component.selectedIds.size).toBe(2);
    expect((fixture.nativeElement.textContent as string)).toContain('Izbranih: 2');
  });

  it('formatLocation returns dash for missing', () => {
    expect(component.formatLocation(undefined)).toBe('—');
  });

  it('formatLocation formats coordinates', () => {
    expect(component.formatLocation({ lat: 12.3456, lng: 78.9 })).toBe('12.35, 78.90');
  });
});
