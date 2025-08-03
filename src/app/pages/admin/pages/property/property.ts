import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserService, User, UserProfileDto } from '../../../../core/services/Admin/user-service';
import { Table, TableColumn, TableAction, PaginationInfo } from '../../table/table';
import { PropertyAcceptStatus, PropertyDisplayWithHostDataDto } from '../../../add-property/models/property.model';
import { PropertyDisplayDTO } from '../../../../core/models/PropertyDisplayDTO';
import { PropertyService } from '../../../../core/services/Property/property.service';
import { PropertyInfo } from "../../../property-info/property-info";
import { ConfirmService } from '../../../../core/services/confirm.service';
import { PropertyActivateModal } from "./components/property-activate-modal/property-activate-modal";

@Component({
  selector: 'app-property',
  imports: [CommonModule, Table, PropertyInfo, PropertyActivateModal],
  templateUrl: './property.html',
  styleUrl: './property.css'
})
export class Property {

  properties: PropertyDisplayWithHostDataDto[] = [];
  loading = false;
  selectedProperty: PropertyDisplayDTO | null = null;
  showUserDetails = false;
  previewPropertyId?:number
  currentSort: {field:string,direction:"desc"| "asc"} = {field: "title", direction:"asc"}

  // Subscription management
  private destroy$ = new Subject<void>();

  // Table configuration
  columns: TableColumn[] = [
    { 
      label: '#', 
      field: 'id', 
      sortable: true 
    },
    { 
      label: 'Title', 
      field: 'title', 
      sortable: false 
    },
    { 
      label: 'Country', 
      field: 'country', 
      sortable: false 
    },
    { 
      label: 'Status', 
      field: 'status', 
      pipe: 'acceptStatus', 
      sortable: false 
    },
    { 
      label: 'Active', 
      field: 'isActive', 
      pipe: 'deletedStatus', 
      sortable: true 
    },
    { 
      label: 'Average Rate', 
      field: 'averageRating',  
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
    }
  ];

  paginationInfo: PaginationInfo = {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  };

  constructor(
    private propertyService: PropertyService,
    private confirm: ConfirmService
  ) {}

