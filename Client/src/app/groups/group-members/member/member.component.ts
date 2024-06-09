import { Component, Signal, input, output, signal } from '@angular/core';
import { Client } from '../../../shared/models/client-model';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule} from '@angular/material/icon'
import { GroupMember } from '../../../shared/models/group-members';

@Component({
  selector: 'app-member',
  standalone: true,
  imports: [
    MatButtonModule, MatIconModule
  ],
  templateUrl: './member.component.html',
  styleUrl: './member.component.scss'
})
export class MemberComponent {
 member = input<GroupMember>(new GroupMember)
 removeMemberOutput = output<string>();

 removeMember(id: string){
  this.removeMemberOutput.emit(id);
 }
}
