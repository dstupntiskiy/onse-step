import { Component, effect, inject, input, signal } from '@angular/core';
import { MembershipComponent } from '../../../membership/membership.component';
import { MembershipService } from '../../../membership/membership.service';
import { MembershipWithDetails } from '../../../shared/models/membership-model';
import { MatButtonModule } from '@angular/material/button';
import { DialogService } from '../../../services/dialog.service';
import { MembershipDialogComponent } from '../../../membership/membership-dialog/membership-dialog.component';
import { Client } from '../../../shared/models/client-model';
import { SpinnerComponent } from '../../../shared/spinner/spinner.component';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-client-memberships-list',
  standalone: true,
  imports: [
    MembershipComponent,
    MatButtonModule,
    SpinnerComponent
  ],
  templateUrl: './client-memberships-list.component.html',
  styleUrl: './client-memberships-list.component.scss'
})
export class ClientMembershipsListComponent {
  client = input.required<Client>()

  isLoading : boolean = false
  memberships = signal<MembershipWithDetails[]>([])

  membershipService = inject(MembershipService)
  dialogService = inject(DialogService)

  constructor(){
    effect(() =>{
      this.updateMemberships()
    }, { allowSignalWrites: true })
  }

  onAddMembershipClick(){
    this.dialogService.showDialog(MembershipDialogComponent, {
            client: this.client()
          })
          .afterClosed().subscribe((result: MembershipWithDetails) =>{
            if(result){
              this.memberships().unshift(result)
            }
          })
  }

  onMembershipDelete(membershipId: string){
    this.memberships.update(() => this.memberships().filter(x => x.id != membershipId))
  }

  private updateMemberships(){
    this.isLoading = true
    this.membershipService.getMembershipsByClient(this.client().id)
        .pipe(finalize(() => this.isLoading = false))
        .subscribe((result) =>{
          this.memberships.update(() => result)
        })
  }
}
