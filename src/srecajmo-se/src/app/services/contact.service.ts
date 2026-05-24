import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';

import { ApiService } from './api.service';

export interface ContactSubmission {
  name: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactRecord extends ContactSubmission {
  _id: string;
  status: 'new' | 'in-progress' | 'resolved';
  createdAt: string;
  updatedAt?: string;
}

export interface PaginatedContactsResponse {
  success: boolean;
  data: ContactRecord[];
  pagination: {
    total: number;
    page: number;
    totalPages: number;
  };
}

interface ContactSubmitResponse {
  success: boolean;
  data: ContactRecord;
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private readonly apiUrl: string;

  constructor(
    private readonly http: HttpClient,
    private readonly apiService: ApiService
  ) {
    this.apiUrl = this.apiService.url('contacts');
  }

  sendContactMessage(payload: ContactSubmission): Observable<ContactRecord> {
    return this.http.post<ContactSubmitResponse>(this.apiUrl, payload).pipe(
      map((response) => response.data),
      catchError(this.handleError)
    );
  }

  getAllContacts(
    page = 1,
    limit = 20,
    search = '',
    status = ''
  ): Observable<PaginatedContactsResponse> {
    let params = new HttpParams()
      .set('page', page)
      .set('limit', limit);

    if (search.trim()) {
      params = params.set('search', search.trim());
    }

    if (status) {
      params = params.set('status', status);
    }

    return this.http.get<PaginatedContactsResponse>(this.apiUrl, { params }).pipe(
      catchError(this.handleError)
    );
  }

  updateContactStatus(contactId: string, status: string): Observable<{ success: boolean; message?: string }> {
    return this.http.put<{ success: boolean; message?: string }>(
      `${this.apiUrl}/${contactId}/status`,
      { status }
    ).pipe(catchError(this.handleError));
  }

  deleteContact(contactId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${contactId}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    const message =
      error.error?.message ||
      error.error?.error ||
      `Napaka ${error.status}: ${error.statusText || 'Neznana napaka'}`;

    return throwError(() => new Error(message));
  }
}