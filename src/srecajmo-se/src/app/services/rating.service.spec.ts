import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { RatingService } from './rating.service';

describe('RatingService', () => {
  let service: RatingService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    service = TestBed.inject(RatingService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('creates a rating with credentials and correct payload', () => {
    service.createRating({ meeting: 'm1', rating: 5, comment: 'Odlično' }).subscribe(res => {
      expect(res.success).toBeTrue();
      expect(res.data.meeting).toBe('m1');
    });

    const req = httpMock.expectOne('/api/ratings');
    expect(req.request.method).toBe('POST');
    expect(req.request.withCredentials).toBeTrue();
    expect(req.request.body).toEqual({ meeting: 'm1', rating: 5, comment: 'Odlično' });

    req.flush({
      success: true,
      data: {
        _id: 'r1',
        user: 'u1',
        meeting: 'm1',
        username: 'ana',
        groupName: 'Skupina A',
        rating: 5,
        comment: 'Odlično'
      }
    });
  });
});
