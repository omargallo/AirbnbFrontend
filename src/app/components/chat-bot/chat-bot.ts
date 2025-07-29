import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { ChatContextService } from '../../core/chatbot/chat-context.service';
import { marked } from 'marked';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

@Component({
  selector: 'app-chat-bot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-bot.html',
  styleUrls: ['./chat-bot.css']
})
export class ChatBot implements OnInit {
  isOpen = false;
  messages: ChatMessage[] = [];
  userInput = '';
  isLoading = false;
  showQuickActions = true;

  private readonly API_URL = environment.baseUrl + '/chatbot/chat';
  private readonly http = inject(HttpClient);
  private readonly contextService = inject(ChatContextService);

  quickActions = [
    { text: '🏠 Find a place', action: 'I want to find a place to stay' },
    { text: '📅 Check availability', action: 'Is this property available on certain dates?' },
    { text: '💰 Pricing info', action: 'What’s the price for 3 nights?' },
    // { text: '📞 Contact host', action: 'How can I contact the host?' }
  ];

  ngOnInit() {
    this.addMessage(
      'assistant',
      'Hi there! 👋 I\'m your travel assistant. Ask me about bookings, prices, availability, or anything else you need help with.'
    );
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
    setTimeout(() => this.scrollToBottom(), 100);
  }

  closeChat() {
    this.isOpen = false;
  }

  clearChat() {
    this.messages = [];
    this.addMessage('assistant', 'Chat cleared! How can I help you with your travel plans today? 🏠✈️');
    this.showQuickActions = true;
  }

  async sendMessage() {
    if (!this.userInput.trim() || this.isLoading) return;

    const message = this.userInput.trim();
    this.userInput = '';
    this.addMessage('user', message);
    this.isLoading = true;

    try {
      const context = this.contextService.getContext();

      const body = {
        model: 'llama3-70b-8192',
        messages: [
          {
            role: 'system',
            content: `You are a helpful assistant on an Airbnb-like platform. Use only the provided context below to answer the user:\n\n${context}`
          },
          ...this.messages
            .filter(msg => msg.content.trim() !== '')
            .slice(-10)
            .map(msg => ({
              role: msg.role,
              content: msg.content
            }))
        ],
        max_tokens: 150,
        temperature: 0.9
      };


      const response = await this.http.post<any>(this.API_URL, body).toPromise();

      const reply = response?.choices?.[0]?.message?.content;
      if (reply) {
        // this.addMessage('assistant', reply);
        const htmlReply = await marked(reply);
        this.addMessage('assistant', htmlReply);


      } else {
        throw new Error('No valid reply from assistant');
      }
    } catch (error) {
      console.error('❌ API Error:', error);
      this.addMessage('assistant', 'Sorry, something went wrong. Please try again later.');
    } finally {
      this.isLoading = false;
    }
  }

  handleQuickAction(action: string) {
    this.userInput = action;
    this.sendMessage();
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  private addMessage(role: 'user' | 'assistant', content: string) {
    this.messages.push({
      role,
      content,
      timestamp: new Date()
    });

    if (role === 'user' && this.messages.filter(m => m.role === 'user').length > 0) {
      this.showQuickActions = false;
    }

    setTimeout(() => this.scrollToBottom(), 100);
  }

  private scrollToBottom() {
    const container = document.querySelector('.chat-messages');
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }
}
