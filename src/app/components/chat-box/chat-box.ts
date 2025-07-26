import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, OnInit, Input, OnDestroy, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatService, MessageDto, ChatSessionDto } from '../../core/services/Message/message.service';
import { Subject, takeUntil } from 'rxjs';
import { SignalRService } from '../../core/services/SignalRService/signal-rservice';

interface ChatItem {
  type: 'date' | 'message' | 'status';
  label?: string;
  sender?: 'host' | 'user';
  content?: string;
  timestamp?: string;
  reaction?: string;
  readBy?: string;
  status?: string;
  link?: string;
  linkText?: string;
  action?: string;
  messageId?: string;
  originalMessage?: MessageDto;
}

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.html',
  styleUrls: ['./chat-box.css'],
  imports: [CommonModule, FormsModule],
})
export class ChatBoxComponent implements OnInit, OnDestroy {
  @Input() selectedChatSession: ChatSessionDto | null = null;

  private destroy$ = new Subject<void>();

  hostProfileImage = '';
  hostName = '';

  messageInput = '';
  showEmojiPicker: number | null = null;
  isLoading = false;
  isSending = false;
  error: string | null = null;

  emojiOptions = ['😀', '❤️', '👍', '👏', '🔥'];

  chatItems: ChatItem[] = [];
  messages: MessageDto[] = [];

  @ViewChild('chatContainer') chatContainer!: ElementRef;

  constructor(
    private chatService: ChatService,
    private signalRService: SignalRService,
    private cdr: ChangeDetectorRef
  ) { }
  ngOnInit(): void {
    // Initialize with default values or wait for selectedChatSession input
    if (this.selectedChatSession) {
      this.initializeChatSession();
    }

    this.signalRService.messageReceived$
      .pipe(takeUntil(this.destroy$))
      .subscribe((newMessage: MessageDto) => {
        if (this.selectedChatSession && newMessage.chatSessionId === this.selectedChatSession.id) {
          console.log('New message received via SignalR:', newMessage);
          this.messages.push(newMessage);
          this.processChatItems();
          this.scrollToBottom();
          this.cdr.detectChanges();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedChatSession'] && changes['selectedChatSession'].currentValue) {
      this.initializeChatSession();
    }
  }
  trackById(index: number, item: ChatItem): string {
    return item.messageId || index.toString();
  }



  private initializeChatSession(): void {
    if (!this.selectedChatSession) return;

    this.hostName = this.selectedChatSession.hostName;
    this.hostProfileImage = this.selectedChatSession.hostAvatarUrl ||
      'https://pngpix.com/images/file/placeholder-profile-icon-20tehfawxt5eihco.jpg';

    this.loadMessages();
    this.markMessagesAsRead();
  }

  private loadMessages(): void {
    if (!this.selectedChatSession) return;

    this.isLoading = true;
    this.error = null;

    this.chatService.getChatMessages(this.selectedChatSession.id, 1, 50)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (messages: MessageDto[]) => {
          console.log('Messages loaded:', messages);
          this.messages = messages;
          this.processChatItems();
          this.isLoading = false;
          this.scrollToBottom();
        },
        error: (error) => {
          console.error('Error loading messages:', error);
          this.error = 'Failed to load messages. Please try again.';
          this.isLoading = false;
        }
      });
  }

