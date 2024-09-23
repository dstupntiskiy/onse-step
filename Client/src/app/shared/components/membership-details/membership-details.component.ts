import { Component, effect, inject, input, model, OutputRefSubscription } from '@angular/core';
import { MembershipModel, MembershipWithDetails } from '../../models/membership-model';
import { DialogService } from '../../../services/dialog.service';
import { StyleModel } from '../../models/style-model';
import { MembershipDialogComponent } from '../../../membership/membership-dialog/membership-dialog.component';
import { Client } from '../../models/client-model';
import { MatButtonModule } from '@angular/material/button';
import { MembershipService } from '../../../membership/membership.service';

@Component({
  selector: 'app-membership-details',
  standalone: true,
  imports: [
    MatButtonModule
  ],
  templateUrl: './membership-details.component.html',
  styleUrl: './membership-details.component.scss'
})
export class MembershipDetailsComponent {
  membership = model.required<MembershipWithDetails | undefined>()
  style = input<StyleModel>()
  client = input.required<Client>()
  date = input<Date>()
  visitsNumber: string

  dialogService = inject(DialogService)
  membershipService = inject(MembershipService)

  constructor(){
    effect(() =>{
      this.visitsNumber = this.membership()?.unlimited
        ? '∞'
        : this.membership()?.visitsNumber?.toString() as string
    })
  }

  onAddClick(){
    this.OpenMembershipDialog(this.client(), this.style() as StyleModel)
  }

  onEditClick(){
    this.OpenMembershipDialog(this.client(), this.style() as StyleModel, this.membership()?.id)
  }

  private OpenMembershipDialog(client: Client, style: StyleModel, id?: string){
    const dialogRef = this.dialogService.showDialog(MembershipDialogComponent, {
      client: this.client(),
      style: this.style(),
      id: this.membership()?.id
    })
    const subscriptions: OutputRefSubscription[] = []
    dialogRef.afterOpened().subscribe(() =>{
      const component = dialogRef.componentInstance.componentRef.instance
      subscriptions.push(component.membershipSaved.subscribe(() =>{
        this.updateActualMembership()
      }))
      subscriptions.push(component.membershipDeleted.subscribe(() =>{
        this.updateActualMembership()
      }))
    })

    dialogRef.afterClosed().subscribe(() => {
      subscriptions.forEach((sub) => sub.unsubscribe())
    })
  }

  private updateActualMembership(){
    this.membershipService.getActualMembership(this.client().id, this.style()?.id, this.date())
          .subscribe(result => this.membership.update(() => result))
  }
}
