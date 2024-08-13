import { Component, effect, inject, input } from '@angular/core';
import { MembershipWithDetails } from '../shared/models/membership-model';
import { DatePipe } from '@angular/common';
import { DialogService } from '../services/dialog.service';
import { MembershipDialogComponent } from './membership-dialog/membership-dialog.component';

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

  dialogService = inject(DialogService)

  constructor(){
    effect(() =>{
    })
  }

  onClick(){
    this.dialogService.showDialog(MembershipDialogComponent, 'Абонимент', {
      id: this.membership().id
    })
  }
}
