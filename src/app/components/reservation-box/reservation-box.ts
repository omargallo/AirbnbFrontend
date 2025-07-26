import { Component, Input, OnInit, OnChanges, inject, SimpleChanges } from '@angular/core';
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
  @Input() ReservationWithProperty!: any | null;

  handleImgService = inject(HandleImgService);

  showBookingDetails = false;
  isLoading = false;
  error: string | null = null;

  // Current reservation from messages
  currentReservation: any | null = null;
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['ReservationWithProperty'] && changes['ReservationWithProperty'].currentValue) {
      console.log("🟢 ReservationWithProperty changed:", changes['ReservationWithProperty'].currentValue);
      this.loadReservationData();
    }

    if (this.selectedChatSession) {
      this.loadReservationData();
    }
  }

  private getCoverImage(images: any[]): string | null {
    if (!images || images.length === 0) return null;

    // Find the cover image (isCover: true)
    const coverImage = images.find(img => img.isCover === true && !img.isDeleted);

    if (coverImage?.imageUrl) {
      return this.handleImgService.handleImage(coverImage.imageUrl);
    }

    // If no cover image found, use the first non-deleted image
    const firstImage = images.find(img => !img.isDeleted);
    if (firstImage?.imageUrl) {
      return this.handleImgService.handleImage(firstImage.imageUrl);
    }

    return null;
  }
  private loadReservationData(): void {
    if (this.ReservationWithProperty) {
      const data = this.ReservationWithProperty;

      // Update reservation object with real data
      this.reservation = {
        // Property image from property data or chat session
        image: this.getCoverImage(data.proeprty?.images) ||
          'assets/images/deafult.png',

        // Status based on reservation request
        status: this.getReservationStatus(data.latestReservationRequest?.requestStatus),

        // Host message from reservation response
        hostMessage: data.latestReservationRequest?.responseMessage ||
          (data.latestReservationRequest ? 'Your reservation request has been submitted.' : 'No reservation requests yet.'),

        // Property details
        propertyName: data.proeprty?.title || data.chatSession?.propertyTitle || '',
        propertyType: data.proeprty?.city || 'Property',

        // Host details
        hostName: data.chatSession?.hostName || '',
        hostReviews: `${data.proeprty?.reviewCount || 0} reviews`,
        hostAvatar: data.proeprty?.hostPicture ?
          this.handleImgService.handleImage(data.proeprty.hostPicture) :
          'https://pngpix.com/images/file/placeholder-profile-icon-20tehfawxt5eihco.jpg',

        // Check-in/out details
        checkIn: this.formatDate(data.latestReservationRequest?.checkInDate),
        checkOut: this.formatDate(data.latestReservationRequest?.checkOutDate),
        guests: `${data.latestReservationRequest?.guestCount || 0} guests`,

        // Pricing details
        pricePerNight: this.formatCurrency(data.latestReservationRequest?.pricePerNight || data.proeprty?.pricePerNight || 0),
        nights: data.latestReservationRequest?.nightCount || 0,
        subtotal: this.formatCurrency((data.latestReservationRequest?.pricePerNight || 0) * (data.latestReservationRequest?.nightCount || 0)),
        taxes: this.formatCurrency(data.latestReservationRequest?.totalAmount ?
          (data.latestReservationRequest.totalAmount - ((data.latestReservationRequest.pricePerNight || 0) * (data.latestReservationRequest.nightCount || 0))) : 0),
        total: this.formatCurrency(data.latestReservationRequest?.totalAmount || 0)
      };
    }
  }

  private getReservationStatus(requestStatus: number | undefined): string {
    if (!requestStatus) return 'No Reservation';

    switch (requestStatus) {
      case 1: return 'Pending';
      case 2: return 'Approved';
      case 3: return 'Declined';
      case 4: return 'Cancelled';
      default: return 'Unknown';
    }
  }

  private formatDate(dateString: string): string {
    if (!dateString || dateString === '0001-01-01T00:00:00') return '';

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';

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

  // Computed properties for status checks
  get isPending(): boolean {
    return this.ReservationWithProperty?.latestReservationRequest?.requestStatus === 1;
  }

  get isApproved(): boolean {
    return this.ReservationWithProperty?.latestReservationRequest?.requestStatus === 2;
  }

  get isDeclined(): boolean {
    return this.ReservationWithProperty?.latestReservationRequest?.requestStatus === 3;
  }

  get isCancelled(): boolean {
    return this.ReservationWithProperty?.latestReservationRequest?.requestStatus === 4;
  }

  get hasReservation(): boolean {
    return !!this.ReservationWithProperty?.latestReservationRequest;
  }

  // Get inquiry title based on status
  getInquiryTitle(): string {
    if (this.isPending) return 'Reservation Request Pending';
    if (this.isApproved) return 'Reservation Approved!';
    if (this.isDeclined) return 'Reservation Declined';
    if (this.isCancelled) return 'Reservation Cancelled';
    return 'No Active Reservation';
  }

  refreshReservationData(): void {
    this.loadReservationData();
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
}