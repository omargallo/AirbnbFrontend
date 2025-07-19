import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class TranslationService {
  constructor(private translate: TranslateService) {
    translate.addLangs(['en', 'ar']);
    const lang = localStorage.getItem('lang') || 'en';
    translate.setDefaultLang('en');
    this.useLanguage(lang);
  }

  useLanguage(lang: string) {
    localStorage.setItem('lang', lang);
    this.translate.use(lang);
  }

  get currentLang(): string {
    return this.translate.currentLang;
  }
}
