import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class LangService {
  constructor(private translate: TranslateService) {
    const savedLang = localStorage.getItem('lang') || 'en';
    this.translate.use(savedLang);
  }

  switchLang(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('lang', lang);
  }

  get currentLang() {
    return this.translate.currentLang;
  }
}
