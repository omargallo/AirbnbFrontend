import { Component, OnDestroy, OnInit } from '@angular/core';
import { MessagesBoxComponent } from "../../components/messages-box/messages-box";
import { ChatBoxComponent } from "../../components/chat-box/chat-box";
import { ReservationBoxComponent } from "../../components/reservation-box/reservation-box";
import { ChatSessionDto } from '../../core/services/Message/message.service';
import { SignalRService } from '../../core/services/SignalRService/signal-rservice';

@Component({
  selector: 'app-messages',
  imports: [MessagesBoxComponent, ChatBoxComponent, ReservationBoxComponent],
  templateUrl: './messages.html',
  styleUrl: './messages.css'
})
export class Messages implements OnInit, OnDestroy{

  selectedChatSession: ChatSessionDto | null = null;

  constructor(private signalRService: SignalRService) {}

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
    console.log('Chat session selected:', session);
    
    // Leave previous session if exists
    // if (this.selectedChatSession) {
    //   this.signalRService.leaveChatSession(this.selectedChatSession.id);
    // }
    
    this.selectedChatSession = session;
    
    // Join new session
    // if (session && this.signalRService.isConnected()) {
    //   this.signalRService.joinChatSession(session.id);
    // }
  }
}
