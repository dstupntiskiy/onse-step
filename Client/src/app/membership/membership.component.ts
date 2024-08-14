import { Component, effect, inject, input, model } from '@angular/core';
import { MembershipModel, MembershipWithDetails } from '../shared/models/membership-model';
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
  membership = model.required<MembershipWithDetails>()
  visitsNumber: string;

  dialogService = inject(DialogService)

  constructor(){
    effect(() =>{
      this.visitsNumber = this.membership().unlimited
        ? '∞'
        : this.membership().visitsNumber?.toString() as string
    })
  }

  onEditClick(){
    this.dialogService.showDialog(MembershipDialogComponent, 'Абонимент', {
      id: this.membership().id
    })
    .afterClosed().subscribe((result: MembershipModel) =>{
      if(result){
        var membership = new MembershipWithDetails()
        membership.Map(result)
        membership.visited = this.membership().visited as number
        this.membership.set(membership)
      }
    })
  }
}
