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

  users: User[] = [];
  loading = false; // For main users list loading
  loadingUserDetails = false; // Separate loading state for user details
  selectedUser: UserProfileDto | null = null;
  showUserDetails = false;
  
  private destroy$ = new Subject<void>();
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
        }
      });
  }

  private transformUsersForTable(users: User[]): any[] {
    return users.map(user => ({
      ...user,
      fullName: this.getFullName(user.firstName, user.lastName),
      phoneNumber: user.phoneNumber || 'N/A',
      country: user.country || 'N/A'
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

  
  onActionClick(event: { type: string; row: any }): void {
    const { type, row } = event;
    
    switch (type) {
      case 'view':
        this.viewUserDetails(row.id);
        break;
      case 'delete':
        this.deleteUser(row);
        break;
      default:
        console.warn('Unknown action type:', type);
    }
  }

  
  viewUserDetails(userId: string): void {
    if (!userId) {
      console.error('User ID is required');
      return;
    }

    // Use separate loading state for user details
    this.loadingUserDetails = true;
    
    this.userService.getUserProfile(userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (userProfile) => {
          this.selectedUser = userProfile;
          this.showUserDetails = true;
          this.loadingUserDetails = false;
        },
        error: (error) => {
          console.error('Error loading user details:', error);
          this.loadingUserDetails = false;
        }
      });
  }

  
  
  deleteUser(user: any): void {
    if (!user) {
      console.error('User data is required for deletion');
      return;
    }

    const userName = user.fullName || 'this user';
    const confirmed = confirm(`Are you sure you want to delete ${userName}?`);
    
    if (confirmed) {
      console.log('Delete user:', user);
      
    }
  }

  closeUserDetails(): void {
    this.showUserDetails = false;
    this.selectedUser = null;
    this.loadingUserDetails = false; // Reset loading state
  }

  
  onPageChange(page: number): void {
    if (page < 1 || page > this.paginationInfo.totalPages) {
      return;
    }
    
    this.paginationInfo.currentPage = page;
    
  }

  onSortChange(event: { field: string; direction: 'asc' | 'desc' }): void {
    console.log('Sort change:', event);
    
  }

  
  get activeUsersCount(): number {
    return this.users.filter(user => user.isConfirmed).length;
  }


  get pendingUsersCount(): number {
    return this.users.filter(user => !user.isConfirmed).length;
  }

  hasProfilePicture(user: UserProfileDto): boolean {
    return !!(user.profilePictureURL && user.profilePictureURL.trim());
  }

  getUserInitials(user: UserProfileDto): string {
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'U';
  }

  refreshUsers(): void {
    this.loadUsers();
  }

  trackByUserId(index: number, user: User): string {
    return user.id;
  }

  
  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.style.display = 'none';
    }
  }
}