import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface ChatMessage {
  _id: string;
  meeting: string;
  meetingName?: string;
  user: string;
  username: string;
  userImage?: string;
  message: string;
  timestamp: string | Date;
}

interface SendMessageResponse {
  success: boolean;
  data: ChatMessage;
}

interface UpdateMessageResponse {
  success: boolean;
  data: ChatMessage;
}

interface DeleteMessageResponse {
  success: boolean;
  data: ChatMessage;
}

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private readonly API = '/api/messages';

  constructor(private http: HttpClient) {}

  getMessages(
    meetingId: string,
    before?: Date | string,
    limit = 20
  ): Observable<ChatMessage[]> {
    let params = new HttpParams().set('limit', limit);

    if (before) {
      const beforeValue =
        before instanceof Date ? before.toISOString() : before;

      params = params.set('before', beforeValue);
    }

    return this.http.get<ChatMessage[]>(
      `${this.API}/${meetingId}`,
      {
        params,
        withCredentials: true
      }
    );
  }

  sendMessage(meetingId: string, message: string): Observable<ChatMessage> {
    return this.http.post<SendMessageResponse>(
      `${this.API}/${meetingId}`,
      { message },
      { withCredentials: true }
    ).pipe(
      map((res) => res.data)
    );
  }

  updateMessage(messageId: string, message: string): Observable<ChatMessage> {
    return this.http.put<UpdateMessageResponse>(
      `${this.API}/${messageId}`,
      { message },
      { withCredentials: true }
    ).pipe(
      map((res) => res.data)
    );
  }

  deleteMessage(messageId: string): Observable<ChatMessage> {
    return this.http.delete<DeleteMessageResponse>(
      `${this.API}/${messageId}`,
      { withCredentials: true }
    ).pipe(
      map((res) => res.data)
    );
  }
}