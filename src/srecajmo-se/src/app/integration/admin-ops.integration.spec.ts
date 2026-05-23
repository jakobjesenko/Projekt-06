import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';

import { AdminComponent } from '../pages/admin/admin.component';
import { Component } from '@angular/core';

@Component({ template: '', standalone: true })
class DummyComponent {}

describe('Admin operations edge cases & pagination', () => {
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: PLATFORM_ID, useValue: 'browser' }]
    });

    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('activates an inactive user via /activate and updates state', fakeAsync(() => {
    const fixture = TestBed.createComponent(AdminComponent);
    const comp = fixture.componentInstance;

    // prepare an inactive user
    const user = { _id: 'u2', username: 'bob', email: 'b@b', firstName: 'B', lastName: 'B', isActive: false, activeSearch: false } as any;
    comp.users = [user];

    // call toggleActive which should call the activate endpoint
    comp.toggleActive(user);

    const req = httpMock.expectOne(`/api/users/admin/${user._id}/activate`);
    expect(req.request.method).toBe('PUT');

    // respond with activated user
    req.flush({ success: true, user: { ...user, isActive: true } });
    tick();

    expect(user.isActive).toBeTrue();
  }));

  it('leaves user active when deactivate endpoint errors', fakeAsync(() => {
    const fixture = TestBed.createComponent(AdminComponent);
    const comp = fixture.componentInstance;

    const user = { _id: 'u3', username: 'carol', email: 'c@c', firstName: 'C', lastName: 'C', isActive: true, activeSearch: true } as any;
    comp.users = [user];

    comp.toggleActive(user);

    const req = httpMock.expectOne(`/api/users/admin/${user._id}/deactivate`);
    expect(req.request.method).toBe('PUT');

    // simulate failure response (no unhandled HTTP error)
    req.flush({ success: false, message: 'cannot deactivate' });
    tick();

    // no change expected when server indicates failure
    expect(user.isActive).toBeTrue();
  }));

  it('pagination: calls loadUsers for valid pages, ignores invalid', fakeAsync(() => {
    const fixture = TestBed.createComponent(AdminComponent);
    const comp = fixture.componentInstance;

    // set totalPages to 3
    comp.totalPages = 3;

    const spy = spyOn(comp, 'loadUsers');

    comp.goToPage(2);
    tick();
    expect(spy).toHaveBeenCalledWith(2);

    // page zero should be ignored
    spy.calls.reset();
    comp.goToPage(0);
    tick();
    expect(spy).not.toHaveBeenCalled();

    // page greater than totalPages should be ignored
    comp.goToPage(5);
    tick();
    expect(spy).not.toHaveBeenCalled();
  }));

});
