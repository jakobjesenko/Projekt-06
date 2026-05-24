import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CreateRatingPayload {
  meeting: string;
  rating: number;
  comment?: string;
}

export interface RatingResponse {
  success: boolean;
  data: {
    _id: string;
    user: string;
    meeting: string;
    username: string;
    groupName: string;
    rating: number;
    comment?: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class RatingService {
  private readonly API = '/api/ratings';

  constructor(private http: HttpClient) {}

  createRating(payload: CreateRatingPayload): Observable<RatingResponse> {
    return this.http.post<RatingResponse>(
      this.API,
      payload,
      { withCredentials: true }
    );
  }
}