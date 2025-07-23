import { Component } from '@angular/core';
import { MessagesBoxComponent } from "../../components/messages-box/messages-box";
import { ChatBoxComponent } from "../../components/chat-box/chat-box";
import { ReservationBoxComponent } from "../../components/reservation-box/reservation-box";

@Component({
  selector: 'app-messages',
  imports: [MessagesBoxComponent, ChatBoxComponent, ReservationBoxComponent],
  templateUrl: './messages.html',
  styleUrl: './messages.css'
})
export class Messages {

}
