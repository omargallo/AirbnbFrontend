import { Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { ViolationService, PropertyViolationDetailsDTO, UpdateViolationDTO, PropertyViolationsStatus } from '../../../../core/services/Admin/violation-service';
import { Table, TableColumn, TableAction, PaginationInfo } from '../../table/table';

@Component({
  selector: 'app-violations',
  standalone: true,
  imports: [CommonModule, FormsModule, Table],
  templateUrl: './violations.html',
  styleUrls: ['./violations.css']
  // Temporarily remove OnPush to test if this is causing the click issues
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViolationsComponent implements OnInit, OnDestroy {

  violations: PropertyViolationDetailsDTO[] = [];
  loading = false;
  loadingViolationDetails = false;
  selectedViolation: PropertyViolationDetailsDTO | null = null;
  showViolationDetails = false;
  showEditModal = false;
  
  // Cached computed values to prevent recalculation on every change detection
  private _pendingViolationsCount = 0;
  private _solvedViolationsCount = 0;
  private _dismissedViolationsCount = 0;
  
  // Edit form data
  editForm: UpdateViolationDTO = {
    id: 0,
    adminNotes: '',
    status: PropertyViolationsStatus.Pending
  };

  private destroy$ = new Subject<void>();
  
  columns: TableColumn[] = [
    { 
      label: 'ID', 
      field: 'id', 
      sortable: true 
    },
    { 
      label: 'Property', 
      field: 'propertyTitle', 
      sortable: true 
    },
    { 
      label: 'User', 
      field: 'userFullName', 
      sortable: true 
    },
    { 
      label: 'Location', 
      field: 'location', 
      sortable: false 
    },
    { 
      label: 'Status', 
      field: 'status', 
      sortable: true,
      pipe: 'status'
    },
    { 
      label: 'Date', 
      field: 'createdAt', 
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
      icon: 'fas fa-edit', 
      tooltip: 'Edit Violation', 
      type: 'edit', 
      color: '#28a745' 
    }
  ];

  paginationInfo: PaginationInfo = {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  };

  // Cached status options to prevent recreation on every call
  private _statusOptions: { value: string; label: string; color: string }[] = [];

  constructor(
    private violationService: ViolationService,
    private cdr: ChangeDetectorRef
  ) {
    // Initialize cached status options after service is available
    this._statusOptions = this.violationService.getStatusOptions();
  }

  ngOnInit(): void {
    this.loadViolations();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadViolations(): void {
    this.loading = true;
    
    this.violationService.getAllViolations()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges(); // Manually trigger change detection
        })
      )
      .subscribe({
        next: (violations) => {
          this.violations = this.transformViolationsForTable(violations);
          this.updatePaginationInfo(violations.length);
          this.calculateViolationCounts(); // Cache the counts
        },
        error: (error) => {
          console.error('Error loading violations:', error);
        }
      });
  }

  private transformViolationsForTable(violations: PropertyViolationDetailsDTO[]): any[] {
    return violations.map(violation => ({
      ...violation,
      userFullName: this.getFullName(violation.firstName, violation.lastName),
      location: `${violation.city}, ${violation.country}`,
      statusColor: this.violationService.getStatusColor(violation.status)
    }));
  }

  private getFullName(firstName?: string, lastName?: string): string {
    const fullName = `${firstName || ''} ${lastName || ''}`.trim();
    return fullName || 'N/A';
  }

  private updatePaginationInfo(totalItems: number): void {
    this.paginationInfo = {
      ...this.paginationInfo,
      totalItems,
      totalPages: Math.ceil(totalItems / this.paginationInfo.itemsPerPage)
    };
  }

  private calculateViolationCounts(): void {
    this._pendingViolationsCount = this.violations.filter(v => v.status === PropertyViolationsStatus.Pending).length;
    this._solvedViolationsCount = this.violations.filter(v => v.status === PropertyViolationsStatus.Solved).length;
    this._dismissedViolationsCount = this.violations.filter(v => v.status === PropertyViolationsStatus.Dismissed).length;
  }

  onActionClick(event: { type: string; row: any }): void {
    const { type, row } = event;
    
    switch (type) {
      case 'view':
        this.viewViolationDetails(row.id);
        break;
      case 'edit':
        this.editViolation(row);
        break;
      default:
        console.warn('Unknown action type:', type);
    }
    
    // Manually trigger change detection after handling the action
    this.cdr.detectChanges();
  }

  viewViolationDetails(violationId: number): void {
    if (!violationId) {
      console.error('Violation ID is required');
      return;
    }

    this.loadingViolationDetails = true;
    
    this.violationService.getViolationById(violationId)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.loadingViolationDetails = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (violation) => {
          this.selectedViolation = violation;
          this.showViolationDetails = true;
        },
        error: (error) => {
          console.error('Error loading violation details:', error);
        }
      });
  }

  editViolation(violation: PropertyViolationDetailsDTO): void {
    this.selectedViolation = violation;
    this.editForm = {
      id: violation.id,
      adminNotes: violation.adminNotes || '',
      status: violation.status
    };
    this.showEditModal = true;
    
    // Trigger change detection to update the UI
    this.cdr.detectChanges();
  }

  saveViolation(): void {
    if (!this.editForm.id) {
      console.error('Violation ID is required');
      return;
    }

    this.loading = true;
    
    this.violationService.updateViolation(this.editForm.id, this.editForm)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (response) => {
          console.log('Violation updated successfully:', response);
          this.closeEditModal();
          // Use setTimeout to prevent immediate change detection cycles
          setTimeout(() => {
            this.loadViolations();
          }, 100);
        },
        error: (error) => {
          console.error('Error updating violation:', error);
        }
      });
  }

  closeViolationDetails(): void {
    this.showViolationDetails = false;
    this.selectedViolation = null;
    this.loadingViolationDetails = false;
    
    // Trigger change detection to update the UI
    this.cdr.detectChanges();
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.selectedViolation = null;
    this.editForm = {
      id: 0,
      adminNotes: '',
      status: PropertyViolationsStatus.Pending
    };
    
    // Trigger change detection to update the UI
    this.cdr.detectChanges();
  }

  onPageChange(page: number): void {
    if (page < 1 || page > this.paginationInfo.totalPages) {
      return;
    }
    
    this.paginationInfo.currentPage = page;
    
    // Trigger change detection for pagination updates
    this.cdr.detectChanges();
  }

  onSortChange(event: { field: string; direction: 'asc' | 'desc' }): void {
    console.log('Sort change:', event);
  }

  // Use cached values instead of computing on every change detection
  get pendingViolationsCount(): number {
    return this._pendingViolationsCount;
  }

  get solvedViolationsCount(): number {
    return this._solvedViolationsCount;
  }

  get dismissedViolationsCount(): number {
    return this._dismissedViolationsCount;
  }

  refreshViolations(): void {
    this.loadViolations();
  }

  trackByViolationId(index: number, violation: PropertyViolationDetailsDTO): number {
    return violation.id;
  }

  // Use cached status options
  getStatusOptions() {
    return this._statusOptions;
  }

  getStatusColor(status: string): string {
    return this.violationService.getStatusColor(status);
  }

  getStatusLabel(status: string): string {
    return this.violationService.getStatusLabel(status);
  }
}