import { CommonModule, Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';

import { AuthService } from '../../services/auth.service';
import { ChatMessage, MessageService } from '../../services/message.service';
import { SocketService } from '../../services/socket.service';

interface ChatMember {
  id: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  profileImage?: string;
  response?: 'pending' | 'accepted' | 'declined';
  respondedAt?: string | null;
  status?: string;
  isActive?: boolean | null;
}

interface ChatMeeting {
  id: string;
  groupName: string;
  status?: string;
  date?: string;
  venue?: {
    address?: string;
    city?: string;
    country?: string;
  };
}

interface ChatContextResponse {
  success: boolean;
  meeting: ChatMeeting;
  members: ChatMember[];
}

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
  meetingLocation = 'Lokacija ni dolocena';
  meetingDate = 'Termin ni dolocen';
  meetingMembers: ChatMember[] = [];

  messages: ChatMessage[] = [];
  newMessage = '';

  loading = true;
  loadingOlder = false;
  noMoreMessages = false;
  sending = false;

  errorMessage = '';

  editingMessageId: string | null = null;
  editingText = '';

  reportingMember: ChatMember | null = null;
  reportReason = '';
  reportDescription = '';
  reportSubmitting = false;
  reportError = '';
  reportSuccess = '';

  readonly reportReasons: string[] = [
    'Žaljiv jezik in nadlegovanje',
    'Spam ali oglaševanje',
    'Neprimerna vsebina ali fotografije',
    'Lažni profil',
    'Goljufivo vedenje',
    'Drugo',
  ];

  private newMessageSub?: Subscription;
  private updateMessageSub?: Subscription;
  private deleteMessageSub?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private authService: AuthService,
    private messageService: MessageService,
    private socketService: SocketService,
    private http: HttpClient
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
    this.loadChatContext();
    this.loadMessages();
  }

  loadChatContext(): void {
    this.http.get<ChatContextResponse>(`/api/meetings/${this.meetingId}/chat-context`, {
      withCredentials: true
    }).subscribe({
      next: (response) => {
        if (!response?.meeting) return;

        this.meetingName = response.meeting.groupName || this.meetingName;

        const venue = response.meeting.venue || {};
        const locationParts = [venue.address, venue.city].filter(Boolean);
        this.meetingLocation = locationParts.length
          ? locationParts.join(', ')
          : 'Lokacija ni dolocena';

        this.meetingDate = response.meeting.date
          ? new Date(response.meeting.date).toLocaleString('sl-SI')
          : 'Termin ni dolocen';

        this.meetingMembers = response.members || [];
      },
      error: (err) => {
        this.errorMessage =
          err.error?.message || 'Napaka pri nalaganju podatkov srecanja.';
      }
    });
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

  getMemberName(member: ChatMember): string {
    const fullName = `${member.firstName || ''} ${member.lastName || ''}`.trim();
    return member.username || fullName || 'Uporabnik';
  }

  getMemberInitials(member: ChatMember): string {
    const name = this.getMemberName(member).trim();
    if (!name) return 'U';

    const parts = name.split(' ').filter(Boolean);
    const initials = parts.length >= 2
      ? `${parts[0][0]}${parts[1][0]}`
      : parts[0][0];

    return initials.toUpperCase();
  }

  getMemberStatusText(member: ChatMember): string {
    switch (member.response) {
      case 'accepted':
        return 'Aktiven';
      case 'declined':
        return 'Odsoten';
      default:
        return 'V cakanju';
    }
  }

  canReportMember(member: ChatMember): boolean {
    const myId = this.authService.currentUser?.id;
    return !!myId && member.id !== myId;
  }

  openReportModal(member: ChatMember): void {
    this.reportingMember = member;
    this.reportReason = '';
    this.reportDescription = '';
    this.reportError = '';
    this.reportSuccess = '';
  }

  closeReportModal(): void {
    if (this.reportSubmitting) return;
    this.reportingMember = null;
    this.reportReason = '';
    this.reportDescription = '';
    this.reportError = '';
    this.reportSuccess = '';
  }

  submitReport(): void {
    if (!this.reportingMember || this.reportSubmitting) return;

    if (!this.reportReason) {
      this.reportError = 'Izberite razlog prijave.';
      return;
    }

    const trimmedDescription = this.reportDescription.trim();

    if (this.reportReason === 'Drugo' && trimmedDescription.length < 10) {
      this.reportError = 'Pri razlogu "Drugo" mora opis vsebovati vsaj 10 znakov.';
      return;
    }

    const combined = trimmedDescription
      ? `${this.reportReason}: ${trimmedDescription}`
      : this.reportReason;

    if (combined.length < 10 || combined.length > 2000) {
      this.reportError = 'Opis prijave mora imeti med 10 in 2000 znaki.';
      return;
    }

    this.reportSubmitting = true;
    this.reportError = '';
    this.reportSuccess = '';

    const payload = {
      reportedUser: this.reportingMember.id,
      meeting: this.meetingId,
      description: combined,
    };

    this.http.post<{ success: boolean; data?: any; error?: string }>(
      '/api/reports',
      payload,
      { withCredentials: true }
    ).subscribe({
      next: () => {
        this.reportSubmitting = false;
        this.reportSuccess = 'Prijava uspešno poslana administratorju.';
        setTimeout(() => this.closeReportModal(), 1500);
      },
      error: (err) => {
        this.reportSubmitting = false;
        this.reportError = err.error?.error || err.error?.message || 'Napaka pri pošiljanju prijave.';
      }
    });
  }

  getMemberStatusClass(member: ChatMember): string {
    switch (member.response) {
      case 'accepted':
        return 'member-status-active';
      case 'declined':
        return 'member-status-offline';
      default:
        return 'member-status-pending';
    }
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