import { Injectable, signal } from '@angular/core';
import { fromEvent, map, startWith } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IsMobileService {

  private mobileThreshold = 600; // Set threshold for mobile

  // Signal to track if the device is mobile or not
  isMobile = signal<boolean>(this.isWindowMobile());

  constructor() {
    // Subscribe to window resize events
    fromEvent(window, 'resize')
      .pipe(
        map(() => this.isWindowMobile()), // Check if mobile after each resize
        startWith(this.isWindowMobile())  // Emit initial value
      )
      .subscribe(isMobile => this.isMobile.set(isMobile));
  }

  // Helper method to check if the window width is below the threshold
  private isWindowMobile(): boolean {
    return window.innerWidth <= this.mobileThreshold;
  }
}
