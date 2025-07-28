import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserService, User, UserProfileDto } from '../../../../core/services/Admin/user-service';
import { Table, TableColumn, TableAction, PaginationInfo } from '../../table/table';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, Table],
  templateUrl: './users.html',
  styleUrls: ['./users.css']
})
export class UsersComponent implements OnInit, OnDestroy {
  // Component State
  users: User[] = [];
  loading = false;
  selectedUser: UserProfileDto | null = null;
  showUserDetails = false;
  
  // Subscription management
  private destroy$ = new Subject<void>();

  // Table configuration
  columns: TableColumn[] = [
    { 
      label: 'Name', 
      field: 'fullName', 
      sortable: true 
    },
    { 
      label: 'Email', 
      field: 'email', 
      sortable: true 
    },
    { 
      label: 'Phone', 
      field: 'phoneNumber', 
      sortable: false 
    },
    { 
      label: 'Country', 
      field: 'country', 
      sortable: true 
    },
    { 
      label: 'Status', 
      field: 'isConfirmed', 
      pipe: 'boolean', 
      sortable: true 
    },
    { 
      label: 'Join Date', 
      field: 'createAt', 
      pipe: 'date', 
      sortable: true 
    },
    // { 
    //   label: 'Actions', 
    //   field: 'actions', 
    //   sortable: false 
    // }
  ];

  actions: TableAction[] = [
    { 
      icon: 'fas fa-eye', 
      tooltip: 'View Details', 
      type: 'view', 
      color: '#007bff' 
    },
    
    { 
      icon: 'fas fa-trash', 
      tooltip: 'Delete User', 
      type: 'delete', 
      color: '#dc3545' 
    }
  ];

  paginationInfo: PaginationInfo = {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  };

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load all users from the API
   */
  loadUsers(): void {
    this.loading = true;
    
    this.userService.getAllUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (users) => {
          this.users = this.transformUsersForTable(users);
          this.updatePaginationInfo(users.length);
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading users:', error);
          this.loading = false;
          // You could add a toast notification here
        }
      });
  }

  /**
   * Transform users data for table display
   */
  private transformUsersForTable(users: User[]): any[] {
    return users.map(user => ({
      ...user,
      fullName: this.getFullName(user.firstName, user.lastName),
      phoneNumber: user.phoneNumber || 'N/A',
      country: user.country || 'N/A'
    }));
  }

  /**
   * Get full name from first and last name
   */
  private getFullName(firstName?: string, lastName?: string): string {
    const fullName = `${firstName || ''} ${lastName || ''}`.trim();
    return fullName || 'N/A';
  }

  /**
   * Update pagination information
   */
  private updatePaginationInfo(totalItems: number): void {
    this.paginationInfo = {
      ...this.paginationInfo,
      totalItems,
      totalPages: Math.ceil(totalItems / this.paginationInfo.itemsPerPage)
    };
  }

  /**
   * Handle table action clicks
   */
  onActionClick(event: { type: string; row: any }): void {
    const { type, row } = event;
    
    switch (type) {
      case 'view':
        this.viewUserDetails(row.id);
        break;
      case 'edit':
        this.editUser(row);
        break;
      case 'delete':
        this.deleteUser(row);
        break;
      default:
        console.warn('Unknown action type:', type);
    }
  }

  /**
   * View user details in modal
   */
  viewUserDetails(userId: string): void {
    if (!userId) {
      console.error('User ID is required');
      return;
    }

    this.loading = true;
    
    this.userService.getUserProfile(userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (userProfile) => {
          this.selectedUser = userProfile;
          this.showUserDetails = true;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading user details:', error);
          this.loading = false;
          // You could add a toast notification here
        }
      });
  }

  /**
   * Edit user functionality
   */
  editUser(user: any): void {
    if (!user) {
      console.error('User data is required for editing');
      return;
    }

    console.log('Edit user:', user);
    // TODO: Implement edit functionality
    // This could open an edit modal or navigate to edit page
  }

  /**
   * Delete user functionality
   */
  deleteUser(user: any): void {
    if (!user) {
      console.error('User data is required for deletion');
      return;
    }

    const userName = user.fullName || 'this user';
    const confirmed = confirm(`Are you sure you want to delete ${userName}?`);
    
    if (confirmed) {
      console.log('Delete user:', user);
      // TODO: Implement delete functionality
      // this.userService.deleteUser(user.id).subscribe(...)
    }
  }

  /**
   * Close user details modal
   */
  closeUserDetails(): void {
    this.showUserDetails = false;
    this.selectedUser = null;
  }

  /**
   * Handle page change in table
   */
  onPageChange(page: number): void {
    if (page < 1 || page > this.paginationInfo.totalPages) {
      return;
    }
    
    this.paginationInfo.currentPage = page;
    // If using server-side pagination, you would reload data here
    // this.loadUsers();
  }

  /**
   * Handle sort change in table
   */
  onSortChange(event: { field: string; direction: 'asc' | 'desc' }): void {
    console.log('Sort change:', event);
    // TODO: Implement sorting
    // If using server-side sorting, reload data with sort parameters
    // If using client-side sorting, sort the users array
  }

  /**
   * Get count of active users
   */
  get activeUsersCount(): number {
    return this.users.filter(user => user.isConfirmed).length;
  }

  /**
   * Get count of pending users (not confirmed)
   */
  get pendingUsersCount(): number {
    return this.users.filter(user => !user.isConfirmed).length;
  }

  /**
   * Check if user has profile picture
   */
  hasProfilePicture(user: UserProfileDto): boolean {
    return !!(user.profilePictureURL && user.profilePictureURL.trim());
  }

  /**
   * Get user initials for default avatar
   */
  getUserInitials(user: UserProfileDto): string {
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'U';
  }

  /**
   * Refresh users data
   */
  refreshUsers(): void {
    this.loadUsers();
  }

  /**
   * Track by function for performance optimization
   */
  trackByUserId(index: number, user: User): string {
    return user.id;
  }

  /**
   * Handle image loading errors
   */
  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.style.display = 'none';
    }
  }
}