import { TestBed } from '@angular/core/testing';

import { SocketService } from './socket.service';

describe('SocketService', () => {
  let service: SocketService;
  let socketMock: any;
  let handlers: Record<string, Function>;

  const attachSocket = () => {
    (service as any).socket = socketMock;
  };

  beforeEach(() => {
    handlers = {};
    socketMock = {
      connected: false,
      id: 'socket-1',
      on: jasmine.createSpy('on').and.callFake((event: string, handler: Function) => {
        handlers[event] = handler;
      }),
      off: jasmine.createSpy('off').and.callFake((event: string, handler: Function) => {
        if (handlers[event] === handler) {
          delete handlers[event];
        }
      }),
      emit: jasmine.createSpy('emit'),
      disconnect: jasmine.createSpy('disconnect')
    };

    TestBed.configureTestingModule({});
    service = TestBed.inject(SocketService);
  });

  afterEach(() => {
    localStorage.removeItem('jwt');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('disconnects and clears the socket instance', () => {
    attachSocket();
    service.disconnect();

    expect(socketMock.disconnect).toHaveBeenCalled();
    expect((service as any).socket).toBeUndefined();
  });

  it('emits room join and leave events', () => {
    attachSocket();

    service.joinMeetingRoom('meeting-1');
    service.leaveMeetingRoom('meeting-1');

    expect(socketMock.emit).toHaveBeenCalledWith('joinMeetingRoom', 'meeting-1');
    expect(socketMock.emit).toHaveBeenCalledWith('leaveMeetingRoom', 'meeting-1');
  });

  it('streams new, updated, and deleted messages and unsubscribes', () => {
    attachSocket();

    const newMessages: any[] = [];
    const updatedMessages: any[] = [];
    const deletedMessages: any[] = [];

    const newSub = service.onNewMessage().subscribe((message) => newMessages.push(message));
    const updateSub = service.onUpdateMessage().subscribe((message) => updatedMessages.push(message));
    const deleteSub = service.onDeleteMessage().subscribe((message) => deletedMessages.push(message));

    handlers['newMeetingMessage']({ _id: 'msg-1' });
    handlers['updateMeetingMessage']({ _id: 'msg-2' });
    handlers['deleteMeetingMessage']({ messageId: 'msg-3' });

    expect(newMessages).toEqual([{ _id: 'msg-1' }]);
    expect(updatedMessages).toEqual([{ _id: 'msg-2' }]);
    expect(deletedMessages).toEqual([{ messageId: 'msg-3' }]);

    newSub.unsubscribe();
    updateSub.unsubscribe();
    deleteSub.unsubscribe();

    expect(socketMock.off).toHaveBeenCalledWith('newMeetingMessage', jasmine.any(Function));
    expect(socketMock.off).toHaveBeenCalledWith('updateMeetingMessage', jasmine.any(Function));
    expect(socketMock.off).toHaveBeenCalledWith('deleteMeetingMessage', jasmine.any(Function));
  });
});