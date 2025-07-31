import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { UsersComponent } from '../pages/users/users';
import { Bookings } from '../pages/booking/bookings';
import { Property } from "../pages/property/property";
import { DashboarDetails } from '../pages/dashboard-details/dashboard-details';
import { AnalyticsComponent } from '../pages/analytics/analytics';
import { ViolationsComponent } from '../pages/violations/violations';
import { PaymentsComponent } from '../pages/payments/payments';
import { AuthService } from '../../../core/services/auth.service'; 

export interface AdminSection {
  id: string;
  name: string;
  icon: string;
  isActive: boolean;
}

@Component({
  selector: 'app-AdminDashboard',
  standalone: true,
  imports: [
    CommonModule,
    UsersComponent,
    Bookings,
    DashboarDetails,
    Property,
    AnalyticsComponent,
    ViolationsComponent,
    PaymentsComponent
  ],
  templateUrl: './AdminDashboard.html',
  styleUrls: ['./AdminDashboard.css']
})
export class AdminDashboard implements OnInit {
  activeSection: string = 'dashboard';

  adminSections: AdminSection[] = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      icon: 'fas fa-tachometer-alt',
      isActive: true
    },
    {
      id: 'users',
      name: 'Users',
      icon: 'fas fa-users',
      isActive: false
    },
    {
      id: 'properties',
      name: 'Properties',
      icon: 'fas fa-building',
      isActive: false
    },
    {
      id: 'bookings',
      name: 'Bookings',
      icon: 'fas fa-calendar-check',
      isActive: false
    },
    {
      id: 'payments',
      name: 'Payments',
      icon: 'fas fa-money-check-alt',
      isActive: false
    },
    {
      id: 'analytics',
      name: 'Analytics',
      icon: 'fas fa-chart-bar',
      isActive: false
    },
    {
      id: 'violations',
      name: 'Violations',
      icon: 'fas fa-exclamation-triangle',
      isActive: false
    }
  ];

  constructor(
    private router: Router,
    private authService: AuthService // Inject AuthService
  ) {}

  ngOnInit(): void {
    this.setActiveSection('dashboard'); // Set dashboard as default
  }

  setActiveSection(sectionId: string): void {
    this.adminSections.forEach(section => section.isActive = false);
    
    const section = this.adminSections.find(s => s.id === sectionId);
    if (section) {
      section.isActive = true;
      this.activeSection = sectionId;
    }
  }

  onMenuSectionClick(section: AdminSection): void {
    this.setActiveSection(section.id);
  }

  isActiveSection(sectionId: string): boolean {
    return this.activeSection === sectionId;
  }

  getActiveSection(): AdminSection | undefined {
    return this.adminSections.find(section => section.isActive);
  }

  toggleMobileSidebar(): void {
    const sidebarContainer = document.querySelector('.sidebar-container');
    if (sidebarContainer) {
      sidebarContainer.classList.toggle('mobile-open');
    }
  }

  trackBySection(index: number, section: AdminSection): string {
    return section.id;
  }

  // Add logout method
  logout(): void {
    // Clear authentication data
    this.authService.clear();
    
    // Navigate to login page (adjust the route as needed)
    this.router.navigate(['']);
  }
}