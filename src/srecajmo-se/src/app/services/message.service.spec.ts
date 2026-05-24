import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { MessageService } from './message.service';

describe('MessageService', () => {
  let service: MessageService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    service = TestBed.inject(MessageService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('gets messages with default limit and credentials', () => {
    service.getMessages('meeting-1').subscribe();

    const req = httpMock.expectOne('/api/messages/meeting-1?limit=20');
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBeTrue();
    req.flush([]);
  });

  it('adds before and custom limit query params', () => {
    const before = new Date('2026-05-23T10:00:00.000Z');

    service.getMessages('meeting-1', before, 50).subscribe();

    const req = httpMock.expectOne((request) =>
      request.url === '/api/messages/meeting-1' &&
      request.params.get('limit') === '50' &&
      request.params.get('before') === before.toISOString()
    );

    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('maps send message responses to the payload data', () => {
    let response: any;

    service.sendMessage('meeting-1', 'hello').subscribe((message) => {
      response = message;
    });

    const req = httpMock.expectOne('/api/messages/meeting-1');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ message: 'hello' });
    expect(req.request.withCredentials).toBeTrue();

    req.flush({
      success: true,
      data: { _id: 'msg-1', meeting: 'meeting-1', user: 'u1', username: 'Ana', message: 'hello', timestamp: '2026-05-23T10:00:00.000Z' }
    });

    expect(response._id).toBe('msg-1');
    expect(response.message).toBe('hello');
  });

  it('maps update and delete responses to the returned message', () => {
    let updated: any;
    let deleted: any;

    service.updateMessage('msg-1', 'new text').subscribe((message) => updated = message);
    const updateReq = httpMock.expectOne('/api/messages/msg-1');
    expect(updateReq.request.method).toBe('PUT');
    expect(updateReq.request.body).toEqual({ message: 'new text' });
    updateReq.flush({
      success: true,
      data: { _id: 'msg-1', meeting: 'meeting-1', user: 'u1', username: 'Ana', message: 'new text', timestamp: '2026-05-23T10:00:00.000Z' }
    });

    service.deleteMessage('msg-1').subscribe((message) => deleted = message);
    const deleteReq = httpMock.expectOne('/api/messages/msg-1');
    expect(deleteReq.request.method).toBe('DELETE');
    deleteReq.flush({
      success: true,
      data: { _id: 'msg-1', meeting: 'meeting-1', user: 'u1', username: 'Ana', message: 'new text', timestamp: '2026-05-23T10:00:00.000Z' }
    });

    expect(updated.message).toBe('new text');
    expect(deleted._id).toBe('msg-1');
  });
});