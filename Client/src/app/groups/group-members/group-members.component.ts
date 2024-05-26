import { Component, Input } from '@angular/core';
import { Group } from '../../shared/models/group-model';
import { MatInputModule } from '@angular/material/input';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { GroupService } from '../group.service';
import { Client } from '../../shared/models/client-model';
import { GroupMembers } from '../../shared/models/group-members';

const MEMBERS = ['Ann', 'Glen', 'Vanya']

@Component({
  selector: 'app-group-members',
  standalone: true,
  imports: [
    MatInputModule,
    MatAutocompleteModule
  ],
  providers:[
    GroupService
  ],
  templateUrl: './group-members.component.html',
  styleUrl: './group-members.component.scss'
})
export class GroupMembersComponent {
  @Input() group: Group
  public members: string[] = []; 
  constructor(private groupService: GroupService){}

  ngOnInit(){
    this.groupService.getGroupMembers(this.group.id).subscribe((result: GroupMembers) =>{
      if(result){
        result.members?.forEach(element => {
          this.members.push(element.name);
        });
        this.members = Object.assign([], this.members);
      }
    })
  }
}
