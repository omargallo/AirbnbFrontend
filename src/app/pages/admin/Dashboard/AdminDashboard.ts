import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { UsersComponent } from '../pages/users/users';
import { Bookings } from '../pages/booking/bookings';
import { Property } from "../pages/property/property";

import { DashboarDetails } from '../pages/dashboard-details/dashboard-details'; // Import the new Dashboard component


export interface AdminSection {
  id: string;
  name: string;
  icon: string;
  isActive: boolean;
}

@Component({
  selector: 'app-AdminDashboard',
  standalone: true,

  imports: [CommonModule, UsersComponent, Bookings,DashboarDetails,Property], 

  templateUrl: './AdminDashboard.html',
  styleUrls: ['./AdminDashboard.css']
})
export class AdminDashboard implements OnInit {
  activeSection: string = 'dashboard'; // Changed default to 'dashboard'

  adminSections: AdminSection[] = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      icon: 'fas fa-tachometer-alt',
      isActive: true // Set dashboard as default active
    },
    {
      id: 'users',
      name: 'Users',
      icon: 'fas fa-users',
      isActive: false // Changed to false
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
    this.setActiveSection('dashboard'); // Set dashboard as default
  }

  setActiveSection(sectionId: string): void {
    // Reset all sections
    this.adminSections.forEach(section => section.isActive = false);
    
    // Set the selected section as active
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
}