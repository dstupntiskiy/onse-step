import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { AuthInterceptor } from './shared/Interceptors/authInterceptor';
import { JWT_OPTIONS, JwtModule } from '@auth0/angular-jwt';
import { JwtConfigService } from './shared/services/JwtConfigService';

export function tokenGetter() {
  return localStorage.getItem("jwtToken");
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    provideRouter(routes),
    importProvidersFrom(
      JwtModule.forRoot({
        config: {
          tokenGetter: tokenGetter,
          allowedDomains: ["localhost:5069", "localhost:4200"],
          disallowedRoutes: ['localhost:5069/api/user']
        }
      })
    ),
     provideClientHydration(), provideAnimationsAsync()]
};
