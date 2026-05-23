import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AdminComponent } from '../pages/admin/admin.component';

describe('Admin bulk UI integration', () => {
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('selects users, selectAll, and performs bulk activate/deactivate', fakeAsync(() => {
    const fixture = TestBed.createComponent(AdminComponent);
    const comp = fixture.componentInstance;

    comp.users = [
      { _id: '1', isActive: false } as any,
      { _id: '2', isActive: true } as any,
      { _id: '3', isActive: false } as any
    ];

    // do not call detectChanges to avoid ngOnInit triggering loadUsers
    // select a single user
    comp.toggleSelect(comp.users[0]);
    expect(comp.selectedIds.has('1')).toBeTrue();

    // select all
    const event = { target: { checked: true } } as unknown as Event;
    comp.toggleSelectAll(event);
    expect(comp.selectedIds.size).toBe(3);

    // bulk activate (should call activate for 1 and 3)
    comp.bulkActivate();
    const calls = httpMock.match(req => req.url.includes('/api/users/admin/') && req.method === 'PUT');
    expect(calls.length).toBe(2);

    // respond: activate endpoints
    calls.forEach(c => {
      const id = c.request.url.split('/').pop();
      c.flush({ success: true, user: { _id: id, isActive: true } });
    });
    tick();

    expect(comp.users.every(u => u.isActive)).toBeTrue();

    // bulk deactivate
    comp.bulkDeactivate();
    const calls2 = httpMock.match(req => req.url.includes('/api/users/admin/') && req.method === 'PUT');
    // three deactivate calls expected (all active)
    expect(calls2.length).toBe(3);
    calls2.forEach(c => {
      const id = c.request.url.split('/').pop();
      c.flush({ success: true, user: { _id: id, isActive: false } });
    });
    tick();

    expect(comp.users.every(u => u.isActive === false)).toBeTrue();
  }));

});
