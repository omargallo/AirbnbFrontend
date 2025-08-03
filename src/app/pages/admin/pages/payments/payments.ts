import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PaymentService, AdminPaymentDTO, PaginatedResult } from '../../../../core/services/Admin/payment-service';
import { Table, TableColumn, TableAction, PaginationInfo } from '../../table/table';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule, Table],
  templateUrl: './payments.html',
  styleUrls: ['./payments.css']
})
export class PaymentsComponent implements OnInit, OnDestroy {

  payments: AdminPaymentDTO[] = [];
  loading = false;
  loadingPaymentDetails = false;
  selectedPayment: AdminPaymentDTO | null = null;
  showPaymentDetails = false;
  showTransferModal = false;
  transferringPayment = false;
  
  private destroy$ = new Subject<void>();
  
  // Updated columns to show only 7 most important fields (+ 1 actions column = 8 total)
  columns: TableColumn[] = [
    { 
      label: 'Payment ID', 
      field: 'paymentId', 
      sortable: true 
    },
    { 
      label: 'Guest', 
      field: 'guestName', 
      sortable: true 
    },
    { 
      label: 'Host', 
      field: 'hostName', 
      sortable: true 
    },
    { 
      label: 'Amount', 
      field: 'amount', 
      pipe: 'currency', 
      sortable: true 
    },
    { 
      label: 'Payment Status', 
      field: 'paymentStatus', 
      sortable: true 
    },
    { 
      label: 'Transfer Status', 
      field: 'transferStatus', 
      sortable: true 
    },
    { 
      label: 'Payment Date', 
      field: 'paymentDate', 
      pipe: 'date', 
      sortable: true 
    }
  ];

  actions: TableAction[] = [
    { 
      icon: 'fas fa-eye', 
      tooltip: 'View Details', 
      type: 'view', 
      color: '#007bff' 
    },
    { 
      icon: 'fas fa-hand-holding-usd', 
      tooltip: 'Transfer to Host', 
      type: 'transfer', 
      color: '#28a745',
    }
  ];

  paginationInfo: PaginationInfo = {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  };

  constructor(private paymentService: PaymentService) {}

  ngOnInit(): void {
    this.loadPayments();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadPayments(): void {
    this.loading = true;
    
    this.paymentService.getAllPayments(this.paginationInfo.currentPage, this.paginationInfo.itemsPerPage)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result: PaginatedResult<AdminPaymentDTO>) => {
          this.payments = result.items;
          this.updatePaginationInfo(result.metaData);
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading payments:', error);
          this.loading = false;
        }
      });
  }

  private updatePaginationInfo(metaData: any): void {
    this.paginationInfo = {
      currentPage: metaData.page,
      totalPages: Math.ceil(metaData.total / metaData.pageSize),
      totalItems: metaData.total,
      itemsPerPage: metaData.pageSize
    };
  }

  onActionClick(event: { type: string; row: AdminPaymentDTO }): void {
    const { type, row } = event;
    
    switch (type) {
      case 'view':
        this.viewPaymentDetails(row);
        break;
      case 'transfer':
        this.showTransferConfirmation(row);
        break;
      default:
        console.warn('Unknown action type:', type);
    }
  }

  viewPaymentDetails(payment: AdminPaymentDTO): void {
    this.selectedPayment = payment;
    this.showPaymentDetails = true;
  }

  showTransferConfirmation(payment: AdminPaymentDTO): void {
    this.selectedPayment = payment;
    this.showTransferModal = true;
  }

  transferToHost(payment: AdminPaymentDTO): void {
    this.transferringPayment = true;
    
    this.paymentService.transferToHost(payment.paymentId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.transferringPayment = false;
          this.showTransferModal = false;
          
          if (response.success) {
            this.showSuccessModal('Transfer completed successfully!');
            this.loadPayments(); // Refresh the list
          } else {
            this.showErrorModal(`Transfer failed: ${response.message}`);
          }
        },
        error: (error) => {
          console.error('Error transferring payment:', error);
          this.transferringPayment = false;
          this.showTransferModal = false;
          this.showErrorModal('Transfer failed. Please try again.');
        }
      });
  }

  closeTransferModal(): void {
    this.showTransferModal = false;
    this.selectedPayment = null;
    this.transferringPayment = false;
  }

  // Success/Error modal states
  showSuccessMessage = false;
  showErrorMessage = false;
  modalMessage = '';

  showSuccessModal(message: string): void {
    this.modalMessage = message;
    this.showSuccessMessage = true;
    setTimeout(() => {
      this.showSuccessMessage = false;
    }, 3000);
  }

  showErrorModal(message: string): void {
    this.modalMessage = message;
    this.showErrorMessage = true;
  }

  closeMessageModal(): void {
    this.showSuccessMessage = false;
    this.showErrorMessage = false;
    this.modalMessage = '';
  }

  closePaymentDetails(): void {
    this.showPaymentDetails = false;
    this.selectedPayment = null;
  }

  onPageChange(page: number): void {
    if (page < 1 || page > this.paginationInfo.totalPages) {
      return;
    }
    
    this.paginationInfo.currentPage = page;
    this.loadPayments();
  }

  onSortChange(event: { field: string; direction: 'asc' | 'desc' }): void {
    console.log('Sort change:', event);
    // Implement sorting logic if needed
  }

  refreshPayments(): void {
    this.loadPayments();
  }

  // Stats calculations
  get totalPaymentsCount(): number {
    return this.paginationInfo.totalItems;
  }

  get completedPaymentsCount(): number {
    return this.payments.filter(p => p.paymentStatus === 'Succeeded').length;
  }

  get pendingTransfersCount(): number {
    return this.payments.filter(p => 
      p.paymentStatus === 'Succeeded' && 
      p.transferStatus === 'NotTransferred'
    ).length;
  }

  get transferredPaymentsCount(): number {
    return this.payments.filter(p => p.transferStatus === 'Transferred').length;
  }

  get totalRevenue(): number {
    return this.payments.reduce((sum, p) => sum + p.amount, 0);
  }

  get totalPlatformFees(): number {
    return this.payments.reduce((sum, p) => sum + p.platformFee, 0);
  }

  getStatusBadgeClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'succeeded':
        return 'badge-success';
      case 'processing':
        return 'badge-warning';
      case 'failed':
        return 'badge-danger';
      case 'transferred':
        return 'badge-success';
      case 'nottransferred':
        return 'badge-warning';
      case 'pendingtransfer':
        return 'badge-info';
      case 'transferfailed':
        return 'badge-danger';
      default:
        return 'badge-secondary';
    }
  }

  trackByPaymentId(index: number, payment: AdminPaymentDTO): number {
    return payment.paymentId;
  }

  canTransferPayment(payment: AdminPaymentDTO): boolean {
  return payment.paymentStatus === 'Succeeded' && 
         (payment.transferStatus === 'PendingTransfer' || payment.transferStatus === 'TransferFailed') &&
         payment.hostAccountCompleted;
}

}   



