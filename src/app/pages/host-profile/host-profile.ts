import { Component, OnInit } from '@angular/core';
import { HostprofileService, HostProfile } from '../../core/services/hostProfile/hostprofile-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-host-profile',
  templateUrl: './host-profile.html',
  styleUrls: ['./host-profile.css'],
  standalone: true,
  imports: [CommonModule, FormsModule] // Required for *ngIf and other directives
})
export class HostProfileComponent implements OnInit {
  host: HostProfile | null = null;
  isLoading = true;
  error: string | null = null;
  showFullBio = false;

  private hostId = '1a03e58e-535d-4dfb-918f-e27e5e3b4907';

  constructor(private HostprofileService: HostprofileService) { }

  ngOnInit(): void {
    this.loadHostProfile();
  }

  loadHostProfile(): void {
    this.isLoading = true;
    this.error = null;

    this.HostprofileService.getHostProfile(this.hostId).subscribe({
      next: (profile) => {
        this.host = profile;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load host profile. Please try again later.';
        this.isLoading = false;
        console.error('Error loading host profile:', err);
      }
    });
  }

  getYearsHosting(): number {
    if (!this.host?.createdAt) return 0;
    const createdDate = new Date(this.host.createdAt);
    const currentDate = new Date();
    return currentDate.getFullYear() - createdDate.getFullYear();
  }

  getAge(): number | null {
    if (!this.host?.birthDate) return null;
    const birthDate = new Date(this.host.birthDate);
    const currentDate = new Date();
    let age = currentDate.getFullYear() - birthDate.getFullYear();
    const monthDiff = currentDate.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  toggleBio(): void {
    this.showFullBio = !this.showFullBio;
  }

  // Safe getters for template
  get fullName(): string {
    return this.host ? `${this.host.firstName} ${this.host.lastName}` : '';
  }

  get profileImage(): string {
    return this.host?.profilePictureURL || 'assets/default-profile.png';
  }
}