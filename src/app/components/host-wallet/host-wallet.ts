import { Component, OnInit } from '@angular/core';
import {
  PaymentDTO,
  PaymentService,
  PendingPaymentsResponse,
} from '../../core/services/payment/payment';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';

enum PaymentStatus {
  Pending = 1,
  Processing = 2,
  Succeeded = 3,
  Failed = 4,
  Canceled = 5,
  Refunded = 6,
  RequiresAction = 7,
}

enum TransferStatus {
  NotTransferred = 1,
  PendingTransfer = 2,
  Transferred = 3,
  TransferFailed = 4,
}

@Component({
  selector: 'app-host-wallet',
  templateUrl: './host-wallet.html',
  styleUrls: ['./host-wallet.css'],
  imports: [CommonModule],
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
  needsToCreateStripeAccount: boolean = false;
  shouldShowPendingSection: boolean = false;

  constructor(
    private paymentService: PaymentService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.currentUserId = this.authService.userId;
    this.userEmail = localStorage.getItem('email') || '';
    if (this.currentUserId) {
      this.loadPayments();
    }
  }

  loadPayments() {
    if (!this.currentUserId) return;

    this.isLoading = true;
    this.error = null;

    this.paymentService.getHostPayments(this.currentUserId).subscribe({
      next: (response: PendingPaymentsResponse) => {
        if (response.success) {
          console.log('PendingPaymentsResponse', response);

          this.pendingPayments = response.payments.filter(
            (p) =>
              (p.status === PaymentStatus.Succeeded ||
                p.status === PaymentStatus.Pending) &&
              p.transferStatus === TransferStatus.PendingTransfer
          );

          this.transferredPayments = response.payments.filter(
            (p) => p.transferStatus === TransferStatus.Transferred
          );

          const pendingTransferPayments = this.pendingPayments.filter(
            (p) => p.transferStatus === TransferStatus.PendingTransfer
          );

          this.shouldShowPendingSection =
            this.transferredPayments.length === 0 ||
            pendingTransferPayments.length === 0;
          this.needsToCreateStripeAccount =
            this.shouldShowPendingSection &&
            this.transferredPayments.length == 0;

          this.totalBalance = this.transferredPayments.reduce(
            (sum, payment) => {
              const amountToAdd = payment.hostAmount ?? 0;
              return sum + amountToAdd;
            },
            0
          );
        } else {
          this.error = response.message || 'Failed to load payments';
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading payments:', err);
        this.error = 'Failed to load payments. Please try again.';
        this.isLoading = false;
      },
    });
  }

  createStripeAccount() {
    if (!this.currentUserId) {
      this.error = 'User not authenticated';
      return;
    }

    if (!this.userEmail) {
      this.userEmail = prompt('Please enter your email address:') || '';
      if (!this.userEmail) {
        return;
      }
    }

    this.isCreatingAccount = true;
    this.error = null;

    this.paymentService
      .createStripeAccount(this.userEmail, this.currentUserId)
      .subscribe({
        next: (response) => {
          if (response.success && response.url) {
            console.log('Redirect', response);
            window.location.href = response.url;
          } else {
            this.error = response.message || 'Failed to create Stripe account';
          }
          this.isCreatingAccount = false;
        },
        error: (err) => {
          console.error('Error creating Stripe account:', err);
          this.error =
            err.error?.message ||
            'Failed to create Stripe account. Please try again.';
          this.isCreatingAccount = false;
        },
      });
  }

  toggleShowAllPending() {
    this.showAllPending = !this.showAllPending;
  }

  toggleShowAllTransferred() {
    this.showAllTransferred = !this.showAllTransferred;
  }

  getDisplayedPendingPayments(): PaymentDTO[] {
    return this.showAllPending
      ? this.pendingPayments
      : this.pendingPayments.slice(0, 5);
  }

  getDisplayedTransferredPayments(): PaymentDTO[] {
    return this.showAllTransferred
      ? this.transferredPayments
      : this.transferredPayments.slice(0, 5);
  }

  formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  formatAmount(amount?: number): string {
    if (typeof amount !== 'number') return '$0.00 USD';
    const dollars = amount / 100;
    return `$${dollars.toFixed(2)} USD`;
  }

  getStatusText(status: number): string {
    switch (status) {
      case PaymentStatus.Pending:
        return 'Pending';
      case PaymentStatus.Processing:
        return 'Processing';
      case PaymentStatus.Succeeded:
        return 'Succeeded';
      case PaymentStatus.Failed:
        return 'Failed';
      case PaymentStatus.Canceled:
        return 'Canceled';
      case PaymentStatus.Refunded:
        return 'Refunded';
      case PaymentStatus.RequiresAction:
        return 'Requires Action';
      default:
        return 'Unknown';
    }
  }

  getTransferStatusText(transferStatus: number): string {
    switch (transferStatus) {
      case TransferStatus.NotTransferred:
        return 'Not Transferred';
      case TransferStatus.PendingTransfer:
        return 'Pending Transfer';
      case TransferStatus.Transferred:
        return 'Transferred';
      case TransferStatus.TransferFailed:
        return 'Transfer Failed';
      default:
        return 'Unknown';
    }
  }

  triggerTransfer(paymentId: number) {
    this.paymentService.transferToHost(paymentId).subscribe({
      next: (response) => {
        if (response.success) {
          this.loadPayments();
        } else {
          this.error = response.message || 'Transfer failed';
        }
      },
      error: (err) => {
        console.error('Transfer error:', err);
        this.error = 'Transfer failed. Please try again.';
      },
    });
  }
}
