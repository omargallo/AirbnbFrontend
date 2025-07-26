import { CommonModule } from '@angular/common';
import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { ChatService, ChatSessionDto, MessageDto } from '../../core/services/Message/message.service';
import { Subject, takeUntil } from 'rxjs';
import { SignalRService } from '../../core/services/SignalRService/signal-rservice';

interface MessageThread {
  id: string;
  profileImage: string;
  name: string;
  preview: string;
  time: string;
  tripDetails?: string;
  isUnread?: boolean;
  propertyId: number;
  hostId: string;
  userId: string;
  originalSession: ChatSessionDto; // Keep reference to original session
}

@Component({
  selector: 'app-messages-box',
  templateUrl: './messages-box.html',
  styleUrls: ['./messages-box.css'],
  imports: [CommonModule]
})
export class MessagesBoxComponent implements OnInit, OnDestroy {
  @Output() chatSessionSelected = new EventEmitter<ChatSessionDto>();

  activeFilter: 'all' | 'unread' = 'all';
  messageThreads: MessageThread[] = [];
  selectedThreadId: string | null = null;
  isLoading = false;
  error: string | null = null;
  // --------------------------------------------------------------------------------------------------

  private destroy$ = new Subject<void>();

  constructor(
    private chatService: ChatService,
    private signalRService: SignalRService
  ) { }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  ngOnInit(): void {
    this.loadChatSessions();
    this.subscribeToNewMessages();

  }

  private subscribeToNewMessages(): void {
    this.signalRService.messageReceived$
      .pipe(takeUntil(this.destroy$))
      .subscribe((newMessage: MessageDto) => {
        console.log('New message received in MessagesBox:', newMessage);
        this.updateThreadWithNewMessage(newMessage);
      });
  }
  private updateThreadWithNewMessage(newMessage: MessageDto): void {
    const threadIndex = this.messageThreads.findIndex(
      thread => thread.id === newMessage.chatSessionId
    );

    if (threadIndex !== -1) {
      // Update existing thread
      this.messageThreads[threadIndex] = {
        ...this.messageThreads[threadIndex],
        preview: newMessage.messageText,
        time: this.formatTime(newMessage.createdAt),
        isUnread: !newMessage.isOwnMessage // Mark as unread if not own message
      };

      // Move thread to top of list
      const updatedThread = this.messageThreads.splice(threadIndex, 1)[0];
      this.messageThreads.unshift(updatedThread);
    } else {
      // If thread doesn't exist, refresh the entire list
      this.loadChatSessions();
    }
  }
  // --------------------------------------------------------------------------------------------------
  loadChatSessions(page: number = 1, pageSize: number = 20): void {
    this.isLoading = true;
    this.error = null;

    this.chatService.getChatSessions(page, pageSize).subscribe({
      next: (sessions: ChatSessionDto[]) => {
        console.log('Chat Sessions loaded:', sessions);
        this.messageThreads = this.mapSessionsToThreads(sessions);
        console.log('Mapped Message Threads:', this.messageThreads);
        this.isLoading = false;

        // Auto-select first session if none selected
        if (this.messageThreads.length > 0 && !this.selectedThreadId) {
          this.openMessage(this.messageThreads[0]);
        }
      },
      error: (error) => {
        console.error('Error loading chat sessions:', error);
        this.error = 'Failed to load messages. Please try again.';
        this.isLoading = false;
      }
    });
  }

  private mapSessionsToThreads(sessions: ChatSessionDto[]): MessageThread[] {
    return sessions.map(session => ({
      id: session.id,
      profileImage: session.hostAvatarUrl || session.userAvatarUrl || 'https://pngpix.com/images/file/placeholder-profile-icon-20tehfawxt5eihco.jpg',
      name: session.hostName || session.userName || 'Unknown User',
      preview: session.lastMessageText || 'No messages yet',
      time: this.formatTime(session.lastActivityAt),
      tripDetails: session.propertyTitle,
      isUnread: session.unreadCount > 0,
      propertyId: session.propertyId,
      hostId: session.hostId,
      userId: session.userId,
      originalSession: session
    }));
  }

  private formatTime(dateString: string): string {
    if (!dateString) return '';

    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} days ago`;
    }
  }

  setActiveFilter(filter: 'all' | 'unread'): void {
    this.activeFilter = filter;
    console.log('Filter changed to:', filter);
  }

  openMessage(thread: MessageThread): void {
    console.log('Opening message thread:', thread);
    this.selectedThreadId = thread.id;

    // Emit the selected chat session to parent component
    this.chatSessionSelected.emit(thread.originalSession);
  }

  getFilteredMessages(): MessageThread[] {
    if (this.activeFilter === 'unread') {
      return this.messageThreads.filter(thread => thread.isUnread);
    }
    return this.messageThreads;
  }

  getUnreadMessages(): MessageThread[] {
    return this.messageThreads.filter(thread => thread.isUnread);
  }

  getUnreadCount(): number {
    return this.getUnreadMessages().length;
  }

  // Check if thread is selected
  isThreadSelected(threadId: string): boolean {
    return this.selectedThreadId === threadId;
  }

  // Method to refresh chat sessions (useful after sending messages)
  refreshChatSessions(): void {
    this.loadChatSessions();
  }

  // Development methods for testing different states
  showMessagesState(): void {
    this.loadChatSessions();
  }

  showEmptyState(): void {
    this.messageThreads = [];
    this.selectedThreadId = null;
  }

  showMultipleMessagesState(): void {
    this.loadChatSessions(1, 50); // Load more messages
  }

  // Search functionality - commented out for now
  // searchActive = false;
  // closing = false;

  // openSearch() {
  //   this.searchActive = true;
  // }

  // closeSearch() {
  //   this.closing = true;
  //   this.searchActive = false;

  //   setTimeout(() => {
  //     this.closing = false;
  //   }, 300);
  // }

  // onAnimationDone() {
  //   this.closing = false;
  // }
}
