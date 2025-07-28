import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { UsersComponent } from '../pages/users/users';
import { Bookings } from '../pages/booking/bookings';
import { Property } from "../pages/property/property";

export interface AdminSection {
  id: string;
  name: string;
  icon: string;
  isActive: boolean;
}

@Component({
  selector: 'app-AdminDashboard',
  standalone: true,
  imports: [CommonModule, UsersComponent, Bookings, Property],
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
    this.setActiveSection('users');
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
}