import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

export interface GuestsSectionData {
  maxGuests: number;
}

interface GuestIcon {
  id: string;
  url: string;
  index: number;
}

@Component({
  selector: 'app-guests-section',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  styleUrls: ['../update-list.css','./guests-section.css'],
  templateUrl: './guests-section.html',
})
export class GuestsSectionComponent implements OnInit, OnDestroy, OnChanges {
  @Input() data: GuestsSectionData | null = null;
  
  @Output() dataChange = new EventEmitter<GuestsSectionData>();
  @Output() hasChanges = new EventEmitter<boolean>();
  @Output() validationChange = new EventEmitter<boolean>();

  guestsForm!: FormGroup;
  private destroy$ = new Subject<void>();
  private initialValue: number = 1;
  private isInitialized = false;

  // Guest icons array
  private guestIconUrls = [
    'https://a0.muscache.com/im/pictures/mediaverse/MYS%20Number%20of%20Guests/original/354bca63-8008-45d7-b76f-c1c19a788825.png',
    'https://a0.muscache.com/im/pictures/mediaverse/MYS%20Number%20of%20Guests/original/5a0d9cb7-0aea-44e9-a61a-017685c6d2d0.png',
    'https://a0.muscache.com/im/pictures/mediaverse/MYS%20Number%20of%20Guests/original/244dc498-e875-449e-b855-5d13b8f44d50.png',
    'https://a0.muscache.com/im/pictures/mediaverse/MYS%20Number%20of%20Guests/original/70da4d82-9182-4edf-a4ef-97326fcfdd0b.png',
    'https://a0.muscache.com/im/pictures/mediaverse/MYS%20Number%20of%20Guests/original/48b87e37-cd4a-4a56-9422-79e278764b6e.png',
    'https://a0.muscache.com/im/pictures/mediaverse/MYS%20Number%20of%20Guests/original/bd44136d-ddda-4f3e-916c-3dcc816e5fa5.png',
    'https://a0.muscache.com/im/pictures/mediaverse/MYS%20Number%20of%20Guests/original/708f660d-443a-4283-9c36-484029accd65.png',
    'https://a0.muscache.com/im/pictures/mediaverse/MYS%20Number%20of%20Guests/original/84572734-6766-47a9-9fb8-f7ee9a70f63a.png',
    'https://a0.muscache.com/im/pictures/mediaverse/MYS%20Number%20of%20Guests/original/8b0a737b-2c87-43b6-a4a2-dce4ebcb1bdf.png',
    'https://a0.muscache.com/im/pictures/mediaverse/MYS%20Number%20of%20Guests/original/2a8e78db-8781-4bc7-a746-bef45ed6aed9.png',
    'https://a0.muscache.com/im/pictures/mediaverse/MYS%20Number%20of%20Guests/original/701cd29e-3c5e-4055-b54f-2ced17b792d6.png',
    'https://a0.muscache.com/im/pictures/mediaverse/MYS%20Number%20of%20Guests/original/50f7cb91-d0fe-4726-963c-7242660b1db3.png'
  ];

  // Stable guest icons array to prevent refresh
  guestIcons: GuestIcon[] = [];

  constructor(private fb: FormBuilder) {
    this.initializeForm();
    this.initializeGuestIcons();
  }

  ngOnInit(): void {
    this.setupFormData();
    this.setupFormChangeTracking();
    this.isInitialized = true;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && changes['data'].currentValue && this.isInitialized) {
      this.setupFormData();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    this.guestsForm = this.fb.group({
      maxGuests: [1, [Validators.required, Validators.min(1), Validators.max(16)]]
    });
  }

  private initializeGuestIcons(): void {
    // Create a stable array of guest icons with unique IDs
    for (let i = 0; i < 16; i++) {
      const iconIndex = i % this.guestIconUrls.length;
      this.guestIcons.push({
        id: `guest-${i}`,
        url: this.guestIconUrls[iconIndex],
        index: i
      });
    }
  }

  private setupFormData(): void {
    if (this.data) {
      this.initialValue = this.data.maxGuests;
      this.guestsForm.patchValue({ maxGuests: this.data.maxGuests }, { emitEvent: false });
    }
  }

  private setupFormChangeTracking(): void {
    this.guestsForm.get('maxGuests')?.valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((value) => {
        const numericValue = Number(value) || 1;
        const hasChanges = numericValue !== this.initialValue;
        const isValid = this.guestsForm.valid;
        
        // Emit events to parent
        this.hasChanges.emit(hasChanges);
        this.validationChange.emit(isValid);
        
        // Always emit data change for parent to track current state
        this.dataChange.emit({ maxGuests: numericValue });
      });
  }

  getCurrentGuestCount(): number {
    return this.guestsForm.get('maxGuests')?.value || 1;
  }

  incrementGuests(): void {
    const current = this.getCurrentGuestCount();
    if (current < 16) {
      this.guestsForm.patchValue({ maxGuests: current + 1 });
    }
  }

  decrementGuests(): void {
    const current = this.getCurrentGuestCount();
    if (current > 1) {
      this.guestsForm.patchValue({ maxGuests: current - 1 });
    }
  }

  getGuestIconsToShow(): GuestIcon[] {
    const guestCount = this.getCurrentGuestCount();
    return this.guestIcons.slice(0, Math.min(guestCount, 16));
  }

  trackByGuestIcon(index: number, icon: GuestIcon): string {
    return icon.id;
  }

  // Public methods that parent might need
  updateInitialValue(): void {
    this.initialValue = Number(this.guestsForm.get('maxGuests')?.value) || 1;
  }

  getCurrentData(): GuestsSectionData {
    return { maxGuests: Number(this.guestsForm.get('maxGuests')?.value) || 1 };
  }

  resetForm(): void {
    this.guestsForm.patchValue({ maxGuests: this.initialValue });
  }

  get hasFormChanges(): boolean {
    const currentValue = Number(this.guestsForm.get('maxGuests')?.value) || 1;
    return currentValue !== this.initialValue;
  }

  get isFormValid(): boolean {
    return this.guestsForm.valid;
  }
}