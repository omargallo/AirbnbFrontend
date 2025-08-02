import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class LangService {
  constructor(private translate: TranslateService) {
    const savedLang = localStorage.getItem('lang') || 'en';
    this.translate.use(savedLang);

    document.body.classList.toggle('dRTL', savedLang === 'ar');
    document.body.classList.toggle('dLTR', savedLang !== 'ar');


  }


  switchLang(lang: string) {
    document.body.classList.toggle('dRTL', lang === 'ar');
    document.body.classList.toggle('dLTR', lang !== 'ar');
    this.translate.use(lang);
    localStorage.setItem('lang', lang);

  }

  get currentLang() {
    return this.translate.currentLang;
  }
}
