import { CommonModule, Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from '../../services/auth.service';
import { ChatMessage, MessageService } from '../../services/message.service';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit, OnDestroy {
  meetingId = '';
  meetingName = 'Pogovor';

  messages: ChatMessage[] = [];
  newMessage = '';

  loading = true;
  loadingOlder = false;
  noMoreMessages = false;
  sending = false;

  errorMessage = '';

  editingMessageId: string | null = null;
  editingText = '';

  private newMessageSub?: Subscription;
  private updateMessageSub?: Subscription;
  private deleteMessageSub?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private authService: AuthService,
    private messageService: MessageService,
    private socketService: SocketService
  ) {}

  ngOnInit(): void {
    this.meetingId = this.route.snapshot.paramMap.get('meetingId') || '';

    if (!this.meetingId) {
      this.errorMessage = 'Manjka ID srečanja.';
      this.loading = false;
      return;
    }

    if (!this.authService.isLoggedIn) {
      this.router.navigate(['/login']);
      return;
    }

    this.socketService.connect();
    this.socketService.joinMeetingRoom(this.meetingId);

    this.setupSocketListeners();
    this.loadMessages();
  }

  ngOnDestroy(): void {
    if (this.meetingId) {
      this.socketService.leaveMeetingRoom(this.meetingId);
    }

    this.newMessageSub?.unsubscribe();
    this.updateMessageSub?.unsubscribe();
    this.deleteMessageSub?.unsubscribe();

    this.socketService.disconnect();
  }

  loadMessages(): void {
    this.loading = true;
    this.errorMessage = '';

    this.messageService.getMessages(this.meetingId).subscribe({
      next: (messages) => {
        this.messages = this.normalizeMessages(messages);

        if (this.messages.length > 0 && this.messages[0].meetingName) {
          this.meetingName = this.messages[0].meetingName;
        }

        this.loading = false;

        setTimeout(() => {
          this.scrollToBottom();
        }, 50);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage =
          err.error?.message || 'Napaka pri nalaganju sporočil.';
      }
    });
  }

  loadOlderMessages(): void {
    if (this.loadingOlder || this.noMoreMessages || this.messages.length === 0) {
      return;
    }

    const chatWindow = document.querySelector('.chat-window') as HTMLElement;
    const oldScrollHeight = chatWindow?.scrollHeight || 0;

    const oldestMessage = this.messages[0];
    const before = oldestMessage.timestamp;

    this.loadingOlder = true;

    this.messageService.getMessages(this.meetingId, before).subscribe({
      next: (olderMessages) => {
        const normalized = this.normalizeMessages(olderMessages);

        if (normalized.length === 0) {
          this.noMoreMessages = true;
          this.loadingOlder = false;
          return;
        }

        this.messages = [...normalized, ...this.messages];
        this.loadingOlder = false;

        setTimeout(() => {
          if (!chatWindow) return;

          const newScrollHeight = chatWindow.scrollHeight;
          chatWindow.scrollTop = newScrollHeight - oldScrollHeight;
        }, 50);
      },
      error: (err) => {
        this.loadingOlder = false;
        this.errorMessage =
          err.error?.message || 'Napaka pri nalaganju starejših sporočil.';
      }
    });
  }

  onScroll(event: Event): void {
    const element = event.target as HTMLElement;

    if (element.scrollTop === 0) {
      this.loadOlderMessages();
    }
  }

  sendMessage(): void {
    const text = this.newMessage.trim();

    if (!text || this.sending) return;

    this.sending = true;
    this.errorMessage = '';

    this.messageService.sendMessage(this.meetingId, text).subscribe({
      next: (createdMessage) => {
        this.newMessage = '';
        this.sending = false;

        const exists = this.messages.some((m) => m._id === createdMessage._id);

        if (!exists) {
          this.messages.push(this.normalizeMessage(createdMessage));

          setTimeout(() => {
            this.scrollToBottom();
          }, 50);
        }
      },
      error: (err) => {
        this.sending = false;
        this.errorMessage =
          err.error?.message || 'Napaka pri pošiljanju sporočila.';
      }
    });
  }

  startEdit(message: ChatMessage): void {
    this.editingMessageId = message._id;
    this.editingText = message.message;
  }

  cancelEdit(): void {
    this.editingMessageId = null;
    this.editingText = '';
  }

  saveEdit(message: ChatMessage): void {
    const text = this.editingText.trim();

    if (!text) return;

    this.messageService.updateMessage(message._id, text).subscribe({
      next: () => {
        this.cancelEdit();

        // Message is updated through Socket.IO event.
      },
      error: (err) => {
        this.errorMessage =
          err.error?.message || 'Napaka pri urejanju sporočila.';
      }
    });
  }

  deleteMessage(message: ChatMessage): void {
    const confirmed = confirm('Ali želiš izbrisati to sporočilo?');

    if (!confirmed) return;

    this.messageService.deleteMessage(message._id).subscribe({
      next: () => {
        // Message is removed through Socket.IO event.
      },
      error: (err) => {
        this.errorMessage =
          err.error?.message || 'Napaka pri brisanju sporočila.';
      }
    });
  }

  isMyMessage(message: ChatMessage): boolean {
    return message.user === this.authService.currentUser?.id;
  }

  canModifyMessage(message: ChatMessage): boolean {
    return this.isMyMessage(message) || this.authService.isAdmin;
  }

  goBack(): void {
    this.location.back();
  }

  private setupSocketListeners(): void {
    this.newMessageSub = this.socketService.onNewMessage().subscribe({
      next: (message) => {
        if (message.meeting !== this.meetingId) return;

        const exists = this.messages.some((m) => m._id === message._id);

        if (!exists) {
          this.messages.push(this.normalizeMessage(message));

          setTimeout(() => {
            this.scrollToBottom();
          }, 50);
        }
      }
    });

    this.updateMessageSub = this.socketService.onUpdateMessage().subscribe({
      next: (updatedMessage) => {
        if (updatedMessage.meeting !== this.meetingId) return;

        this.messages = this.messages.map((message) =>
          message._id === updatedMessage._id
            ? this.normalizeMessage(updatedMessage)
            : message
        );
      }
    });

    this.deleteMessageSub = this.socketService.onDeleteMessage().subscribe({
      next: ({ messageId }) => {
        this.messages = this.messages.filter((message) => message._id !== messageId);
      }
    });
  }

  private normalizeMessages(messages: ChatMessage[]): ChatMessage[] {
    return messages.map((message) => this.normalizeMessage(message));
  }

  private normalizeMessage(message: ChatMessage): ChatMessage {
    return {
      ...message,
      timestamp: message.timestamp instanceof Date
        ? message.timestamp
        : new Date(message.timestamp)
    };
  }

  private scrollToBottom(): void {
    const chatWindow = document.querySelector('.chat-window') as HTMLElement;

    if (chatWindow) {
      chatWindow.scrollTop = chatWindow.scrollHeight;
    }
  }
}