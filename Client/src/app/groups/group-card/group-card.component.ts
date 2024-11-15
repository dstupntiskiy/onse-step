import { Component, inject, model } from '@angular/core';
import { CardComponent } from '../../shared/components/card/card.component';
import { Group, GroupWithDetails } from '../../shared/models/group-model';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DialogService } from '../../services/dialog.service';
import { GroupDialogComponent } from '../group-dialog/group-dialog.component';

@Component({
  selector: 'app-group-card',
  standalone: true,
  imports: [
    CardComponent,
    MatCheckboxModule
  ],
  templateUrl: './group-card.component.html',
  styleUrl: './group-card.component.scss'
})
export class GroupCardComponent {
  group = model.required<GroupWithDetails>()

  dialogService = inject(DialogService)

  onClick(){
    this.dialogService.showDialog(GroupDialogComponent, { id: this.group().id })
      .afterClosed().subscribe((result: GroupWithDetails) => {
        if(result){
          this.group.update(() => result)
        }
      })
  }
}
