import { Component } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { DashboardComponent } from '../pages/dashboard/dashboard.component';
import { AuthService } from '../services/auth.service';

describe('Dashboard rating integration', () => {
  let fixture: ComponentFixture<DashboardComponent>;
  let component: DashboardComponent;
  let authSpy: any;
  let httpSpy: any;

  @Component({ template: '', standalone: true })
  class DummyComponent {}

  beforeEach(async () => {
    authSpy = { getMe: jasmine.createSpy('getMe') };
    httpSpy = { get: jasmine.createSpy('get'), put: jasmine.createSpy('put'), post: jasmine.createSpy('post') };

    await TestBed.configureTestingModule({
      imports: [
        DashboardComponent,
        RouterTestingModule.withRoutes([
          { path: 'rating/:meetingId', component: DummyComponent }
        ])
      ],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: HttpClient, useValue: httpSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
  });

  it('shows rating button for finished meetings and navigates to rating route', fakeAsync(() => {
    const router = TestBed.inject(Router);

    authSpy.getMe.and.returnValue(of({
      user: {
        id: 'u1',
        username: 'ana',
        firstName: 'Ana',
        lastName: 'A',
        email: 'ana@example.com',
        activeSearch: false,
        availability: [],
        location: { lat: 46.05, lng: 14.5, radius: 5 }
      }
    }));

    httpSpy.get.and.returnValue(of([
      {
        _id: 'm1',
        groupName: 'Skupina A',
        members: [{ user: { username: 'ana' } }],
        date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        venue: { address: 'Trg 1', city: 'Ljubljana' },
        status: 'completed'
      }
    ]));

    fixture.detectChanges();

    const ratingButtons = fixture.debugElement.queryAll(By.css('button'))
      .filter((de) => de.nativeElement.textContent.includes('Oceni'));

    expect(ratingButtons.length).toBeGreaterThan(0);

    const ratingButton = ratingButtons[0];
    ratingButton.nativeElement.click();
    tick();

    expect(router.url).toBe('/rating/m1');
    expect(component.confirmedMeetings.length).toBe(1);
    expect(component.isMeetingFinished(component.confirmedMeetings[0] as any)).toBeTrue();
  }));
});
