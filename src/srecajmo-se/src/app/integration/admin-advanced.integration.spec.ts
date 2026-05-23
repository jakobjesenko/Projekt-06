import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';

import { AdminComponent } from '../pages/admin/admin.component';

describe('Admin advanced integration (bulk/search/filter/backend stubs)', () => {
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

  it('performs bulk-like toggles for multiple users', fakeAsync(() => {
    const fixture = TestBed.createComponent(AdminComponent);
    const comp = fixture.componentInstance;

    comp.users = [
      { _id: 'a1', isActive: true } as any,
      { _id: 'a2', isActive: false } as any,
      { _id: 'a3', isActive: true } as any
    ];

    // toggle all users sequentially (simulate bulk)
    comp.users.forEach(u => comp.toggleActive(u));

    // Expect three PUT calls (deactivate, activate, deactivate)
    const calls = httpMock.match(req => req.url.includes('/api/users/admin/'));
    expect(calls.length).toBe(3);

    // respond to each appropriately
    calls.forEach((r, i) => r.flush({ success: true, user: { _id: `a${i+1}`, isActive: i % 2 === 0 ? false : true } }));
    tick();

    // ensure local array updated
    expect(comp.users[0].isActive).toBeFalse();
    expect(comp.users[1].isActive).toBeTrue();
    expect(comp.users[2].isActive).toBeFalse();
  }));

  it('searches and filters produce correct query params', fakeAsync(() => {
    const fixture = TestBed.createComponent(AdminComponent);
    const comp = fixture.componentInstance;

    comp.searchQuery = 'alice';
    comp.statusFilter = 'active';
    comp.pageSize = 20;

    comp.searchUsers();

    // searchUsers resets currentPage to 1
    const req = httpMock.expectOne(r => r.url.startsWith('/api/users/admin') && r.url.includes('search=alice') && r.url.includes('status=active') && r.url.includes('page=1'));
    expect(req.request.method).toBe('GET');

    req.flush({ success: true, data: [], pagination: { total: 0, page: 1, totalPages: 0 } });
    tick();
  }));

  it('handles backend stub with large dataset and loading state', fakeAsync(() => {
    const fixture = TestBed.createComponent(AdminComponent);
    const comp = fixture.componentInstance;

    // call loadUsers explicitly which sets loading true
    comp.loadUsers(1);
    expect(comp.loading).toBeTrue();

    const matches = httpMock.match(r => r.url.includes('/api/users/admin'));
    const req = matches.shift()!;

    // simulate large payload
    const largeData = new Array(100).fill(0).map((_, i) => ({ _id: `u${i}`, username: `u${i}`, isActive: i % 2 === 0 }));

    req.flush({ success: true, data: largeData, pagination: { total: 100, page: 1, totalPages: 4 } });
    tick();

    expect(comp.users.length).toBe(100);
    expect(comp.stats[0].value).toBe(100);
    expect(comp.loading).toBeFalse();
  }));

});
