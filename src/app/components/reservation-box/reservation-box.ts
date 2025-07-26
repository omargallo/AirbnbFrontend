import { Component, Input, OnInit, OnChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatSessionDto, MessageDto, ReservationRequest, ChatService } from '../../core/services/Message/message.service';
import { HandleImgService } from '../../core/services/handleImg.service';
import { SignalRService } from '../../core/services/SignalRService/signal-rservice';

@Component({
  selector: 'app-reservation-box',
  templateUrl: './reservation-box.html',
  styleUrls: ['./reservation-box.css'],
  imports: [CommonModule]
})
export class ReservationBoxComponent implements OnInit, OnChanges {
  @Input() selectedChatSession: ChatSessionDto | null = null;
  handleImgService = inject(HandleImgService);

  showBookingDetails = false;
  isLoading = false;
  error: string | null = null;

  // Current reservation from messages
  currentReservation: ReservationRequest | null = null;
  messages: MessageDto[] = [];

  // Default reservation object (will be populated from API data)
  reservation = {
    image: 'assets/images/deafult.png',
    status: 'No Reservation',
    hostMessage: 'No reservation requests yet.',
    propertyName: '',
    propertyType: '',
    hostName: '',
    hostReviews: '0 reviews',
    hostAvatar: 'https://pngpix.com/images/file/placeholder-profile-icon-20tehfawxt5eihco.jpg',
    checkIn: '',
    checkOut: '',
    guests: '0 guests',
    pricePerNight: '0.00 ج.م',
    nights: 0,
    subtotal: '0.00 ج.م',
    taxes: '0.00 ج.م',
    total: '0.00 ج.م'
  };

  constructor(
    private chatService: ChatService,
    private signalRService: SignalRService
  ) { }

  ngOnInit(): void {
    if (this.selectedChatSession) {
      this.loadReservationData();
    }


    this.signalRService.messageReceived$.subscribe((newMessage: MessageDto) => {
    if (this.selectedChatSession && 
        newMessage.chatSessionId === this.selectedChatSession.id && 
        newMessage.reservationRequest) {
      console.log('New reservation update received:', newMessage);
      this.loadReservationData();
    }
  });
  }

  ngOnChanges(): void {
    if (this.selectedChatSession) {
      this.loadReservationData();
    } else {
      this.resetReservationData();
    }
  }

  private loadReservationData(): void {
    if (!this.selectedChatSession) return;

    this.isLoading = true;
    this.error = null;

    // Load messages to get reservation requests
    this.chatService.getChatMessages(this.selectedChatSession.id, 1, 50).subscribe({
      next: (messages: MessageDto[]) => {
        console.log('Messages loaded for reservation:', messages);
        this.messages = messages;
        this.processReservationData();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading reservation data:', error);
        this.error = 'Failed to load reservation details.';
        this.isLoading = false;
      }
    });
  }

  private processReservationData(): void {
    // Find the latest reservation request from messages
    const reservationMessage = this.messages
      .filter(msg => msg.reservationRequest)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

    if (reservationMessage && reservationMessage.reservationRequest && this.selectedChatSession) {
      this.currentReservation = reservationMessage.reservationRequest;
      this.updateReservationDisplay();
    } else {
      // No reservation found, use session data
      this.updateReservationDisplayFromSession();
    }
  }

  private updateReservationDisplay(): void {
    if (!this.currentReservation || !this.selectedChatSession) return;

    const reservation = this.currentReservation;
    const session = this.selectedChatSession;

    // Calculate dates
    const checkInDate = new Date(reservation.checkInDate);
    const checkOutDate = new Date(reservation.checkOutDate);

    this.reservation = {
      image: this.handleImgService.handleImage(session.propertyImageUrl) || 'assets/images/deafult.png',
      status: this.getReservationStatusText(reservation.requestStatus),
      hostMessage: this.getHostMessage(reservation.requestStatus, reservation.responseMessage ?? undefined),
      propertyName: session.propertyTitle || 'Property',
      propertyType: `Entire property • ${session.propertyTitle}`,
      hostName: session.hostName || 'Host',
      hostReviews: '167 reviews',
      hostAvatar: session.hostAvatarUrl || 'https://pngpix.com/images/file/placeholder-profile-icon-20tehfawxt5eihco.jpg',
      checkIn: this.formatDate(checkInDate),
      checkOut: this.formatDate(checkOutDate),
      guests: `${reservation.guestCount} ${reservation.guestCount === 1 ? 'guest' : 'guests'}`,
      pricePerNight: this.formatCurrency(reservation.pricePerNight),
      nights: reservation.nightCount,
      subtotal: this.formatCurrency(reservation.pricePerNight * reservation.nightCount),
      taxes: this.calculateTaxes(reservation.totalAmount, reservation.pricePerNight * reservation.nightCount),
      total: this.formatCurrency(reservation.totalAmount)
    };
  }

