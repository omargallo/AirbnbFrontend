import { Component, Input, Output, EventEmitter, inject, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { PropertyAcceptStatus } from '../../add-property/models/property.model';




export interface TableColumn {
  label: string;
  field: string;
  pipe?: string;
  sortable?: boolean;
  sortDirection?: 'asc' | 'desc' | null;
}

export interface TableAction {
  icon: string;
  tooltip?: string;
  type: string;
  color?: string;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface SortEvent {
  field: string;
  direction: 'asc' | 'desc';
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table.html',
  styleUrls: ['./table.css']
})
export class Table implements OnChanges {
  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];
  @Input() actions: TableAction[] = [];
  @Input() loading: boolean = false;
  @Input() striped: boolean = false;
  @Input() hoverable: boolean = true;
  @Input() caption: string = '';

  // Backend pagination inputs
  @Input() paginationInfo: PaginationInfo = {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 5
  };

  @Input() useBackendPagination: boolean = false;

  @Input() currentSort: { field: string; direction: 'asc' | 'desc' } | null = null;

  @Output() actionClick = new EventEmitter<{ type: string; row: any }>();
  @Output() pageChange = new EventEmitter<number>();
  @Output() sortChange = new EventEmitter<SortEvent>();
  @Output() nameClick = new EventEmitter<any>();

  private clientCurrentPage: number = 1;
  private document = inject(DOCUMENT);

  ngOnChanges(changes: SimpleChanges) {
    console.log(" data is",this.data)
    if (changes['data']) {
      console.log('🔍 Table received data:', this.data);
      console.log('🔍 Table data length:', this.data?.length);
      console.log('🔍 Table columns:', this.columns);
      console.log('🔍 Loading state:', this.loading);
      console.log('🔍 Backend pagination:', this.useBackendPagination);
      console.log('🔍 Pagination info:', this.paginationInfo);
    }

    if (changes['currentSort']) {
      this.updateColumnSortStates();
    }
  }

  get isDarkMode(): boolean {
    return this.document.body.classList.contains('dark-mode');
  }

  get displayData() {
    if (this.useBackendPagination) {
      return this.data || [];
    } else {
      const start = (this.clientCurrentPage - 1) * this.paginationInfo.itemsPerPage;
      return (this.data || []).slice(start, start + this.paginationInfo.itemsPerPage);
    }
  }

  get currentPage(): number {
    return this.useBackendPagination ? this.paginationInfo.currentPage : this.clientCurrentPage;
  }

  get totalPages(): number {
    if (this.useBackendPagination) {
      return this.paginationInfo.totalPages;
    } else {
      return Math.ceil((this.data?.length || 0) / this.paginationInfo.itemsPerPage);
    }
  }

  get totalItems(): number {
    return this.useBackendPagination ? this.paginationInfo.totalItems : (this.data?.length || 0);
  }

  changePage(delta: number) {
    const newPage = this.currentPage + delta;
    if (newPage > 0 && newPage <= this.totalPages) {
      if (this.useBackendPagination) {
        this.pageChange.emit(newPage);
      } else {
        this.clientCurrentPage = newPage;
      }
    }
  }

  goToPage(page: number) {
    if (page > 0 && page <= this.totalPages) {
      if (this.useBackendPagination) {
        this.pageChange.emit(page);
      } else {
        this.clientCurrentPage = page;
      }
    }
  }

  onSort(column: TableColumn) {
    if (!column.sortable) return;

    let direction: 'asc' | 'desc' = 'asc';

    if (this.currentSort?.field === column.field) {
      direction = this.currentSort.direction === 'asc' ? 'desc' : 'asc';
    }

    this.sortChange.emit({ field: column.field, direction });
  }

  private updateColumnSortStates() {
    this.columns.forEach(col => {
      if (this.currentSort?.field === col.field) {
        col.sortDirection = this.currentSort.direction;
      } else {
        col.sortDirection = null;
      }
    });
  }

  getSortIcon(column: TableColumn): string {
    if (!column.sortable) return '';

    if (column.sortDirection === 'asc') {
      return 'fas fa-sort-up';
    } else if (column.sortDirection === 'desc') {
      return 'fas fa-sort-down';
    } else {
      return 'fas fa-sort';
    }
  }

  handleActionClick(type: string, row: any) {
    this.actionClick.emit({ type, row });
  }

  getVisiblePages(): number[] {
    const current = this.currentPage;
    const total = this.totalPages;
    const maxVisible = 5;

    if (total <= maxVisible) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const start = Math.max(1, current - Math.floor(maxVisible / 2));
    const end = Math.min(total, start + maxVisible - 1);

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  formatCellValue(value: any, pipe?: string): string {
    if (value === null || value === undefined) {
      return '';
    }

    switch (pipe) {
      case 'boolean':
        return value ? 'Active' : 'Inactive';
      case 'date':
        return new Date(value).toLocaleString();
      default:
        return value;
    }
  }


  Math = Math;

}