import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

interface MessageThread {
  id: number;
  profileImage: string;
  name: string;
  preview: string;
  time: string;
  tripDetails?: string;
  isUnread?: boolean;
}

@Component({
  selector: 'app-messages-box',
  templateUrl: './messages-box.html',
  styleUrls: ['./messages-box.css'],
  imports: [CommonModule]
})
export class MessagesBoxComponent implements OnInit {

  activeFilter: 'all' | 'unread' = 'all';

  messageThreadsWithData: MessageThread[] = [
    {
      id: 1,
      profileImage: 'https://a0.muscache.com/im/pictures/user/a2e486a2-4167-42d1-87c7-58e97e912627.jpg?aki_policy=profile_medium',
      name: 'Leanna',
      preview: 'You reacted <span class="heart">❤️</span> to "Can I help you..."',
      time: '9:54 AM',
      tripDetails: 'Nov 7 - 9 • Ocean City',
      isUnread: true
    }
  ];

  emptyMessageThreads: MessageThread[] = [];

  multipleMessageThreads: MessageThread[] = [
    {
      id: 1,
      profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      name: 'Leanna',
      preview: 'You reacted <span class="heart">❤️</span> to "Can I help you..."',
      time: '9:54 AM',
      tripDetails: 'Nov 7 - 9 • Ocean City',
      isUnread: true
    },
    {
      id: 2,
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      name: 'Ahmed',
      preview: 'Thanks for the quick response!',
      time: 'Yesterday',
      tripDetails: 'Dec 15 - 18 • Cairo',
      isUnread: false
    },
    {
      id: 3,
      profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      name: 'Sarah',
      preview: 'Looking forward to our trip',
      time: '2 days ago',
      tripDetails: 'Jan 5 - 8 • Dubai',
      isUnread: true
    }
  ];

  messageThreads: MessageThread[] = [];

  constructor() { }

  ngOnInit(): void {
    this.showMessagesState();
  }

  setActiveFilter(filter: 'all' | 'unread'): void {
    this.activeFilter = filter;
  }

  openMessage(thread: MessageThread): void {
    console.log('Opening message thread:', thread);
  }

  showMessagesState(): void {
    this.messageThreads = [...this.messageThreadsWithData];
  }

  showEmptyState(): void {
    this.messageThreads = [...this.emptyMessageThreads];
  }

  showMultipleMessagesState(): void {
    this.messageThreads = [...this.multipleMessageThreads];
  }

  getUnreadMessages(): MessageThread[] {
    return this.messageThreads.filter(thread => thread.isUnread);
  }

  getUnreadCount(): number {
    return this.getUnreadMessages().length;
  }




  searchActive = false;
  closing = false;

  openSearch() {
    this.searchActive = true;
  }

  closeSearch() {
    this.closing = true;
    this.searchActive = false;

    setTimeout(() => {
    this.closing = false;
  }, 300);
  }

  onAnimationDone() {
    this.closing = false;
  }


}
