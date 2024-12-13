import { Component, effect, inject, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule} from '@angular/material/icon'
import { GroupMember } from '../../../shared/models/group-members';
import { DialogService } from '../../../services/dialog.service';
import { MembershipDialogComponent, MembershipDialogData } from '../../../membership/membership-dialog/membership-dialog.component';
import { MembershipWithDetails } from '../../../shared/models/membership-model';
import { ClientDialogComponent } from '../../../clients/client-dialog/client-dialog.component';
import { Client } from '../../../shared/models/client-model';
import { ClientNameComponent } from '../../../shared/components/client-name/client-name.component';
import { MembershipService } from '../../../membership/membership.service';
import { MembershipDetailsComponent } from '../../../shared/components/membership-details/membership-details.component';

@Component({
  selector: 'app-member',
  standalone: true,
  imports: [
    MatButtonModule, 
    MatIconModule,
    ClientNameComponent,
    MembershipDetailsComponent
  ],
  templateUrl: './member.component.html',
  styleUrl: './member.component.scss'
})
export class MemberComponent {
 member = input<GroupMember>(new GroupMember)
 memberRemoved = output<GroupMember>();
 visitsNumber: string;

 dialogService = inject(DialogService)
 membershipService = inject(MembershipService)

 constructor(){
  effect(()=>{
    this.visitsNumber = this.member().membership?.unlimited
        ? '∞'
        : this.member().membership?.visitsNumber?.toString() as string
  })
 }

 removeMember(member: GroupMember){
  this.memberRemoved.emit(member);
 }

 onAddMembershipClick(){
  var data: MembershipDialogData = {
    client: this.member().member,
    style: this.member().group.style
  }

  this.dialogService.showDialog(MembershipDialogComponent, data)
    .afterClosed().subscribe((result: MembershipWithDetails) =>{
      if(result){
        this.updateActualMembership()
      }
    })
 }

 onMemberClick(){
  this.dialogService.showDialog(ClientDialogComponent, {id: this.member().member.id})
    .afterClosed().subscribe((result: Client) =>{
      if(result){
        this.member().member = result
      }
    })
 }

 onClientChange(){
  this.updateActualMembership()
 }

 private updateActualMembership(){
  this.membershipService.getActualMembership(this.member().member.id, this.member().group.style.id, this.member().group.startDate)
        .subscribe(result =>{
          this.member().membership = result
        })
 }
}
