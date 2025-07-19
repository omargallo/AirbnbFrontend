// src/app/app.config.ts
import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
  provideZonelessChangeDetection
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import {
  TranslateLoader,
  TranslateModule
} from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { HttpLoaderFactory } from './translate-loader';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideRouter(routes),
    importProvidersFrom(
      TranslateModule.forRoot({
        defaultLanguage: 'en',
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient],
        },
      })
    ),
    provideZoneChangeDetection(),
    provideZonelessChangeDetection(),
  ],
};
