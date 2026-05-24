<<<<<<< HEAD
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatComponent } from './chat.component';
=======
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { of, Subject, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ChatComponent } from './chat.component';
import { AuthService } from '../../services/auth.service';
import { MessageService } from '../../services/message.service';
import { SocketService } from '../../services/socket.service';
>>>>>>> development

describe('ChatComponent', () => {
  let component: ChatComponent;
  let fixture: ComponentFixture<ChatComponent>;

<<<<<<< HEAD
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
=======
  const meetingId = 'meeting-1';

  const authStub = {
    isLoggedIn: true,
    currentUser: { id: 'user1' },
    isAdmin: false
  } as any;

  const message1 = { _id: 'm1', meeting: meetingId, user: 'user1', message: 'Hello', timestamp: new Date().toISOString() } as any;
  const message2 = { _id: 'm2', meeting: meetingId, user: 'user2', message: 'Reply', timestamp: new Date().toISOString() } as any;

  const messageServiceStub = {
    getMessages: jasmine.createSpy('getMessages').and.returnValue(of([message1, message2])),
    sendMessage: jasmine.createSpy('sendMessage').and.returnValue(of({ ...message1, _id: 'm3' })),
    updateMessage: jasmine.createSpy('updateMessage').and.returnValue(of({})),
    deleteMessage: jasmine.createSpy('deleteMessage').and.returnValue(of({}))
  } as any;

  let newMessageSubject: Subject<any>;
  let updateMessageSubject: Subject<any>;
  let deleteMessageSubject: Subject<any>;

  const socketServiceStub = {
    connect: jasmine.createSpy('connect'),
    disconnect: jasmine.createSpy('disconnect'),
    joinMeetingRoom: jasmine.createSpy('joinMeetingRoom'),
    leaveMeetingRoom: jasmine.createSpy('leaveMeetingRoom'),
    onNewMessage: () => newMessageSubject.asObservable(),
    onUpdateMessage: () => updateMessageSubject.asObservable(),
    onDeleteMessage: () => deleteMessageSubject.asObservable()
  } as any;

  const httpGetSpy = jasmine.createSpy('httpGet').and.returnValue(of({
    success: true,
    meeting: { id: meetingId, groupName: 'Group', venue: { address: 'Addr', city: 'City' }, date: new Date().toISOString() },
    members: [{ id: 'user1', firstName: 'A', lastName: 'B' }]
  }));

  const httpPostSpy = jasmine.createSpy('httpPost');

  const routerSpy = { navigate: jasmine.createSpy('navigate') };

  beforeEach(async () => {
    newMessageSubject = new Subject<any>();
    updateMessageSubject = new Subject<any>();
    deleteMessageSubject = new Subject<any>();
    await TestBed.configureTestingModule({
      imports: [ChatComponent, HttpClientTestingModule],
      providers: [
        { provide: AuthService, useValue: authStub },
        { provide: MessageService, useValue: messageServiceStub },
        { provide: SocketService, useValue: socketServiceStub },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => meetingId } } } },
        { provide: HttpClient, useValue: { get: httpGetSpy, post: httpPostSpy } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ChatComponent);
    component = fixture.componentInstance;
  });

  it('creates and loads context/messages when meetingId present', fakeAsync(() => {
    spyOn(component as any, 'scrollToBottom');

    fixture.detectChanges(); // triggers ngOnInit
    tick(100);

    expect(socketServiceStub.connect).toHaveBeenCalled();
    expect(socketServiceStub.joinMeetingRoom).toHaveBeenCalledWith(meetingId);

    expect(httpGetSpy).toHaveBeenCalled();
    expect(component.meetingName).toBe('Group');
    expect(component.meetingMembers.length).toBe(1);

    expect(messageServiceStub.getMessages).toHaveBeenCalledWith(meetingId);
    expect(component.messages.length).toBe(2);
    expect((component as any).scrollToBottom).toHaveBeenCalled();
  }));

  it('handles socket new message event', fakeAsync(() => {
    fixture.detectChanges();
    tick(50);

    const newMsg = { _id: 'm4', meeting: meetingId, user: 'user3', message: 'Hi', timestamp: new Date().toISOString() } as any;
    newMessageSubject.next(newMsg);
    tick();

    expect(component.messages.some(m => m._id === 'm4')).toBeTrue();
  }));

  it('handles socket update message event', fakeAsync(() => {
    fixture.detectChanges();
    tick(50);

    const updated = { ...message1, message: 'Edited' };
    updateMessageSubject.next(updated);
    tick();

    expect(component.messages.find(m => m._id === 'm1')?.message).toBe('Edited');
  }));

  it('handles socket delete message event', fakeAsync(() => {
    fixture.detectChanges();
    tick(50);

    deleteMessageSubject.next({ messageId: 'm1' });
    tick();

    expect(component.messages.find(m => m._id === 'm1')).toBeUndefined();
  }));

  it('shows error if meetingId missing', async () => {
    const routeStub = { snapshot: { paramMap: { get: () => null } } } as any;

    TestBed.resetTestingModule();

    await TestBed.configureTestingModule({
      imports: [ChatComponent],
      providers: [
        { provide: AuthService, useValue: authStub },
        { provide: MessageService, useValue: messageServiceStub },
        { provide: SocketService, useValue: socketServiceStub },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: routeStub },
        { provide: HttpClient, useValue: { get: httpGetSpy, post: httpPostSpy } }
      ]
    }).compileComponents();

    const f = TestBed.createComponent(ChatComponent);
    const c = f.componentInstance;

    f.detectChanges();

    expect(c.errorMessage).toBe('Manjka ID srečanja.');
    expect(c.loading).toBeFalse();
  });

  it('redirects to login when not logged in', async () => {
    const authNotLogged = { isLoggedIn: false } as any;

    TestBed.resetTestingModule();

    await TestBed.configureTestingModule({
      imports: [ChatComponent],
      providers: [
        { provide: AuthService, useValue: authNotLogged },
        { provide: MessageService, useValue: messageServiceStub },
        { provide: SocketService, useValue: socketServiceStub },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => meetingId } } } },
        { provide: HttpClient, useValue: { get: httpGetSpy, post: httpPostSpy } }
      ]
    }).compileComponents();

    const f = TestBed.createComponent(ChatComponent);
    f.detectChanges();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('sendMessage clears newMessage and appends message', () => {
    fixture.detectChanges();

    component.newMessage = 'new msg';
    component.sendMessage();

    expect(messageServiceStub.sendMessage).toHaveBeenCalledWith(meetingId, 'new msg');
    expect(component.newMessage).toBe('');
    expect(component.sending).toBeFalse();
    expect(component.messages.some(m => m._id === 'm3')).toBeTrue();
  });

  it('saveEdit updates message and clears editing state', () => {
    fixture.detectChanges();

    component.editingMessageId = 'm1';
    component.editingText = 'edited';

    component.saveEdit(message1);

    expect(messageServiceStub.updateMessage).toHaveBeenCalledWith('m1', 'edited');
    expect(component.editingMessageId).toBeNull();
  });

  it('deleteMessage calls delete when confirmed', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    fixture.detectChanges();

    component.deleteMessage(message1);

    expect(messageServiceStub.deleteMessage).toHaveBeenCalledWith('m1');
  });

  it('deleteMessage does nothing when not confirmed', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    fixture.detectChanges();

    messageServiceStub.deleteMessage.calls.reset();

    component.deleteMessage(message1);

    expect(messageServiceStub.deleteMessage).not.toHaveBeenCalled();
  });

  it('canReportMember excludes the current user', () => {
    fixture.detectChanges();

    expect(component.canReportMember({ id: 'user2' } as any)).toBeTrue();
    expect(component.canReportMember({ id: 'user1' } as any)).toBeFalse();
  });

  it('openReportModal and closeReportModal reset report state', () => {
    fixture.detectChanges();

    const member = { id: 'user2', username: 'user2' } as any;
    component.reportReason = 'Spam ali oglaševanje';
    component.reportDescription = 'nekaj';
    component.reportError = 'err';
    component.reportSuccess = 'ok';

    component.openReportModal(member);

    expect(component.reportingMember).toBe(member);
    expect(component.reportReason).toBe('');
    expect(component.reportDescription).toBe('');
    expect(component.reportError).toBe('');
    expect(component.reportSuccess).toBe('');

    component.reportSubmitting = true;
    component.closeReportModal();
    expect(component.reportingMember).toBe(member);

    component.reportSubmitting = false;
    component.closeReportModal();

    expect(component.reportingMember).toBeNull();
    expect(component.reportReason).toBe('');
    expect(component.reportDescription).toBe('');
  });

  it('submitReport validates input before posting', () => {
    fixture.detectChanges();

    httpPostSpy.calls.reset();

    component.reportingMember = { id: 'user2', username: 'user2' } as any;
    component.reportReason = '';

    component.submitReport();
    expect(component.reportError).toBe('Izberite razlog prijave.');
    expect(httpPostSpy).not.toHaveBeenCalled();

    component.reportReason = 'Drugo';
    component.reportDescription = 'short';
    component.submitReport();
    expect(component.reportError).toContain('vsaj 10 znakov');
    expect(httpPostSpy).not.toHaveBeenCalled();
  });

  it('submitReport posts report and closes modal after success', fakeAsync(() => {
    fixture.detectChanges();

    component.reportingMember = { id: 'user2', username: 'user2' } as any;
    component.reportReason = 'Žaljiv jezik in nadlegovanje';
    component.reportDescription = 'Neprimerno vedenje v klepetu';

    httpPostSpy.and.returnValue(of({ success: true }));

    component.submitReport();

    expect(httpPostSpy).toHaveBeenCalledWith(
      '/api/reports',
      {
        reportedUser: 'user2',
        meeting: meetingId,
        description: 'Žaljiv jezik in nadlegovanje: Neprimerno vedenje v klepetu'
      },
      { withCredentials: true }
    );
    expect(component.reportSubmitting).toBeFalse();
    expect(component.reportSuccess).toBe('Prijava uspešno poslana administratorju.');

    tick(1500);
    expect(component.reportingMember).toBeNull();
  }));

  it('submitReport shows backend error message', () => {
    fixture.detectChanges();

    component.reportingMember = { id: 'user2', username: 'user2' } as any;
    component.reportReason = 'Spam ali oglaševanje';
    component.reportDescription = 'opis dovolj dolg';

    httpPostSpy.and.returnValue(throwError(() => ({ error: { error: 'Napaka pri prijavi.' } })));

    component.submitReport();

    expect(component.reportSubmitting).toBeFalse();
    expect(component.reportError).toBe('Napaka pri prijavi.');
>>>>>>> development
  });
});
