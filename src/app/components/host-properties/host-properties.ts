import { Component, OnInit } from '@angular/core';
import { HostPropertiesService } from '../../core/services/Property/HostPropertiesService';
import { PropertyDisplayDTO } from '../../core/services/Property/HostPropertiesService';

@Component({
  selector: 'app-host-properties',
  templateUrl: './host-properties.html',
  styleUrls: ['./host-properties.css']
})
export class HostProperties implements OnInit {
  properties: PropertyDisplayDTO[] = [];
  isLoading = true;
  error: string | null = null;
  viewMode: 'grid' | 'table' = 'grid';

  private hostId = '1d1afe4d-301c-4f72-9e41-5773d0d27fa2';

  constructor(private hostPropertiesService: HostPropertiesService) { }

  ngOnInit(): void {
    // this.loadHostProperties();
  }

  loadHostProperties(): void {
    this.isLoading = true;
    this.error = null;

    this.hostPropertiesService.getPropertiesByHostId(this.hostId).subscribe({
      next: (properties) => {
        this.properties = properties;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load properties. Please try again later.';
        this.isLoading = false;
        console.error('Error loading properties:', err);
      }
    });
  }

  refreshProperties(): void {
    this.loadHostProperties();
  }

  setViewMode(mode: 'grid' | 'table'): void {
    this.viewMode = mode;
  }

  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'grid' ? 'table' : 'grid';
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'action_required':
        return 'Action required';
      case 'in_progress':
        return 'In progress';
      case 'active':
        return 'Active';
      default:
        return 'Unknown';
    }
  }

}