  private processChatItems(): void {
    this.chatItems = [];
    let lastDate = '';

    this.messages.forEach((message, index) => {
      // Add date separator if needed
      const messageDate = this.formatDate(message.createdAt);
      if (messageDate !== lastDate) {
        this.chatItems.push({
          type: 'date',
          label: messageDate
        });
        lastDate = messageDate;
      }

      // Add reservation request status if exists
      if (message.reservationRequest) {
        const statusText = this.getReservationStatusText(message.reservationRequest.requestStatus);
        this.chatItems.push({
          type: 'status',
          content: statusText,
          action: 'View details'
        });
      }

      // Add message
      this.chatItems.push({
        type: 'message',
        sender: message.isHost ? 'host' : 'user',
        content: message.messageText,
        timestamp: this.formatTime(message.createdAt),
        messageId: message.id,
        originalMessage: message,
        // Handle reactions - take first reaction for now
        reaction: message.reactions && message.reactions.length > 0 ?
          this.getReactionEmoji(message.reactions[0].reactionType) : undefined,
        // Show read status for user messages
        readBy: !message.isHost && message.isRead ? this.hostName : undefined
      });
    });
  }

  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (this.isSameDay(date, today)) {
      return 'Today';
    } else if (this.isSameDay(date, yesterday)) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear();
  }

  private formatTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  }

  private getReservationStatusText(status: number): string {
    switch (status) {
      case 0: return 'Reservation request pending approval';
      case 1: return 'Reservation request approved';
      case 2: return 'Reservation request declined';
      case 3: return 'Reservation cancelled';
      default: return 'Reservation status unknown';
    }
  }

  private getReactionEmoji(reactionType: number): string {
    // Map reaction type numbers to emojis
    const reactionMap: { [key: number]: string } = {
      1: '😀',
      2: '❤️',
      3: '👍',
      4: '👏',
      5: '🔥'
    };
    return reactionMap[reactionType] || '😀';
  }

  private markMessagesAsRead(): void {
    if (!this.selectedChatSession) return;

    this.chatService.markMessagesAsRead(this.selectedChatSession.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          console.log('Messages marked as read');
        },
        error: (error) => {
          console.error('Error marking messages as read:', error);
        }
      });
  }

  scrollToBottom(): void {
    setTimeout(() => {
      if (this.chatContainer) {
        this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
      }
    }, 100);
  }

  sendMessage(): void {
    if (!this.selectedChatSession) {
      console.error('No chat session selected');
      return;
    }

    const message = this.messageInput.trim();
    if (!message || this.isSending) return;

    this.isSending = true;

    this.chatService.sendMessage(this.selectedChatSession.id, message, 1, true)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (sentMessage: MessageDto) => {
          console.log('Message sent:', sentMessage);

          // Add message to local messages array
          this.messages.push(sentMessage);

          // Refresh chat items
          this.processChatItems();

          // Clear input and scroll
          this.messageInput = '';
          this.scrollToBottom();
          this.isSending = false;
        },
        error: (error) => {
          console.error('Error sending message:', error);
          this.error = 'Failed to send message. Please try again.';
          this.isSending = false;
        }
      });
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  toggleEmojiPicker(index: number, event: Event): void {
    event.stopPropagation();
    this.showEmojiPicker = this.showEmojiPicker === index ? null : index;
  }

  addReaction(index: number, emoji: string, event: Event): void {
    event.stopPropagation();

    const chatItem = this.chatItems[index];
    if (chatItem.type === 'message' && chatItem.messageId) {
      // Update local state immediately
      chatItem.reaction = emoji;

      // TODO: Implement API call for adding reactions when available
      // this.chatService.addReaction(chatItem.messageId, reactionType)
      console.log('Adding reaction:', emoji, 'to message:', chatItem.messageId);
    }

    this.showEmojiPicker = null;
  }

  closeEmojiPicker(): void {
    this.showEmojiPicker = null;
  }

  get isSendDisabled(): boolean {
    return this.messageInput.trim().length === 0 || this.isSending || !this.selectedChatSession;
  }

  getLastReadMessageIndex(): number {
    for (let i = this.chatItems.length - 1; i >= 0; i--) {
      if (this.chatItems[i].type === 'message' && this.chatItems[i].readBy) {
        return i;
      }
    }
    return -1;
  }

  // Helper method to refresh messages (can be called from parent)
  refreshMessages(): void {
    if (this.selectedChatSession) {
      this.loadMessages();
    }
  }

  // Helper method to get chat session info
  get chatSessionInfo(): string {
    if (!this.selectedChatSession) return '';
    return `${this.selectedChatSession.propertyTitle} - ${this.selectedChatSession.hostName}`;
  }
}
