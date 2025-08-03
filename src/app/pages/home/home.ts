import { Observable, Subscription } from 'rxjs';
import { ConfirmService } from './../../core/services/confirm.service';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { WishListModal } from '../../components/wish-list-modal/wish-list-modal';
import { PropertySwiperComponent } from '../../components/mainswiper/mainswiper';
import { Property } from '../../core/models/Property';
import { FormsModule } from '@angular/forms';
import { PropertyService } from '../../core/services/Property/property.service';
import { Router } from '@angular/router';
import { WishlistService } from '../../core/services/Wishlist/wishlist.service';
import { AuthService } from '../../core/services/auth.service';
import { DialogService } from '../../core/services/dialog.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ChatContextService } from '../../core/chatbot/chat-context.service';
import { environment } from '../../../environments/environment.development';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ChatBot } from "../../components/chat-bot/chat-bot";

@Component({
  selector: 'app-home',
  imports: [CommonModule, WishListModal, PropertySwiperComponent, FormsModule, TranslateModule, ChatBot],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit, OnDestroy {
  properties: Property[] = [];
  selectedPropertyId!: number;
  show = false;
  isLoading = false;
  private contextLoaded = false;
  private langChangeSubscription?: Subscription;

  private readonly contextService = inject(ChatContextService);

  sections: {
    title: string;
    search: any;
  }[] = [];

  sectionProperties: {
    title: string;
    properties: Property[];
    isLoading: boolean;
    slidesPerView: number;
  }[] = [];

  constructor(
    private confirm: ConfirmService,
    private propertyService: PropertyService,
    private router: Router,
    private wishlistService: WishlistService,
    public authService: AuthService,
    private dialogService: DialogService,
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.langChangeSubscription = this.translate.onLangChange.subscribe(() => {
      this.reinitializeSections();
    });

    this.translate.get('HOME.SECTIONS.POPULAR_CAIRO').subscribe(() => {
      this.initializeSections();
      this.loadAllSections();
    });
  }

  ngOnDestroy() {
    if (this.langChangeSubscription) {
      this.langChangeSubscription.unsubscribe();
    }
  }

  private reinitializeSections() {
    this.initializeSections();

    this.sectionProperties.forEach((sectionProp, index) => {
      if (this.sections[index]) {
        sectionProp.title = this.sections[index].title;
      }
    });
  }

  private initializeSections() {
    this.sections = [
      {
        title: this.translate.instant('HOME.SECTIONS.POPULAR_CAIRO'),
        search: { country: 'Egypt', city: 'Cairo' },
      },
      {
        title: this.translate.instant('HOME.SECTIONS.HURGHADA_NEXT_WEEKEND'),
        search: { country: 'Egypt', city: 'Hurghada', startDate: this.getNextWeekend() },
      },
      {
        title: this.translate.instant('HOME.SECTIONS.STAY_NEW_CAIRO'),
        search: { country: 'Egypt', city: 'New Cairo' },
      },
      {
        title: this.translate.instant('HOME.SECTIONS.DUBAI_NEXT_MONTH'),
        search: { country: 'UAE', city: 'Dubai', startDate: this.getNextMonth() },
      },
      {
        title: this.translate.instant('HOME.SECTIONS.AIN_SOKHNA'),
        search: { country: 'Egypt', city: 'Ain Sokhna' },
      },
      {
        title: this.translate.instant('HOME.SECTIONS.ALEX_NEXT_WEEKEND'),
        search: { country: 'Egypt', city: 'Alexandria', startDate: this.getNextWeekend() },
      },
      {
        title: this.translate.instant('HOME.SECTIONS.PARIS'),
        search: { country: 'France', city: 'Paris' },
      },
      // {
      //   title: this.translate.instant('HOME.SECTIONS.MILAN'),
      //   search: { country: 'Italy', city: 'Milan' },
      // },
      {
        title: this.translate.instant('HOME.SECTIONS.SHEIKH_ZAYED'),
        search: { country: 'Egypt', city: 'Sheikh Zayed City' },
      }//,
      // {
      //   title: this.translate.instant('HOME.SECTIONS.BARCELONA'),
      //   search: { country: 'Spain', city: 'Barcelona' },
      // },
    ];

    this.sections = this.shuffleArray(this.sections);
  }

  private prepareHomeContext() {
    let result: string[] = [];

    result.push(`On the home page, we show popular property sections:`);

    for (const section of this.sectionProperties) {
      if (section.properties.length === 0) continue;

      const sectionText =
        `Section: "${section.title}" includes:\n` +
        section.properties
          .slice(0, 3)
          .map((p) => {
            const url = `${environment.domainBaseUrl}/property/${p.id}`;
            return `• <strong>${p.title}</strong> in ${p.city},
           ${p.country}  , Descrption ${p.description}  , AVerage Rating${p.averageRating},
            Max guests ${p.maxGuests},Reviews  ${p.reviewCount}
          - $${p.pricePerNight}
          /night<br><a href="${url}" class="view-link" target="_blank">View Property</a>`;
          })
          .join('\n');

      result.push(sectionText);
    }

    this.contextService.setHomeContext(result.join('\n\n'));
  }

  getNextWeekend(): string {
    const today = new Date();
    const nextSaturday = new Date(today);
    nextSaturday.setDate(today.getDate() + ((6 - today.getDay()) % 7));
    return nextSaturday.toISOString();
  }

  getNextMonth(): string {
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    return nextMonth.toISOString();
  }

  getRandomSlidesCount(): number {
    const options = [5, 6, 7];
    return options[Math.floor(Math.random() * options.length)];
  }

  shuffleArray<T>(array: T[]): T[] {
    return array
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  }

  loadAllSections() {
    let completed = 0;

    this.sections.forEach((section, index) => {
      this.sectionProperties.push({
        title: section.title,
        properties: [],
        isLoading: true,
        slidesPerView: this.getRandomSlidesCount(),
      });

      this.propertyService.searchProperties(section.search).subscribe({
        next: (res) => {
          if (res.isSuccess) {
            this.sectionProperties[index].properties = res.data.items;
          }
          this.sectionProperties[index].isLoading = false;

          completed++;

          if (completed === this.sections.length && !this.contextLoaded) {
            this.prepareHomeContext();
            this.contextLoaded = true;
          }
        },
        error: () => {
          this.sectionProperties[index].isLoading = false;
        },
      });
    });
  }

  onPropertyClick(id: number) {
    this.router.navigate(['/property', id]);
  }

  onWishlistClick(id: number) {
    if (!this.authService.userId) {
      this.showToast(this.translate.instant('HOME.TOAST.LOGIN_REQUIRED'), 'top', 'right');
      this.dialogService.openDialog('login');
      return;
    }

    let foundProperty: Property | undefined;

    for (let section of this.sectionProperties) {
      const prop = section.properties.find((p) => p.id === id);
      if (prop) {
        foundProperty = prop;
        break;
      }
    }

    if (foundProperty?.isFavourite) {
      this.removeFromWishlist(id);
    } else {
      this.selectedPropertyId = id;
      this.show = true;
    }
  }

  removeFromWishlist(propertyId: number) {
    this.wishlistService.removePropertyFromWishlist(propertyId).subscribe({
      next: (success) => {
        if (success) {
          for (let section of this.sectionProperties) {
            const property = section.properties.find(
              (p) => p.id === propertyId
            );
            if (property) {
              property.isFavourite = false;
            }
          }
          this.showToast(this.translate.instant('HOME.TOAST.REMOVED'), 'bottom', 'left');
        } else {
          this.showToast(this.translate.instant('HOME.TOAST.REMOVE_FAILED'), 'bottom', 'left');
        }
      },
      error: () => {
        this.showToast(this.translate.instant('HOME.TOAST.REMOVE_FAILED'), 'bottom', 'left');
      },
    });
  }

  onFinish(observable: Observable<boolean>) {
    this.onClose();
    observable.subscribe({
      next: (success) => {
        if (success) {
          for (let section of this.sectionProperties) {
            const property = section.properties.find(
              (p) => p.id === this.selectedPropertyId
            );
            if (property) {
              property.isFavourite = true;
            }
          }
          this.showToast(this.translate.instant('HOME.TOAST.ADDED'), 'bottom', 'left');
        } else {
          this.showToast(this.translate.instant('HOME.TOAST.ADD_FAILED'), 'bottom', 'left');
        }
      },
      error: () => {
        this.showToast(this.translate.instant('HOME.TOAST.ADD_FAILED'), 'bottom', 'left');
      },
    });
  }

  private showToast(
    message: string,
    vertical: 'top' | 'bottom',
    horizontal: 'left' | 'right'
  ) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: horizontal,
      verticalPosition: vertical,
      panelClass: ['custom-snackbar'],
    });
  }

  onClose() {
    this.show = false;
  }
}
