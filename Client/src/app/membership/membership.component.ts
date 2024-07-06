import { Component, effect, input } from '@angular/core';
import { MembershipWithDetails } from '../shared/models/membership-model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-membership',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './membership.component.html',
  styleUrl: './membership.component.scss'
})
export class MembershipComponent {
  membership = input.required<MembershipWithDetails>()
  visitsNumber: number;

  constructor(){
    effect(() =>{
    })
  }
}
