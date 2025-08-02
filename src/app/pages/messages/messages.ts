import { Component, OnDestroy, OnInit } from '@angular/core';
import { MessagesBoxComponent } from "../../components/messages-box/messages-box";
import { ChatBoxComponent } from "../../components/chat-box/chat-box";
import { ReservationBoxComponent } from "../../components/reservation-box/reservation-box";

import { ChatService, ChatSessionDto, MessageDto, ReservationRequest, ReservePropertyRequest } from '../../core/services/Message/message.service';
import { SignalRService } from '../../core/services/SignalRService/signal-rservice';
import { ChatPlaceholderComponent } from './ChatPlaceholder/ChatPlaceholderComponent';
import { ChatLoadingComponent } from './ChatLoading/ChatLoadingComponent';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-messages',
  imports: [MessagesBoxComponent, ChatBoxComponent, ReservationBoxComponent, ChatPlaceholderComponent, ChatLoadingComponent, CommonModule],
  templateUrl: './messages.html',
  styleUrl: './messages.css',
})
export class Messages implements OnInit, OnDestroy {
  selectedChatSession: ChatSessionDto | null = null;
  initialMessages: MessageDto[] = [];
  ReservationWithProperty: any | null = null;
  isLoadingChat: boolean = false;

  isHost: boolean = false;


  private currentUserId: string | null = null;


  constructor(
    private signalRService: SignalRService,
    private messageService: ChatService, private authService: AuthService) { }

  ngOnInit(): void {
    this.startSignalRConnection();
    this.currentUserId = this.authService.userId;

  }

  ngOnDestroy(): void {
    this.signalRService.destroy();
  }

  private async startSignalRConnection(): Promise<void> {
    try {
      await this.signalRService.startConnection();
    } catch (error) {
      console.error('Failed to start SignalR connection:', error);
    }
  }

  onChatSessionSelected(session: ChatSessionDto): void {
    if (session.hostId === this.currentUserId) {
      this.isHost = true;
    } else {
      this.isHost = false;
    }
    console.log("isHost", this.isHost)

    this.isLoadingChat = true;
    // Reset previous data
    this.initialMessages = [];
    this.ReservationWithProperty = null;

    const reserveRequest: any = {
      propertyId: session.propertyId.toString(),
      // checkInDate: '',
      // checkOutDate: '',
      // guestCount: 0,
      message: 'Hello, I want to inquire about this property.'
    };

    console.log(reserveRequest)
    if (!this.isHost) {
      this.messageService.getSessionForHost(session.id).subscribe({
        next: (res) => {
          if (res.data) {
            // Update the session immediately to show loading state
            this.selectedChatSession = res.data.chatSession;
            
            // Load messages and other data
            this.initialMessages = res.data.messages || [];
            this.ReservationWithProperty = res.data;
            
            // Hide loading state after a small delay for smooth transition
            setTimeout(() => {
              this.isLoadingChat = false;
            }, 200);
          } else {
            this.isLoadingChat = false;
            console.error('No data received from server');
          }
        },
        error: (err) => {
          console.error('Error loading conversation:', err);
          this.isLoadingChat = false;
          this.selectedChatSession = null;
        }
      });
    } else {
      // For host view, use the same endpoint
      this.messageService.getSessionForHost(session.id).subscribe({
        next: (res) => {
          if (res.data) {
            // Update the session immediately to show loading state
            this.selectedChatSession = res.data.chatSession;
            
            // Load messages and other data
            this.initialMessages = res.data.messages || [];
            this.ReservationWithProperty = res.data;
            
            // Hide loading state after a small delay for smooth transition
            setTimeout(() => {
              this.isLoadingChat = false;
            }, 200);
          } else {
            this.isLoadingChat = false;
            console.error('No data received from server');
          }
        },
        error: (err) => {
          console.error('Error loading host conversation:', err);
          this.isLoadingChat = false;
          this.selectedChatSession = null;
        }
      });
    }

  }

  get hasChatSelected(): boolean {
    return this.selectedChatSession !== null;
  }

  get showPlaceholder(): boolean {
    return !this.isLoadingChat && !this.hasChatSelected;
  }
}