import { Component, effect, inject, input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [
    MatProgressSpinnerModule, 
    CommonModule],
  providers:[
  ],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.scss'
})
export class SpinnerComponent {
  isLoading$ = input.required<Observable<boolean>>()
  showSpinner: Observable<boolean>

  constructor(){
    effect(() =>{
      this.showSpinner = this.isLoading$()
    })
  }
}
