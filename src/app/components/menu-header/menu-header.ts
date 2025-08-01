import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  inject,
  OnInit,
} from '@angular/core';
import { LangService } from '../../core/services/lang.service';
import { ThemeService } from '../../core/services/theme.service';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { UserService } from '../../core/services/User/user.service';
import { DialogService } from '../../core/services/dialog.service';
import { AuthService } from '../../core/services/auth.service';
import { HandleImgService } from '../../core/services/handleImg.service';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';

@Component({
  selector: 'app-menu-header',
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './menu-header.html',
  styleUrl: '../header/header.css',
})
export class MenuHeader implements AfterViewInit, OnInit {
  isDarkMode = false;
  isSearchBarSticky = false;
  wasFilterClicked = false;
  dialogService = inject(DialogService);
  authService = inject(AuthService);
  isMessagesRoute = false;
  currentRoute: string = '';

  constructor(
    public lang: LangService,
    public theme: ThemeService,
    private elementRef: ElementRef,
    private router: Router,
    private userService: UserService
  ) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.urlAfterRedirects;
      });
  }

  switchMode() {
    if (this.currentRoute.includes('/host')) {
      this.router.navigate(['/']); // Navigate to traveller mode
    } else {
      this.router.navigate(['/host']); // Navigate to host mode
    }
  }

  userId: any = (() => {
    const userId = this.authService.userId;
    return userId;
  })();
  handleImgService = inject(HandleImgService);
  user: string | null = (() => {
    const storedUser = localStorage.getItem('user');
    return storedUser
      ? JSON.parse(storedUser)?.firstName ?? JSON.parse(storedUser)?.userName
      : '';
  })();

  ifImg: string | null = (() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser)?.profilePictureURL ?? '' : '';
  })();

  img: string | null = (() => {
    const storedUser = localStorage.getItem('user');
    return this.handleImgService.handleImage(
      storedUser ? JSON.parse(storedUser)?.profilePictureURL ?? '' : ''
    );
  })();

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (this.dropdownOpen) {
      this.closeDropdown();
    }

    if (!this.wasFilterClicked) {
      this.isSearchBarSticky = window.scrollY > 80;
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    const dropdown = this.elementRef.nativeElement.querySelector('.dropdown');

    if (this.dropdownOpen && dropdown && !dropdown.contains(target)) {
      this.closeDropdown();
    }
  }
  @HostListener('window:resize', ['$event'])
  onWindowResize(event: Event) {
    this.closeDropdown();
    console.log('Window resized');
  }
  dropdownOpen = false;
  dropdownClosing = false;

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
    this.dropdownClosing = !this.dropdownOpen;
  }

  openDropdown() {
    this.dropdownOpen = true;
    this.dropdownClosing = false;
  }

  closeDropdown() {
    this.dropdownClosing = true;
    this.dropdownOpen = false;
  }

  onAnimationEnd() {
    if (this.dropdownClosing) {
      this.dropdownClosing = false;
    }
  }

  isLoggedIn = false;

  ngOnInit() {
    this.isDarkMode = document.body.classList.contains('dark');
    this.checkIfMessagesRoute();
    this.isLoggedIn =
      this.userId === null || this.userId === undefined ? false : true;
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

  ngAfterViewInit(): void {
    this.router.events.subscribe(() => {
      this.checkIfMessagesRoute();
    });
    this.isLoggedIn =
      this.userId === null || this.userId === undefined ? false : true;
    (window as any).Logging = () => {
      this.isLoggedIn =
        this.userId === null || this.userId === undefined ? false : true;
    };
  }

  changeLanguage(lang: string) {
    this.lang.switchLang(lang);
    if (lang == 'ar') {
      document.body.classList.contains('dRTL');
      console.log(true);
    } else {
      document.body.classList.contains('dLTR');
    }
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    this.theme.toggleTheme();
  }

  openLoginDialog() {
    this.dialogService.openDialog('login');
  }

  openRegisterDialog() {
    this.dialogService.openDialog('register');
  }

  logout() {
    this.authService.clear();
    this.userService.Logout();
    this.isLoggedIn = false;
    this.router.navigate(['/']);
  }
}
