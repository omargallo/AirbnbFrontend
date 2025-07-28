import { Component, OnInit } from '@angular/core';
import { PaymentDTO, PaymentService, PendingPaymentsResponse } from '../../core/services/payment/payment';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-host-wallet',
  templateUrl: './host-wallet.html',
  styleUrls: ['./host-wallet.css'],
  imports:[CommonModule]
})
export class HostWalletComponent implements OnInit {
  pendingPayments: PaymentDTO[] = [];
  transferredPayments: PaymentDTO[] = [];
  totalBalance: number = 0;
  isLoading = false;
  error: string | null = null;
  showAllPending = false;
  showAllTransferred = false;
  isCreatingAccount = false;

  currentUserId: string | null = null;
  userEmail: string = '';

  constructor(
    private paymentService: PaymentService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.currentUserId = this.authService.userId;
    if (this.currentUserId) {
      this.loadPayments();
    }
  }

  loadPayments() {
    if (!this.currentUserId) return;

    this.isLoading = true;
    this.error = null;

    this.paymentService.getPendingPaymentsForHost(this.currentUserId).subscribe({
      next: (response: PendingPaymentsResponse) => {
        if (response.success) {
          // Separate pending and transferred payments
          this.pendingPayments = response.payments.filter(p => !p.isTransferredToHost);
          this.transferredPayments = response.payments.filter(p => p.isTransferredToHost);

          // Calculate total balance (transferred payments)
          this.totalBalance = this.transferredPayments.reduce((sum, payment) => sum + payment.amount, 0);
        } else {
          this.error = response.message || 'Failed to load payments';
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading payments:', err);
        this.error = 'Failed to load payments. Please try again.';
        this.isLoading = false;
      }
    });
  }

  createStripeAccount() {
    if (!this.currentUserId || !this.userEmail) {
      // Prompt for email if not available
      this.userEmail = prompt('Please enter your email address:') || '';
      if (!this.userEmail) return;
    }

    this.isCreatingAccount = true;

    this.paymentService.createStripeAccount(this.userEmail, this.currentUserId!).subscribe({
      next: (response) => {
        if (response.success && response.url) {
          // Redirect to Stripe onboarding
          window.location.href = response.url;
        } else {
          this.error = response.message || 'Failed to create Stripe account';
        }
        this.isCreatingAccount = false;
      },
      error: (err) => {
        console.error('Error creating Stripe account:', err);
        this.error = 'Failed to create Stripe account. Please try again.';
        this.isCreatingAccount = false;
      }
    });
  }

  toggleShowAllPending() {
    this.showAllPending = !this.showAllPending;
  }

  toggleShowAllTransferred() {
    this.showAllTransferred = !this.showAllTransferred;
  }

  getDisplayedPendingPayments() {
    return this.showAllPending ? this.pendingPayments : this.pendingPayments.slice(0, 5);
  }

  getDisplayedTransferredPayments() {
    return this.showAllTransferred ? this.transferredPayments : this.transferredPayments.slice(0, 5);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleString();
  }

  formatAmount(amount: number): string {
    return `${amount} USD`;
  }
}
