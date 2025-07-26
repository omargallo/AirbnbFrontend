import { Component, OnDestroy, OnInit } from '@angular/core';
import { MessagesBoxComponent } from "../../components/messages-box/messages-box";
import { ChatBoxComponent } from "../../components/chat-box/chat-box";
import { ReservationBoxComponent } from "../../components/reservation-box/reservation-box";

import { ChatService, ChatSessionDto, MessageDto, ReservationRequest, ReservePropertyRequest } from '../../core/services/Message/message.service';
import { SignalRService } from '../../core/services/SignalRService/signal-rservice';
import { ChatPlaceholderComponent } from './ChatPlaceholder/ChatPlaceholderComponent';
import { ChatLoadingComponent } from './ChatLoading/ChatLoadingComponent';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-messages',
  imports: [MessagesBoxComponent, ChatBoxComponent, ReservationBoxComponent, ChatPlaceholderComponent, ChatLoadingComponent,CommonModule],
  templateUrl: './messages.html',
  styleUrl: './messages.css',
})
export class Messages implements OnInit, OnDestroy {
  selectedChatSession: ChatSessionDto | null = null;
  initialMessages: MessageDto[] = [];
  ReservationWithProperty: any | null = null;
  isLoadingChat: boolean = false;
  
  constructor(
    private signalRService: SignalRService,
    private messageService: ChatService) { }

  ngOnInit(): void {
    this.startSignalRConnection();
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
    this.messageService.reserveProperty(reserveRequest).subscribe({
      next: (res) => {
        console.log("res", res.data)
        // Add slight delay for better UX
        setTimeout(() => {
          this.selectedChatSession = res.data.chatSession;
          this.initialMessages = res.data.messages;
          this.ReservationWithProperty = res.data;
          this.isLoadingChat = false;
        }, 500);
      },
      error: (err) => {
        console.error('Error reserving property:', err);
        this.isLoadingChat = false;
      }
    });
  }

  get hasChatSelected(): boolean {
    return this.selectedChatSession !== null;
  }

  get showPlaceholder(): boolean {
    return !this.isLoadingChat && !this.hasChatSelected;
  }
}