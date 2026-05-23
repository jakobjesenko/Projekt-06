import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { convertToParamMap } from '@angular/router';
import { By } from '@angular/platform-browser';

import { RatingComponent } from './rating.component';
import { RatingService } from '../../services/rating.service';

describe('RatingComponent', () => {
  let component: RatingComponent;
  let fixture: ComponentFixture<RatingComponent>;
  let httpSpy: any;
  let ratingSpy: any;
  let routerSpy: any;
  let locationSpy: any;

  const meeting = {
    _id: 'm1',
    groupName: 'Skupina A',
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    status: 'completed',
    venue: {
      address: 'Trg 1',
      city: 'Ljubljana'
    }
  };

  beforeEach(async () => {
    httpSpy = {
      get: jasmine.createSpy('get'),
    };

    ratingSpy = {
      createRating: jasmine.createSpy('createRating')
    };

    routerSpy = {
      navigate: jasmine.createSpy('navigate').and.returnValue(Promise.resolve(true))
    };

    locationSpy = {
      back: jasmine.createSpy('back')
    };

    await TestBed.configureTestingModule({
      imports: [RatingComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ meetingId: 'm1' }) } } },
        { provide: Router, useValue: routerSpy },
        { provide: Location, useValue: locationSpy },
        { provide: HttpClient, useValue: httpSpy },
        { provide: RatingService, useValue: ratingSpy }
      ]
    })
    .compileComponents();

    httpSpy.get.and.returnValue(of(meeting));
    fixture = TestBed.createComponent(RatingComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('loads meeting on init and exposes meeting details', () => {
    fixture.detectChanges();

    expect(httpSpy.get).toHaveBeenCalledWith('/api/meetings/m1', { withCredentials: true });
    expect(component.meeting?.groupName).toBe('Skupina A');
    expect(component.groupName).toBe('Skupina A');
    expect(component.meetingLocation).toBe('Trg 1, Ljubljana');
    expect(component.canRateMeeting).toBeTrue();
    expect(component.loading).toBeFalse();
  });

  it('renders meeting title, date and location in the DOM', () => {
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent as string;

    expect(text).toContain('Oceni srečanje');
    expect(text).toContain('Skupina A');
    expect(text).toContain('Trg 1, Ljubljana');
    expect(text).toContain('Status: completed');

    const groupBadges = fixture.debugElement.queryAll(By.css('.group-badge'));
    expect(groupBadges.length).toBeGreaterThanOrEqual(3);
  });

  it('shows disabled rating action when meeting is not finished', () => {
    httpSpy.get.and.returnValue(of({
      ...meeting,
      status: 'upcoming',
      date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    }));

    fixture = TestBed.createComponent(RatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.canRateMeeting).toBeFalse();
    expect(component.successMessage).toBe('');

    const buttons = fixture.debugElement.queryAll(By.css('button'));
    const submitButton = buttons.find((button) =>
      button.nativeElement.textContent.includes('Pošlji oceno') ||
      button.nativeElement.textContent.includes('Pošiljanje...')
    );

    expect(submitButton).toBeDefined();
    expect(submitButton!.nativeElement.disabled).toBeTrue();

    const errorAlerts = fixture.debugElement.queryAll(By.css('.alert.alert-error'));
    expect(errorAlerts.some((alert) =>
      alert.nativeElement.textContent.includes('še ni zaključeno')
    )).toBeTrue();
  });

  it('handles loadMeeting error', () => {
    httpSpy.get.and.returnValue(throwError(() => ({ error: { message: 'Err' } })));

    fixture = TestBed.createComponent(RatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.loading).toBeFalse();
    expect(component.errorMessage).toBe('Err');
  });

  it('supports star interaction and comment length helpers', () => {
    fixture.detectChanges();

    component.setRating(4);
    expect(component.rating).toBe(4);
    expect(component.isStarActive(4)).toBeTrue();
    expect(component.isStarActive(5)).toBeFalse();

    component.setHover(5);
    expect(component.hoveredRating).toBe(5);
    component.clearHover();
    expect(component.hoveredRating).toBe(0);

    component.comment = 'Zelo dobro';
    expect(component.commentLength).toBe(10);
  });

  it('blocks submit when meeting is not rateable or rating is invalid', () => {
    component.meetingId = 'm1';
    component.meeting = { ...meeting, status: 'upcoming', date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() };
    component.rating = 0;

    expect(component.canSubmit()).toBeFalse();

    component.submitRating();
    expect(component.errorMessage).toContain('Srečanje lahko oceniš');
  });

  it('submits rating and navigates to dashboard', fakeAsync(() => {
    fixture.detectChanges();

    component.rating = 5;
    component.comment = 'Odlično srečanje';
    ratingSpy.createRating.and.returnValue(of({ success: true, data: {} }));

    component.submitRating();

    expect(ratingSpy.createRating).toHaveBeenCalledWith({
      meeting: 'm1',
      rating: 5,
      comment: 'Odlično srečanje'
    });

    expect(component.submitting).toBeFalse();
    expect(component.successMessage).toBe('Ocena je bila uspešno oddana.');

    tick(1000);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
  }));

  it('renders success state after rating is submitted and locks interactions', fakeAsync(() => {
    fixture.detectChanges();

    component.rating = 5;
    component.comment = 'Zelo dobro';
    ratingSpy.createRating.and.returnValue(of({ success: true, data: {} }));

    component.submitRating();
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Ocena je bila uspešno oddana.');

    const submitButton = fixture.debugElement.queryAll(By.css('button'))
      .find((button) => button.nativeElement.textContent.includes('Pošlji oceno'));

    expect(submitButton).toBeDefined();
    expect(submitButton!.nativeElement.disabled).toBeTrue();

    component.setRating(3);
    component.setHover(2);
    expect(component.rating).toBe(5);
    expect(component.hoveredRating).toBe(0);

    tick(1000);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
  }));

  it('handles duplicate rating conflict by redirecting to dashboard', fakeAsync(() => {
    fixture.detectChanges();

    component.rating = 4;
    ratingSpy.createRating.and.returnValue(throwError(() => ({ status: 409, error: { message: 'already rated' } })));

    component.submitRating();
    expect(component.successMessage).toBe('To srečanje si že ocenil/a.');

    tick(1000);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
  }));

  it('goBack calls location.back', () => {
    component.goBack();
    expect(locationSpy.back).toHaveBeenCalled();
  });
});
