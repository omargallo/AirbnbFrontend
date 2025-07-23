import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

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
}

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.html',
  styleUrls: ['./chat-box.css'],
  imports: [CommonModule, FormsModule],
})
export class ChatBoxComponent {
  hostProfileImage =
    'https://a0.muscache.com/im/pictures/user/a2e486a2-4167-42d1-87c7-58e97e912627.jpg?aki_policy=profile_medium';
  hostName = 'Leanna';

  messageInput = '';
  showEmojiPicker: number | null = null;

  emojiOptions = ['😀', '❤️', '👍', '👏', '⚡'];

  chatItems: ChatItem[] = [
    { type: 'date', label: 'Yesterday' },
    {
      type: 'status',
      content: 'Your inquiry for 1 guest on Nov 7 – 9 has been sent.',
      action: 'show listting'
    },
    {
      type: 'message',
      sender: 'user',
      content: 'hey',
      timestamp: '08:11',
      readBy: 'Leanna',
    },
    { type: 'date', label: 'Today' },
    {
      type: 'message',
      sender: 'host',
      content: 'Can I help you?',
      timestamp: '02:27',
      reaction: '❤️',
    },
    {
      type: 'status',
      content: 'Unfortunately, this stay isn\'t available for your trip.',
      action: 'Explore other places to stay'
    },
  ];

  @ViewChild('chatContainer') chatContainer!: ElementRef;

  scrollToBottom() {
    setTimeout(() => {
      if (this.chatContainer) {
        this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
      }
    }, 0);
  }


  constructor() { }

  sendMessage() {
    const message = this.messageInput.trim();
    if (message) {
      this.chatItems.push({
        type: 'message',
        sender: 'user',
        content: message,
        timestamp: new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }),
      });
      this.messageInput = '';
       this.scrollToBottom();
    }
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  toggleEmojiPicker(index: number, event: Event) {
    event.stopPropagation();
    this.showEmojiPicker = this.showEmojiPicker === index ? null : index;
  }

  addReaction(index: number, emoji: string, event: Event) {
    event.stopPropagation();
    if (this.chatItems[index].type === 'message') {
      this.chatItems[index].reaction = emoji;
    }
    this.showEmojiPicker = null;
  }

  closeEmojiPicker() {
    this.showEmojiPicker = null;
  }

  get isSendDisabled(): boolean {
    return this.messageInput.trim().length === 0;
  }

  getLastReadMessageIndex(): number {
    for (let i = this.chatItems.length - 1; i >= 0; i--) {
      if (this.chatItems[i].type === 'message' && this.chatItems[i].readBy) {
        return i;
      }
    }
    return -1;
  }
}
