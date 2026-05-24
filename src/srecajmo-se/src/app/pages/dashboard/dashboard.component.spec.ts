import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { DashboardComponent } from './dashboard.component';
import { AuthService } from '../../services/auth.service';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let authSpy: any;
  let httpSpy: any;
  let router: Router;

  beforeEach(async () => {
    authSpy = { getMe: jasmine.createSpy('getMe') };

    httpSpy = {
      get: jasmine.createSpy('get'),
      put: jasmine.createSpy('put'),
      post: jasmine.createSpy('post'),
      delete: jasmine.createSpy('delete')
    };

    await TestBed.configureTestingModule({
      imports: [
        DashboardComponent,
        RouterTestingModule.withRoutes([
          { path: 'rating/:meetingId', component: DashboardComponent }
        ])
      ],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: HttpClient, useValue: httpSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
  });

  it('loads dashboard user and triggers suggestions/meetings when activeSearch', () => {
    const user = { id: 'u1', birthday: '1990-01-01', availability: ['pon-jutro', 'sre-vecer'], interests: ['a'], activeSearch: true, location: { lat: 46, lng: 14 } };

    authSpy.getMe.and.returnValue(of({ user }));
    spyOn(component, 'loadConfirmedMeetings');
    spyOn(component, 'loadSuggestions');

    fixture.detectChanges(); // ngOnInit -> loadDashboardUser

    expect(authSpy.getMe).toHaveBeenCalled();
    expect(component.user).toBeTruthy();
    expect(component.loading).toBeFalse();
    expect(component.loadConfirmedMeetings).toHaveBeenCalledWith('u1');
    expect(component.loadSuggestions).toHaveBeenCalledWith('u1');
  });

  it('handles getMe error', () => {
    authSpy.getMe.and.returnValue(throwError(() => ({ error: { message: 'Err' } })));

    fixture.detectChanges();

    expect(component.loading).toBeFalse();
    expect(component.errorMessage).toBe('Err');
  });

  it('calculateAge returns undefined for invalid and number for valid', () => {
    expect(component.calculateAge('not-a-date')).toBeUndefined();

    const age = component.calculateAge('2000-01-01');
    expect(typeof age).toBe('number');
  });

  it('normalizeAvailability handles different inputs and deduplicates', () => {
    const input = ['pon-jutro', 'Ponedeljek-jutro', 'dopoldne-pon', 'sre-zvecer', 'sreda-zvecer', ''];
    const normalized = component.normalizeAvailability(input as any);

    expect(normalized).toContain('Pon__morning');
    expect(normalized).toContain('Sre__evening');
    // deduplicated
    const ponCount = normalized.filter(s => s.startsWith('Pon__')).length;
    expect(ponCount).toBe(1);
  });

  it('isAvailable returns true when slot present', () => {
    component.user = { availability: ['Pon__morning'] } as any;
    expect(component.isAvailable('Pon', 'morning')).toBeTrue();
    expect(component.isAvailable('Tor', 'morning')).toBeFalse();
  });

  it('toggleSearch flips state and loads/clears suggestions', () => {
    component.user = { id: 'u1', activeSearch: false, location: { lat: 0, lng: 0 } } as any;
    spyOn(component, 'loadSuggestions');

    httpSpy.put.and.returnValue(of({}));

    component.toggleSearch();

    expect(httpSpy.put).toHaveBeenCalled();
    expect(component.user!.activeSearch).toBeTrue();
    expect(component.loadSuggestions).toHaveBeenCalledWith('u1');

    // toggle off
    httpSpy.put.calls.reset();
    component.toggleSearch();
    expect(httpSpy.put).toHaveBeenCalled();
    expect(component.user!.activeSearch).toBeFalse();
    expect(component.suggestions.length).toBe(0);
  });

  it('acceptSuggestion posts and removes suggestion', () => {
    component.user = { id: 'u1', location: { lat: 46, lng: 14 } } as any;
    const suggestion = { name: 'G', members: ['A'], memberIds: ['a'], interests: ['i'], matchScore: 50, location: 'Loc' } as any;
    component.suggestions = [suggestion];

    httpSpy.post.and.returnValue(of({}));
    spyOn(component, 'loadConfirmedMeetings');

    component.acceptSuggestion(suggestion);

    expect(httpSpy.post).toHaveBeenCalled();
    expect(component.acceptingSuggestionKeys.size).toBe(0);
    expect(component.suggestions.length).toBe(0);
    expect(component.loadConfirmedMeetings).toHaveBeenCalledWith('u1');
  });

  it('isSuggestionAlreadyAccepted detects accepted suggestions via confirmedMeetings', () => {
    const meeting = { groupName: 'G', members: ['A'], location: 'Loc' } as any;
    component.confirmedMeetings = [meeting];
    const suggestion = { name: 'G', members: ['A'], location: 'Loc' } as any;

    expect(component.isSuggestionAlreadyAccepted(suggestion)).toBeTrue();
  });

  it('loadConfirmedMeetings maps backend meetings and removes duplicates', () => {
    const backend = [
      { _id: 'm1', groupName: 'G1', members: [{ user: { username: 'u1', _id: 'u1' } }], date: new Date().toISOString(), venue: { address: 'Addr' } },
      { _id: 'm2', groupName: 'G1', members: [{ user: 'u2' }], date: new Date().toISOString(), venue: { address: 'Addr' } }
    ];

    httpSpy.get.and.returnValue(of(backend));

    component.suggestions = [{ name: 'G1', members: ['u1'], location: 'Addr' } as any];

    component.loadConfirmedMeetings('u1');

    expect(httpSpy.get).toHaveBeenCalled();
    expect(component.confirmedMeetings.length).toBeGreaterThan(0);
    // suggestions filtered
    expect(component.suggestions.length).toBe(0);
  });

  it('isMeetingFinished follows completed status and date comparison', () => {
    expect(component.isMeetingFinished({ status: 'completed' } as any)).toBeTrue();

    expect(component.isMeetingFinished({ rawDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() } as any)).toBeTrue();
    expect(component.isMeetingFinished({ rawDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() } as any)).toBeFalse();
  });

  it('renders rating button for finished meetings and navigates to rating route on click', fakeAsync(() => {
    const user = {
      id: 'u1',
      username: 'ana',
      firstName: 'Ana',
      lastName: 'A',
      email: 'ana@example.com',
      birthday: '1990-01-01',
      availability: [],
      interests: [],
      activeSearch: false,
      location: { lat: 46, lng: 14 }
    };

    authSpy.getMe.and.returnValue(of({ user }));
    httpSpy.get.and.returnValue(of([
      {
        _id: 'm1',
        groupName: 'Skupina A',
        members: [{ user: { username: 'ana', _id: 'u1' } }],
        date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        venue: { address: 'Trg 1', city: 'Ljubljana' },
        status: 'completed'
      }
    ]));

    fixture.detectChanges();

    const ratingButton = fixture.debugElement.queryAll(By.css('button')).find((button) =>
      button.nativeElement.textContent.includes('Oceni')
    );

    expect(ratingButton).toBeDefined();
    expect(ratingButton!.nativeElement.disabled).toBeFalse();

    ratingButton!.nativeElement.dispatchEvent(new MouseEvent('click'));
    tick();

    expect(router.url).toBe('/rating/m1');
  }));

  it('leaveMeeting calls backend, removes meeting and reloads suggestions when activeSearch', () => {
    const meeting = {
      id: 'm1',
      groupName: 'Skupina A',
      members: ['Ana', 'Bojan'],
      location: 'Trg 1',
      rawDate: new Date().toISOString(),
      status: 'upcoming'
    } as any;

    component.user = { id: 'u1', activeSearch: true } as any;
    component.confirmedMeetings = [meeting];
    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(component, 'loadSuggestions');

    httpSpy.delete.and.returnValue(of({ success: true, message: 'OK' }));

    component.leaveMeeting(meeting);

    expect(httpSpy.delete).toHaveBeenCalledWith('/api/meetings/m1/leave', { withCredentials: true });
    expect(component.leavingMeetingIds.has('m1')).toBeFalse();
    expect(component.confirmedMeetings.length).toBe(0);
    expect(component.loadSuggestions).toHaveBeenCalledWith('u1');
    expect(component.meetingActionError).toBe('');
  });

  it('leaveMeeting stores backend error message on failure', () => {
    const meeting = {
      id: 'm2',
      groupName: 'Skupina B',
      members: ['Ana', 'Bojan'],
      location: 'Trg 2',
      rawDate: new Date().toISOString(),
      status: 'upcoming'
    } as any;

    component.user = { id: 'u1', activeSearch: false } as any;
    spyOn(window, 'confirm').and.returnValue(true);

    httpSpy.delete.and.returnValue(throwError(() => ({ error: { message: 'Ne gre' } })));

    component.leaveMeeting(meeting);

    expect(component.leavingMeetingIds.has('m2')).toBeFalse();
    expect(component.meetingActionError).toBe('Ne gre');
  });
});
