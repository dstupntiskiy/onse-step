import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResizeService {
  private breakPoint: number = 600
  private showMobile = new ReplaySubject<boolean>();
  public resize$ = this.showMobile.asObservable();
  private previousWidth: number = window.innerWidth;

  constructor(private ngZone: NgZone) {
    this.ngZone.runOutsideAngular(() => {
      window.addEventListener('resize', this.onResize.bind(this));
    });
    this.showMobile.next(window.innerWidth < this.breakPoint)
  }

  private onResize(event: UIEvent): void {
    const windowWidth = window.innerWidth;
    if (this.previousWidth >= this.breakPoint && windowWidth < this.breakPoint) {
      this.ngZone.run(() => {
        this.showMobile.next(true);
      })
    }
    else if(this.previousWidth < this.breakPoint && windowWidth >= this.breakPoint){
      this.ngZone.run(() => {
        this.showMobile.next(false)
      })
    }
    this.previousWidth = windowWidth
  }
}
