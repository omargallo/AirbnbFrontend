import { Component, ElementRef, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { filter } from 'rxjs/operators';
import { LangService } from '../../core/services/lang.service';

@Component({
  selector: 'app-top-nav',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './top-nav.html',
  styleUrls: ['./top-nav.css','../header/header.css'],
})
export class TopNavComponent implements OnInit {
  @Input() navItems: any[] = [];
  currentRoute: string = '';

  @ViewChildren('navVideo') videoElements!: QueryList<ElementRef<HTMLVideoElement>>;

  constructor(private router: Router,    public lang: LangService,) {
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => {
        this.currentRoute = this.router.url;
      });
  }

  ngOnInit(): void {
    this.currentRoute = this.router.url;
  }

  ngAfterViewInit() {
    this.videoElements?.forEach((video) => {
      video.nativeElement.loop = true;
    });
  }

  playVideo(event: MouseEvent) {
    const video = (event.currentTarget as HTMLElement).querySelector('video');
    if (video) {
      video.play();
      video.loop = true;
      video.style.transform = 'scale(1.1)';
      video.style.transition = 'transform 0.3s ease-in-out';
    }
  }

  pauseVideo(event: MouseEvent) {
    const video = (event.currentTarget as HTMLElement).querySelector('video');
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  }
}
