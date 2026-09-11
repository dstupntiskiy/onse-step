import { ApplicationConfig, ErrorHandler, LOCALE_ID, DOCUMENT } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { DomSanitizer } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { AuthInterceptor } from './shared/Interceptors/authInterceptor';

import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { DateAdapter, MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { CustomDateAdapter } from './shared/adapters/custom.date.adapter';
import { registerLocaleData } from '@angular/common';
import localeRu from '@angular/common/locales/ru'
import { MatIconRegistry } from '@angular/material/icon';

export function tokenGetter() {
  return localStorage.getItem("jwtToken");
}

registerLocaleData(localeRu, 'ru-Ru');
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withXhr(), withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'outline',
        subscriptSizing: 'dynamic'
      }
    },
    {
      provide: LOCALE_ID,
      useValue: 'ru-RU'
    },
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'ru-RU' },
    { provide: DateAdapter, useClass: CustomDateAdapter},
    provideRouter(routes),

      
     provideAnimationsAsync(),
    MatIconRegistry,
    {
      provide: MatIconRegistry,
      useFactory: (domSanitizer: DomSanitizer, httpClient: HttpClient, document: Document, errorHandler: ErrorHandler) =>{
        const iconFactory = new MatIconRegistry(httpClient, domSanitizer, document, errorHandler)
        iconFactory.addSvgIcon(
          'dance_icon',
          domSanitizer.bypassSecurityTrustResourceUrl('assets/images/dance.svg')
        )
        iconFactory.addSvgIcon(
          'fairy-dance',
          domSanitizer.bypassSecurityTrustResourceUrl('assets/images/fairy-dance.svg')
        )
        return iconFactory
      },
      deps: [DomSanitizer, HttpClient, DOCUMENT, ErrorHandler]
    }]
};




