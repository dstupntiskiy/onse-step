import { Component, effect, inject, input } from '@angular/core';
import { MembershipWithDetails } from '../shared/models/membership-model';
import { DatePipe } from '@angular/common';
import { DialogService } from '../services/dialog.service';
import { MembershipDialogComponent } from './membership-dialog/membership-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-membership',
  standalone: true,
  imports: [DatePipe,
    MatButtonModule,
    MatIconModule
  ],
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

  onEditClick(){
    this.dialogService.showDialog(MembershipDialogComponent, 'Абонимент', {
      id: this.membership().id
    })
  }
}
