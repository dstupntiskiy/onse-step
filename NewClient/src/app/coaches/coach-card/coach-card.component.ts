import { Component, inject, input, model, ChangeDetectionStrategy } from '@angular/core';
import { CardComponent } from '../../shared/components/card/card.component';
import { CoachModel } from '../../shared/models/coach-model';
import { DialogService } from '../../services/dialog.service';
import { CoachDialogComponent } from '../coach-dialog/coach-dialog.component';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-coach-card',
  imports: [
    
    MatCheckboxModule
  ],
  templateUrl: './coach-card.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './coach-card.component.scss'
})
export class CoachCardComponent {
  coach = model.required<CoachModel>()

  dialogService = inject(DialogService)

  handleClick(){
    this.dialogService.showDialog(CoachDialogComponent, { coach: this.coach() })
          .afterClosed().subscribe((result: CoachModel) => {
            if(result)
            {
              this.coach.set(result)
            }
          })
  }
}

