import { Component,  Input, OutputRefSubscription, Signal, computed, effect, inject, input, signal, viewChildren } from '@angular/core';
import { Group } from '../../shared/models/group-model';
import { MatInputModule } from '@angular/material/input';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { GroupService } from '../group.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Client } from '../../shared/models/client-model';
import { BehaviorSubject, finalize, of } from 'rxjs';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { SpinnerService } from '../../shared/spinner/spinner.service';
import { MemberComponent } from './member/member.component';
import { MatIconModule } from '@angular/material/icon';
import { GroupMember } from '../../shared/models/group-members';
import { AddClientComponent } from '../../shared/components/add-client/add-client.component';
import { toSignal } from '@angular/core/rxjs-interop/index'
import { SpinnerComponent } from '../../shared/spinner/spinner.component';

@Component({
  selector: 'app-group-members',
  standalone: true,
  imports: [
    MatInputModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MemberComponent,
    MatIconModule,
    AddClientComponent,
    SpinnerComponent
  ],
  providers:[
    GroupService,
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        subscriptSizing: 'dynamic'
      }
    }
  ],
  templateUrl: './group-members.component.html',
  styleUrl: './group-members.component.scss'
})
export class GroupMembersComponent {
  group = input.required<Group>()
  clearControlSubject = new BehaviorSubject<boolean>(false)
  groupMembers$$ = signal<GroupMember[]>([])
  
  groupService = inject(GroupService)
  spinnerService = inject(SpinnerService)

  isLoading: boolean = false

   constructor(
  ){
    effect(() =>{
      this.isLoading = true
      this.groupService.getGroupMembers(this.group().id)
        .pipe(
          finalize(() => this.isLoading = false)
        )
        .subscribe((result) => this.groupMembers$$.set(result))
    })
  }

  public onClientSelect(client: Client){
    this.spinnerService.loadingOn();
      this.groupService.addClientToGroup(this.group().id, client.id)
        .pipe(
          finalize(() => {
            this.spinnerService.loadingOff()
            this.clearControlSubject.next(true)
          this.spinnerService.loadingOff()
        }))
        .subscribe((result: GroupMember) =>{
          this.groupMembers$$().unshift(result);
        })
  }

  onMemberRemove(member: GroupMember){
    this.isLoading = true
    this.groupService.removeClientFromGroup(member)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(() => {
        const index = this.groupMembers$$().indexOf(member, 0)
        if(index > -1){
          this.groupMembers$$().splice(index, 1)
        }
      })
  }
}
