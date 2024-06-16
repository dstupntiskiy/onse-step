import { Injectable } from '@angular/core';
import { HttpRequest } from '@angular/common/http';
import { JwtModuleOptions, JWT_OPTIONS } from '@auth0/angular-jwt';

@Injectable()
export class JwtConfigService {
  constructor() {}

  public jwtOptionsFactory(): JwtModuleOptions {
    return {config: {
      tokenGetter: this.tokenGetter,
      allowedDomains: ["localhost:5069", "localhost:4200"],
      disallowedRoutes: ['localhost:5069/api/user']
    }};
  }

  public tokenGetter() {
    return localStorage.getItem('jwtToken'); // Adjust as needed
  }
}