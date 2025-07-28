import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

// Import the users component
import { UsersComponent } from '../pages/users/users';

export interface AdminSection {
  id: string;
  name: string;
  icon: string;
  isActive: boolean;
}

@Component({
  selector: 'app-AdminDashboard',
  standalone: true,
  imports: [CommonModule, UsersComponent],
  templateUrl: './AdminDashboard.html',
  styleUrls: ['./AdminDashboard.css']
})
export class AdminDashboard implements OnInit {
  activeSection: string = 'users';

  adminSections: AdminSection[] = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      icon: 'fas fa-tachometer-alt',
      isActive: false
    },
    {
      id: 'users',
      name: 'Users',
      icon: 'fas fa-users',
      isActive: true
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
    }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Set initial active section
    this.setActiveSection('users');
  }

  /**
   * Set active section and update UI
   */
  setActiveSection(sectionId: string): void {
    // Update all sections to inactive
    this.adminSections.forEach(section => section.isActive = false);
    
    // Set the clicked section as active
    const section = this.adminSections.find(s => s.id === sectionId);
    if (section) {
      section.isActive = true;
      this.activeSection = sectionId;
    }
  }

  /**
   * Handle menu section click
   */
  onMenuSectionClick(section: AdminSection): void {
    this.setActiveSection(section.id);
  }

  /**
   * Check if section is active
   */
  isActiveSection(sectionId: string): boolean {
    return this.activeSection === sectionId;
  }

  /**
   * Get active section object
   */
  getActiveSection(): AdminSection | undefined {
    return this.adminSections.find(section => section.isActive);
  }

  /**
   * Toggle mobile sidebar
   */
  toggleMobileSidebar(): void {
    const sidebarContainer = document.querySelector('.sidebar-container');
    if (sidebarContainer) {
      sidebarContainer.classList.toggle('mobile-open');
    }
  }

  /**
   * Track by function for ngFor
   */
  trackBySection(index: number, section: AdminSection): string {
    return section.id;
  }
}