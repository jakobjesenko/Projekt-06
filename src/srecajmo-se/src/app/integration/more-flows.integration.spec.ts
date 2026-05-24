import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { PLATFORM_ID } from '@angular/core';

import { LoginComponent } from '../pages/login/login.component';
import { ForgotPasswordComponent } from '../pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from '../pages/reset-password/reset-password.component';
import { AdminComponent } from '../pages/admin/admin.component';
import { AuthGuard } from '../services/auth.guard';
import { AuthService } from '../services/auth.service';
import { Component } from '@angular/core';

@Component({ template: '', standalone: true })
class DummyComponent {}

describe('More integration flows', () => {
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          { path: 'login', component: DummyComponent },
          { path: 'forgot-password', component: ForgotPasswordComponent },
          { path: 'reset-password', component: ResetPasswordComponent },
          { path: 'admin', component: AdminComponent, canActivate: [AuthGuard], data: { role: 'admin' } }
        ])
      ],
      providers: [
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });

    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('resend verification from login calls API', fakeAsync(() => {
    const fixture = TestBed.createComponent(LoginComponent);
    const comp = fixture.componentInstance;

    fixture.detectChanges();

    comp.email = 'x@y.com';
    comp.resendVerification();

    const req = httpMock.expectOne('/api/auth/resend-verification');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: 'x@y.com' });

    req.flush({ success: true, message: 'Sent' });
    tick();

    expect(comp.successMessage).toContain('Sent');
  }));

  it('reset end-to-end: forgot returns token then reset navigates', fakeAsync(() => {
    // Step 1: send forgot request and receive token
    const forgotFixture = TestBed.createComponent(ForgotPasswordComponent);
    const forgotComp = forgotFixture.componentInstance;
    forgotFixture.detectChanges();

    forgotComp.email = 'user@e.com';
    forgotComp.sendResetLink();

    const fReq = httpMock.expectOne('/api/auth/forgot-password');
    expect(fReq.request.method).toBe('POST');
    fReq.flush({ success: true, token: 'token123' });
    tick();

    // navigate to reset route with token
    router.navigate(['/reset-password'], { queryParams: { token: 'token123' } });
    tick();

    const resetFixture = TestBed.createComponent(ResetPasswordComponent);
    const resetComp = resetFixture.componentInstance;
    resetFixture.detectChanges();

    resetComp.newPassword = 'abc1234';
    resetComp.confirmPassword = 'abc1234';
    resetComp.resetPassword();

    const rReq = httpMock.expectOne('/api/auth/reset-password');
    expect(rReq.request.method).toBe('POST');
    expect(rReq.request.body).toEqual({ token: 'token123', newPassword: 'abc1234' });

    rReq.flush({ success: true });
    tick(1200);

    expect(router.url).toContain('/login');
  }));

  it('admin actions: load users and toggle active', fakeAsync(() => {
    const fixture = TestBed.createComponent(AdminComponent);
    const comp = fixture.componentInstance;

    // call loadUsers explicitly to trigger the HTTP request
    comp.loadUsers();

    const listMatches = httpMock.match(req => req.url.includes('/api/users/admin'));
    const listReq = listMatches.shift();
    expect(listReq).toBeDefined();
    expect(listReq!.request.method).toBe('GET');

    listReq!.flush({
      success: true,
      data: [ { _id: 'u1', username: 'a', email: 'a@a', firstName: 'A', lastName: 'B', isActive: true, activeSearch: false } ],
      pagination: { total: 1, page: 1, totalPages: 1 }
    });

    tick();

    expect(comp.users.length).toBe(1);

    // Toggle active should call deactivate endpoint
    const user = comp.users[0];
    comp.toggleActive(user);

    const toggleReq = httpMock.expectOne(`/api/users/admin/${user._id}/deactivate`);
    expect(toggleReq.request.method).toBe('PUT');

    toggleReq.flush({ success: true, user: { ...user, isActive: false } });
    tick();

    // ensure reload by calling loadUsers explicitly and assert
    comp.loadUsers();
    const reloadReq = httpMock.expectOne(req => req.url.includes('/api/users/admin'));
    reloadReq.flush({ success: true, data: [], pagination: { total: 0, page: 1, totalPages: 0 } });
    tick();

    expect(comp.loading).toBeFalse();
  }));

  it('resolving a report refreshes reports and users', fakeAsync(() => {
    const fixture = TestBed.createComponent(AdminComponent);
    const comp = fixture.componentInstance;

    // prepare a single report item and call the action
    comp.reports = [
      { _id: 'r1', reporter: null, reportedUser: { _id: 'u1', username: 'u1', strikes: 0 }, meeting: null, description: 'Issue', status: 'new', createdAt: '', updatedAt: '' }
    ];

    comp.updateReportStatus(comp.reports[0] as any, 'resolved');

    // Expect PUT to update report status
    const putReq = httpMock.expectOne('/api/reports/r1/status');
    expect(putReq.request.method).toBe('PUT');
    // body is urlencoded string
    expect(putReq.request.body).toBe('status=resolved');

    putReq.flush({ success: true, data: { ...comp.reports[0], status: 'resolved' } });
    tick();

    // After resolving, component should reload reports
    const reportsReq = httpMock.expectOne(req => req.url.includes('/api/reports'));
    expect(reportsReq.request.method).toBe('GET');
    reportsReq.flush({ success: true, data: [], pagination: { total: 0, page: 1, totalPages: 0 } });

    // And also reload users so strikes are visible
    const usersReq = httpMock.expectOne(req => req.url.includes('/api/users/admin'));
    expect(usersReq.request.method).toBe('GET');
    usersReq.flush({ success: true, data: [ { _id: 'u1', username: 'u1', isActive: true, activeSearch: false, strikes: 1 } ], pagination: { total: 1, page: 1, totalPages: 1 } });

    tick();

    expect(comp.reportActionInProgress['r1']).toBeFalse();
    expect(comp.users.length).toBe(1);
    expect(comp.users[0].strikes).toBe(1);
  }));

});
