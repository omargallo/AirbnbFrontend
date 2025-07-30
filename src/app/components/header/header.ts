import {
  Component,
  AfterViewInit,
  HostListener,
  inject,
  ElementRef,
  ChangeDetectorRef,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { FormsModule } from '@angular/forms';
import { LangService } from '../../core/services/lang.service';
import { ThemeService } from '../../core/services/theme.service';
import { TranslateModule } from '@ngx-translate/core';
import { TopNavComponent } from '../top-nav/top-nav';
import { SearchFilterGroupComponent } from '../search-filter-group/search-filter-group';
import { DialogService } from '../../core/services/dialog.service';
import { HandleImgService } from '../../core/services/handleImg.service';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/User/user.service';
import { MenuHeader } from '../menu-header/menu-header';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NgxDaterangepickerMd,
    FormsModule,
    TranslateModule,
    TopNavComponent,
    SearchFilterGroupComponent,
    MenuHeader,
  ],
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
})
export class HeaderComponent implements AfterViewInit, OnInit {
  isDarkMode = false;
  isSearchBarSticky = false;
  wasFilterClicked = false;
  dialogService = inject(DialogService);
  authService = inject(AuthService);
  isMessagesRoute = false;

  constructor(
    public lang: LangService,
    public theme: ThemeService,
    private router: Router
  ) {}

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (!this.wasFilterClicked) {
      this.isSearchBarSticky = window.scrollY > 80;
    }
  }

  navItems = [
    {
      label: 'HEADER.HOMES',
      route: '/',
      active: true,
      imgSrc:
        'https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-search-bar-icons/original/4aae4ed7-5939-4e76-b100-e69440ebeae4.png?im_w=240',
      videoSources: [
        {
          src: 'https://a0.muscache.com/videos/search-bar-icons/hevc/house-twirl-selected.mov',
          type: 'video/mp4; codecs="hvc1"',
        },
        {
          src: 'https://a0.muscache.com/videos/search-bar-icons/webm/house-twirl-selected.webm',
          type: 'video/webm',
        },
      ],
      poster:
        'https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-search-bar-icons/original/4aae4ed7-5939-4e76-b100-e69440ebeae4.png?im_w=240',
      isNew: false,
    },
    {
      label: 'HEADER.EXPERIENCES',
      route: '/experiences',
      active: false,
      imgSrc:
        'https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-search-bar-icons/original/e47ab655-027b-4679-b2e6-df1c99a5c33d.png?im_w=240',
      videoSources: [
        {
          src: 'https://a0.muscache.com/videos/search-bar-icons/hevc/balloon-twirl.mov',
          type: 'video/mp4; codecs="hvc1"',
        },
        {
          src: 'https://a0.muscache.com/videos/search-bar-icons/webm/balloon-twirl.webm',
          type: 'video/webm',
        },
      ],
      poster:
        'https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-search-bar-icons/original/e47ab655-027b-4679-b2e6-df1c99a5c33d.png?im_w=240',
      isNew: true,
    },
    {
      label: 'HEADER.SERVICES',
      route: '/services',
      active: false,
      imgSrc:
        'https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-search-bar-icons/original/3d67e9a9-520a-49ee-b439-7b3a75ea814d.png?im_w=240',
      videoSources: [
        {
          src: 'https://a0.muscache.com/videos/search-bar-icons/hevc/consierge-twirl.mov',
          type: 'video/mp4; codecs="hvc1"',
        },
        {
          src: 'https://a0.muscache.com/videos/search-bar-icons/webm/consierge-twirl.webm',
          type: 'video/webm',
        },
      ],
      poster:
        'https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-search-bar-icons/original/3d67e9a9-520a-49ee-b439-7b3a75ea814d.png?im_w=240',
      isNew: true,
    },
  ];

  ngOnInit() {
    this.checkIfMessagesRoute();
  }

  ngAfterViewInit(): void {
    this.router.events.subscribe(() => {
      this.checkIfMessagesRoute();
    });
  }

  checkIfMessagesRoute() {
    this.isMessagesRoute =
      this.router.url.startsWith('/Messages') ||
      this.router.url.startsWith('/WishLists') ||
      this.router.url.startsWith('/wishlist') ||
      this.router.url.startsWith('/profile') ||
      this.router.url.startsWith('/update-profile') ||
      this.router.url.startsWith('/your-reviews') ||
      this.router.url.startsWith('/notifications');
  }
}
