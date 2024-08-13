import { Component, inject, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule} from '@angular/material/icon'
import { GroupMember } from '../../../shared/models/group-members';
import { PaymentComponent } from '../../../shared/components/payment/payment.component';
import { DatePipe } from '@angular/common';
import { DialogService } from '../../../services/dialog.service';
import { MembershipDialogComponent, MembershipDialogData } from '../../../membership/membership-dialog/membership-dialog.component';
import { MembershipModel, MembershipWithDetails } from '../../../shared/models/membership-model';
import { ClientDialogComponent } from '../../../clients/client-dialog/client-dialog.component';
import { Client } from '../../../shared/models/client-model';

@Component({
  selector: 'app-member',
  standalone: true,
  imports: [
    MatButtonModule, 
    MatIconModule,
    PaymentComponent,
    DatePipe
  ],
  templateUrl: './member.component.html',
  styleUrl: './member.component.scss'
})
export class MemberComponent {
 member = input<GroupMember>(new GroupMember)
 removeMemberOutput = output<GroupMember>();

 dialogService = inject(DialogService)

 removeMember(member: GroupMember){
  this.removeMemberOutput.emit(member);
 }

 onAddMembershipClick(){
  var data: MembershipDialogData = {
    client: this.member().member,
    style: this.member().group.style
  }

  this.dialogService.showDialog(MembershipDialogComponent, this.member().member.name + ' Абонемент', data)
    .afterClosed().subscribe((result: MembershipWithDetails) =>{
      if(result){
        result.visited = 0
        this.member().membership = result
      }
    })
 }

 onMemberClick(){
  this.dialogService.showDialog(ClientDialogComponent, this.member().member.name, {id: this.member().member.id})
    .afterClosed().subscribe((result: Client) =>{
      if(result){
        this.member().member = result
      }
    })
 }

 onMembershipClick(){
  this.dialogService.showDialog(MembershipDialogComponent, 'Абонимент', {id: this.member().membership?.id})
    .afterClosed().subscribe((result: MembershipModel) =>{
      if(result){
        var membership = new MembershipWithDetails()
        membership.Map(result)
        membership.visited = this.member().membership?.visited as number
        console.log(membership)
        this.member().membership = membership
      }
    })
 }
}
