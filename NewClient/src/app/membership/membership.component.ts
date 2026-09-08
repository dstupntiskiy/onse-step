import { Component, ComponentRef, DestroyRef, effect, inject, input, model, output, OutputRefSubscription } from '@angular/core';
import { MembershipModel, MembershipWithDetails } from '../shared/models/membership-model';
import { DatePipe } from '@angular/common';
import { DialogService } from '../services/dialog.service';
import { MembershipDialogComponent } from './membership-dialog/membership-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { IComponent } from '../shared/i/i.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-membership',
  standalone: true,
  imports: [DatePipe,
    MatButtonModule,
    MatIconModule,
    IComponent,
    MatTooltipModule
  ],
  templateUrl: './membership.component.html',
  styleUrl: './membership.component.scss'
})
export class MembershipComponent {
  membership = model.required<MembershipWithDetails>()
  visitsNumber: string;
  delete = output<string>()
  dialogService = inject(DialogService)

  constructor(){
    effect(() =>{
      this.visitsNumber = this.membership().unlimited
        ? '∞'
        : this.membership().visitsNumber?.toString() as string
    })
  }

  onEditClick(){
    const dialogRef = this.dialogService.showDialog(MembershipDialogComponent, {
      id: this.membership().id
    })

    const subscriptions: OutputRefSubscription[] = []
    dialogRef.afterOpened().subscribe(() =>{
      const instance = dialogRef.componentInstance.componentRef.instance
      subscriptions.push(instance.membershipSaved.subscribe((membership: MembershipWithDetails) =>{
        this.membership.update(() => membership)
      }))
      subscriptions.push(instance.membershipDeleted.subscribe((membershipId: string) =>{
        this.delete.emit(membershipId)
      }))
    })

    dialogRef.afterClosed().subscribe(() => subscriptions.forEach((sub)=> sub.unsubscribe()))
  }
}
