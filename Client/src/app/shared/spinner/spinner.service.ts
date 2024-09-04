import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  loading$$ = signal<boolean>(false)

  constructor() { 
  }

  loadingOn(){
    this.loading$$.set(true);
  }
  
  loadingOff(){
    this.loading$$.set(false);
  }
}
