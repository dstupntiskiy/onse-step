import { Component,  Input, OutputRefSubscription, Signal, effect, viewChildren } from '@angular/core';
import { Group } from '../../shared/models/group-model';
import { MatInputModule } from '@angular/material/input';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { GroupService } from '../group.service';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Client } from '../../shared/models/client-model';
import { Observable, catchError, debounceTime, filter, finalize, of, switchMap } from 'rxjs';
import { ClientService } from '../../clients/client.service';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { SnackBarService } from '../../services/snack-bar.service';
import { SpinnerService } from '../../shared/spinner/spinner.service';
import { MemberComponent } from './member/member.component';
import { MatIconModule } from '@angular/material/icon';
import { GroupMember } from '../../shared/models/group-members';

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
    MatIconModule
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


  public clientControl = new FormControl();
  public options: Client[] = [];
  filteredOptions: Observable<Client[]>
  public selectedClient?: Client;

  private subscriptions: OutputRefSubscription[] = []
  
  memberRefs: Signal<readonly MemberComponent[]> = viewChildren(MemberComponent)
  
  constructor(
    private groupService: GroupService,
    private clientService: ClientService,
    private snackbarService: SnackBarService,
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
    this.filteredOptions = this.clientControl.valueChanges.pipe(
      debounceTime(300),
      filter(value =>{
        if(this.selectedClient || value === ''){
          return false
        }
        return true
      }),
      switchMap(value => this.clientService.getClientsByQuery(value).pipe(
        catchError(error => {
          this.snackbarService.error("Не удалось выполнить поиск");
          return of([])
        })
      ))
    )

    this.groupService.getGroupMembers(this.group.id).subscribe((result: GroupMember[]) =>{
      if(result){
        result.forEach(element => {
          this.members.push(element);
        });
        this.members = Object.assign([], this.members);
      }
    })
    
  }

  public onOptionSelected(){
    this.selectedClient = this.clientControl.value;
  }

  public displayFn(client: Client): string{
    return client && client.name ? client.name : '';
  }

  public addMember(){
    this.spinnerService.loadingOn();
    if (this.selectedClient){
      this.groupService.addClientToGroup(this.group.id, this.selectedClient?.id)
        .pipe(
          finalize(() => {
            this.spinnerService.loadingOff()
            this.clientControl.reset('')
            this.selectedClient = undefined;
            this.options = [];
          })
        )
        .subscribe((result: GroupMember) =>{
          this.members.unshift(result);
        })
      }
      this.spinnerService.loadingOff()
    }
}
