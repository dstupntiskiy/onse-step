import { ApplicationConfig, ErrorHandler, importProvidersFrom, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { DomSanitizer, provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { AuthInterceptor } from './shared/Interceptors/authInterceptor';
import { JwtModule } from '@auth0/angular-jwt';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { DateAdapter, MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { CustomDateAdapter } from './shared/adapters/custom.date.adapter';
import { DOCUMENT, registerLocaleData } from '@angular/common';
import localeRu from '@angular/common/locales/ru'
import { MatIconRegistry } from '@angular/material/icon';

export function tokenGetter() {
  return localStorage.getItem("jwtToken");
}

registerLocaleData(localeRu, 'ru-Ru');
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
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
    importProvidersFrom(
      JwtModule.forRoot({
        config: {
          tokenGetter: tokenGetter,
          allowedDomains: ["localhost:5000", "localhost:4200"],
          disallowedRoutes: ['localhost:5000/api/user']
        }
      })
    ),
     provideClientHydration(), 
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
