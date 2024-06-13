import { Component,  Input, OutputRefSubscription, Signal, effect, viewChildren } from '@angular/core';
import { Group } from '../../shared/models/group-model';
import { MatInputModule } from '@angular/material/input';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { GroupService } from '../group.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Client } from '../../shared/models/client-model';
import { BehaviorSubject, finalize } from 'rxjs';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { SpinnerService } from '../../shared/spinner/spinner.service';
import { MemberComponent } from './member/member.component';
import { MatIconModule } from '@angular/material/icon';
import { GroupMember } from '../../shared/models/group-members';
import { AddClientComponent } from '../../shared/components/add-client/add-client.component';

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
    AsyncPipe,
    CommonModule,
    MemberComponent,
    MatIconModule,
    AddClientComponent
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
  @Input() group: Group
  public members: GroupMember[] = []; 
  clearControlSubject = new BehaviorSubject<boolean>(false)
  selectedClient?: Client;

  private subscriptions: OutputRefSubscription[] = []
  
  memberRefs: Signal<readonly MemberComponent[]> = viewChildren(MemberComponent)
  
  constructor(
    private groupService: GroupService,
    private spinnerService: SpinnerService
  ){
    effect(() =>{
      this.subscriptions.forEach(s => s.unsubscribe());
      this.subscriptions = [];

      this.memberRefs().forEach(memberRef =>{
        const sub = memberRef.removeMemberOutput.subscribe((groupMember: GroupMember) =>{
          this.spinnerService.loadingOn();
          this.groupService.removeClientFromGroup(groupMember)
          .pipe(
            finalize(() => this.spinnerService.loadingOff())
          )
          .subscribe(() =>{
            var member = this.members.find(x=> x.id === groupMember.id) as GroupMember
            var index = this.members.indexOf(member)
            this.members.splice(index, 1)
          })
        })
        this.subscriptions.push(sub)
      })
    })
  }

  ngOnInit(){
    this.groupService.getGroupMembers(this.group.id).subscribe((result: GroupMember[]) =>{
      if(result){
        result.forEach(element => {
          this.members.push(element);
        });
        this.members = Object.assign([], this.members);
      }
    })
    
  }

  public onClientSelect(client: Client){
    this.selectedClient = client
  }

  public addMember(){
    this.spinnerService.loadingOn();
    if (this.selectedClient){
      this.groupService.addClientToGroup(this.group.id, this.selectedClient.id)
        .pipe(
          finalize(() => {
            this.spinnerService.loadingOff()
            this.clearControlSubject.next(true)
            this.selectedClient = undefined;
          })
        )
        .subscribe((result: GroupMember) =>{
          this.members.unshift(result);
        })
      }
      this.spinnerService.loadingOff()
    }
}
