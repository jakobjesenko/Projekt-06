import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { ChatMessage } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket?: Socket;

  connect(): void {
    if (this.socket?.connected) return;

    const token = localStorage.getItem('jwt');

    this.socket = io('http://localhost:3000', {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      auth: {
        token
      }
    });

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket?.id);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });

    this.socket.on('connect_error', (err) => {
      console.error('Socket connect error:', err.message);
    });
  }

  disconnect(): void {
    if (!this.socket) return;

    this.socket.disconnect();
    this.socket = undefined;
  }

  joinMeetingRoom(meetingId: string): void {
    this.socket?.emit('joinMeetingRoom', meetingId);
  }

  leaveMeetingRoom(meetingId: string): void {
    this.socket?.emit('leaveMeetingRoom', meetingId);
  }

  onNewMessage(): Observable<ChatMessage> {
    return new Observable((observer) => {
      const handler = (message: ChatMessage) => {
        observer.next(message);
      };

      this.socket?.on('newMeetingMessage', handler);

      return () => {
        this.socket?.off('newMeetingMessage', handler);
      };
    });
  }

  onUpdateMessage(): Observable<ChatMessage> {
    return new Observable((observer) => {
      const handler = (message: ChatMessage) => {
        observer.next(message);
      };

      this.socket?.on('updateMeetingMessage', handler);

      return () => {
        this.socket?.off('updateMeetingMessage', handler);
      };
    });
  }

  onDeleteMessage(): Observable<{ messageId: string }> {
    return new Observable((observer) => {
      const handler = (data: { messageId: string }) => {
        observer.next(data);
      };

      this.socket?.on('deleteMeetingMessage', handler);

      return () => {
        this.socket?.off('deleteMeetingMessage', handler);
      };
    });
  }
}