  private updateReservationDisplayFromSession(): void {
    if (!this.selectedChatSession) return;

    const session = this.selectedChatSession;

    this.reservation = {
      image: this.handleImgService.handleImage(session.propertyImageUrl) || 'assets/images/deafult.png',
      status: 'No Reservation',
      hostMessage: 'No reservation requests yet.',
      propertyName: session.propertyTitle || 'Property',
      propertyType: `Property • ${session.propertyTitle}`,
      hostName: session.hostName || 'Host',
      hostReviews: '167 reviews',
      hostAvatar: session.hostAvatarUrl || 'https://pngpix.com/images/file/placeholder-profile-icon-20tehfawxt5eihco.jpg',
      checkIn: '',
      checkOut: '',
      guests: '0 guests',
      pricePerNight: '0.00 ج.م',
      nights: 0,
      subtotal: '0.00 ج.م',
      taxes: '0.00 ج.م',
      total: '0.00 ج.م'
    };
  }

  private resetReservationData(): void {
    this.reservation = {
      image: 'assets/images/deafult.png',
      status: 'No Chat Selected',
      hostMessage: 'Select a conversation to view reservation details.',
      propertyName: '',
      propertyType: '',
      hostName: '',
      hostReviews: '0 reviews',
      hostAvatar: 'https://pngpix.com/images/file/placeholder-profile-icon-20tehfawxt5eihco.jpg',
      checkIn: '',
      checkOut: '',
      guests: '0 guests',
      pricePerNight: '0.00 ج.م',
      nights: 0,
      subtotal: '0.00 ج.م',
      taxes: '0.00 ج.م',
      total: '0.00 ج.م'
    };
    this.currentReservation = null;
  }

  private getReservationStatusText(status: number): string {
    switch (status) {
      case 0: return 'REQUEST PENDING';
      case 1: return 'REQUEST APPROVED';
      case 2: return 'REQUEST DECLINED';
      case 3: return 'REQUEST CANCELLED';
      default: return 'UNKNOWN STATUS';
    }
  }

  private getHostMessage(status: number, responseMessage?: string): string {
    if (responseMessage) {
      return responseMessage;
    }

    switch (status) {
      case 0: return 'Your reservation request is pending approval.';
      case 1: return 'Your reservation has been approved!';
      case 2: return 'Unfortunately, this reservation request was declined.';
      case 3: return 'This reservation request was cancelled.';
      default: return 'Reservation status unknown.';
    }
  }

  private formatDate(date: Date): string {
    if (!date || isNaN(date.getTime())) return '';

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  private formatCurrency(amount: number): string {
    if (!amount) return '0.00 ج.م';

    return `${amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })} ج.م`;
  }

  private calculateTaxes(totalAmount: number, subtotal: number): string {
    const taxes = totalAmount - subtotal;
    return this.formatCurrency(Math.max(0, taxes));
  }

  // Public methods for UI interactions
  keepSearching(): void {
    console.log('Keep searching clicked');
    // TODO: Implement navigation to search page
  }

  closeReservation(): void {
    console.log('Close reservation clicked');
    // TODO: Implement close reservation logic
  }

  reportHost(): void {
    console.log('Report host clicked');
    // TODO: Implement report host functionality
  }

  // showPropertyDetails(): void {
  //   this.showBookingDetails = !this.showBookingDetails;
  // }

  // Helper methods
  get hasReservation(): boolean {
    return this.currentReservation !== null;
  }

  get isDeclined(): boolean {
    return this.currentReservation?.requestStatus === 2;
  }

  get isPending(): boolean {
    return this.currentReservation?.requestStatus === 0;
  }

  get isApproved(): boolean {
    return this.currentReservation?.requestStatus === 1;
  }

  get isCancelled(): boolean {
    return this.currentReservation?.requestStatus === 3;
  }

  // Method to refresh reservation data
  refreshReservationData(): void {
    if (this.selectedChatSession) {
      this.loadReservationData();
    }
  }

  // Get inquiry title based on status
  getInquiryTitle(): string {
    if (!this.hasReservation) {
      return 'No reservation request';
    }

    switch (this.currentReservation?.requestStatus) {
      case 0: return 'Inquiry pending';
      case 1: return 'Inquiry approved';
      case 2: return 'Inquiry declined';
      case 3: return 'Inquiry cancelled';
      default: return 'Inquiry status unknown';
    }
  }
}
