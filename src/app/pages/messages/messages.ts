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

    this.selectedChatSession = session;
    this.isLoadingChat = true;
    // Reset previous data
    this.selectedChatSession = null;
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
      this.messageService.reserveProperty(reserveRequest).subscribe({
        next: (res) => {
          console.log("reserveRequest", reserveRequest)
          console.log("res", res.data)
          // Add slight delay for better UX
          setTimeout(() => {
            this.selectedChatSession = res?.data?.chatSession;
            this.initialMessages = res?.data?.messages;
            this.ReservationWithProperty = res?.data;
            this.isLoadingChat = false;
          }, 200);

        },
        error: (err) => {
          console.error('Error reserving property:', err);
          this.isLoadingChat = false;
        }
      });
    } else {
      this.selectedChatSession = session;
      this.messageService.getChatMessages(session.id, 1, 50).subscribe({
        next: (messages: MessageDto[]) => {
          this.initialMessages = messages || [];
          this.isLoadingChat = false;
        },
        error: (err) => {
          console.error('Error loading host messages:', err);
          this.isLoadingChat = false;
          this.initialMessages = [];
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