  ngOnInit(): void {
    this.loadProperties();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load all users from the API
   */
  loadProperties(): void {
    this.loading = true;
    
    this.propertyService.getAllForDashboard()
      .pipe(takeUntil(this.destroy$))
      
      .subscribe({
        next: (props) => {
          this.properties =props //this.transformUsersForTable(users);
          console.log("properties loaded: ",props)
          this.updatePaginationInfo(props.length);
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
  // private transformUsersForTable(props: PropertyDisplayDTO[]): any[] {
  //   return props.map(user => ({
  //     ...user,
  //     phoneNumber: user.phoneNumber || 'N/A',
  //     country: user.country || 'N/A'
  //   }));
  // }

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
        this.editProperty(row);
        break;
      case 'delete':
        this.deleteProperty(row);
        break;
      default:
        console.warn('Unknown action type:', type);
    }
  }

  /**
   * View user details in modal
   */
  viewUserDetails(propertyId?:number): void {
    if (!propertyId) {
      console.error('User ID is required');
      return;
    }
    this.previewPropertyId = propertyId

    // this.loading = true;
    
    this.propertyService.getByIdWithCover(propertyId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (prop) => {
          console.log("userProfile",prop)
          this.selectedProperty = prop;
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

  getStatusColor(status?: PropertyAcceptStatus): string {
    if(!status )
      return'';
    switch (PropertyAcceptStatus[status].toLowerCase()) {
      case 'accepted':
        return '#28a745';
      case 'pending':
        return '#ffc107';
      case 'rejected':
        return '#dc3545';
      case 'confirmed':
        return '#17a2b8';
      default:
        return '#6c757d';
    }
  }
  get propertyStatusName():string{
    if(!this.selectedProperty)
      return ''
    let name = PropertyAcceptStatus[this.selectedProperty.status] 
    return name.charAt(0).toUpperCase() + name.slice(1)
  }
  /**
   * Edit user functionality
   */
  editProperty(user: any): void {
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
  deleteProperty(property: any): void {
    if (!property) {
      console.error('User data is required for deletion');
      return;
    }

    const userName = property.fullName || 'this user';
    const confirmed = confirm(`Are you sure you want to delete ${userName}?`);
    
    if (confirmed) {
      console.log('Delete user:', property);
      // TODO: Implement delete functionality
      // this.userService.deleteUser(user.id).subscribe(...)
    }
  }

  /**
   * Close user details modal
   */
  closePropertyDetails(): void {
    this.showUserDetails = false;
    this.selectedProperty = null;
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
    this.currentSort = event
    switch(event.field){
      // case "status":
      //   if(event.direction== "asc")
      //     this.properties = this.properties.sort((a,b)=> a.status-b.status )
      //   else
      //     this.properties = this.properties.sort((a,b)=> b.status-a.status )
      //   break;

      case "id":
        if(event.direction== "asc")
          this.properties = this.properties.sort((a,b)=> (a.id??0)-(b.id??0) )
        else
          this.properties = this.properties.sort((a,b)=> (b.id??0)-(a.id??0) )
        break;
      case "averageRating":
        if(event.direction== "asc")
          this.properties = this.properties.sort((a,b)=> a.averageRating-b.averageRating )
        else
          this.properties = this.properties.sort((a,b)=> b.averageRating-a.averageRating )
        
        break;
      case "isDeleted":
        if(event.direction== "asc")
          this.properties = this.properties.sort((a,b)=> a.isDeleted?-1:1 )
        else
          this.properties = this.properties.sort((a,b)=> b.isDeleted?-1:1 )
        console.log("this.currentSort",this.currentSort)
        break;
    }
    // TODO: Implement sorting
    // If using server-side sorting, reload data with sort parameters
    // If using client-side sorting, sort the users array
  }

  /**
   * Get count of active users
   */
  get acceptedPropertyCount(): number {
    return this.properties.filter(prop => prop.status == PropertyAcceptStatus.accepted).length;
  }

  /**
   * Get count of pending users (not confirmed)
   */
  get pendingPropertyCount(): number {
    return this.properties.filter(prop => prop.status == PropertyAcceptStatus.pending).length;
  }
  get rejectedPropertyCount():number{
    
    return this.properties.filter(prop => prop.status == PropertyAcceptStatus.rejected).length;
  }
  get deletedPropertyCount():number{
    return this.properties.filter(prop => prop.isDeleted).length;
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
    this.loadProperties();
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


  acceptProperty(){
    if(this.selectedProperty?.id)
      this.propertyService
            .accept(this.selectedProperty?.id)
            .subscribe(
              {
                next:(res)=>{
                  this.confirm.success("Property Accepted","")
                  let prop = this.properties.find(p=> p.id == this.selectedProperty?.id)
                  if(prop)
                    prop.status = PropertyAcceptStatus.accepted
                  if(this.selectedProperty)
                    this.selectedProperty.status = PropertyAcceptStatus.accepted  
                },
                error:(err)=>{
                  if(err?.data?.message)
                    this.confirm.fail(err.data.message,"")
                  else                    
                    this.confirm.fail("something went wrong, try again!","")
                }

              }
            )
  }
  rejectProperty(){
    if(this.selectedProperty?.id)
      this.propertyService
            .reject(this.selectedProperty?.id)
            .subscribe(
              {
                next:(res)=>{
                  this.confirm.success("Property Rejected","")
                  
                  let prop = this.properties.find(p=> p.id == this.selectedProperty?.id)
                  if(prop)
                    prop.status = PropertyAcceptStatus.rejected
                  if(this.selectedProperty)
                    this.selectedProperty.status = PropertyAcceptStatus.rejected
                },
                error:(err)=>{
                  if(err?.data?.message)
                    this.confirm.fail(err.data.message,"")
                  else                    
                    this.confirm.fail("something went wrong, try again!","")
                }

              }
            )
  }
}
