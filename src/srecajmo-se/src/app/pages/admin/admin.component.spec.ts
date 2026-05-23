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

  it('setActiveTab loads meetings and ratings lazily', () => {
    spyOn(component, 'loadMeetings');
    spyOn(component, 'loadRatings');

    component.setActiveTab('meetings');
    expect(component.activeTab).toBe('meetings');
    expect(component.loadMeetings).toHaveBeenCalled();

    component.setActiveTab('ratings');
    expect(component.activeTab).toBe('ratings');
    expect(component.loadRatings).toHaveBeenCalled();
  });

  it('loadReports applies status filter and updates report state', () => {
    const reportsResponse = {
      success: true,
      data: [
        {
          _id: 'r1',
          reporter: { _id: 'u1', username: 'ana' },
          reportedUser: { _id: 'u2', username: 'bojan', strikes: 2 },
          meeting: { _id: 'm1', groupName: 'Skupina' },
          description: 'Opis',
          status: 'new',
          createdAt: '2026-05-01T10:00:00.000Z',
          updatedAt: '2026-05-01T10:00:00.000Z'
        }
      ],
      pagination: { total: 1, page: 2, totalPages: 3 }
    };

    httpSpy.get.and.callFake((url: string) => {
      if (url.startsWith('/api/reports?')) return of(reportsResponse);
      return of({ success: true, data: users, pagination: { total: 2, page: 1, totalPages: 1 } });
    });

    component.reportStatusFilter = 'resolved';
    component.reportsPage = 2;
    component.loadReports();

    expect(httpSpy.get).toHaveBeenCalledWith('/api/reports?page=2&limit=20&status=resolved');
    expect(component.reports.length).toBe(1);
    expect(component.reportsTotal).toBe(1);
    expect(component.reportsPage).toBe(2);
    expect(component.reportsTotalPages).toBe(3);
    expect(component.reportsLoading).toBeFalse();
  });

  it('updateReportStatus refreshes reports and users when resolved', () => {
    spyOn(component, 'loadReports');
    spyOn(component, 'loadUsers');
    component.updateReportStatus({ _id: 'r1' } as any, 'resolved');

    expect(httpSpy.put).toHaveBeenCalledWith(
      '/api/reports/r1/status',
      'status=resolved',
      jasmine.objectContaining({ headers: jasmine.any(Object) })
    );
    expect(component.loadReports).toHaveBeenCalled();
    expect(component.loadUsers).toHaveBeenCalled();
    expect(component.reportActionInProgress['r1']).toBeFalse();
  });

  it('loadMeetings and loadRatings map filters into query params', () => {
    const meetingResponse = {
      success: true,
      data: [
        {
          _id: 'm1',
          groupName: 'Srecanje',
          members: [{ user: { _id: 'u1', username: 'ana' } }],
          venue: { address: 'Trg 1', city: 'Ljubljana' },
          date: '2026-05-10T18:00:00.000Z',
          status: 'upcoming'
        }
      ],
      pagination: { total: 1, page: 1, totalPages: 1 }
    };

    const ratingsResponse = {
      success: true,
      data: [
        {
          _id: 'ra1',
          meeting: 'm1',
          user: 'u1',
          rating: 5,
          comment: 'Super'
        }
      ],
      pagination: { total: 1, page: 1, totalPages: 1 }
    };

    httpSpy.get.and.callFake((url: string) => {
      if (url.startsWith('/api/meetings?')) return of(meetingResponse);
      if (url.startsWith('/api/ratings?')) return of(ratingsResponse);
      return of({ success: true, data: users, pagination: { total: 2, page: 1, totalPages: 1 } });
    });

    component.meetingSearch = 'trg';
    component.meetingStatusFilter = 'upcoming';
    component.loadMeetings();

    expect(httpSpy.get).toHaveBeenCalledWith('/api/meetings?page=1&limit=20&search=trg&status=upcoming');
    expect(component.meetings.length).toBe(1);
    expect(component.meetingsTotal).toBe(1);
    expect(component.meetingsLoading).toBeFalse();

    component.ratingSearch = 'super';
    component.ratingFilter = 5;
    component.loadRatings();

    expect(httpSpy.get).toHaveBeenCalledWith('/api/ratings?page=1&limit=20&rating=5&search=super');
    expect(component.ratings.length).toBe(1);
    expect(component.ratingsTotal).toBe(1);
    expect(component.ratingsLoading).toBeFalse();
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
