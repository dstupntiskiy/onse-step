import { Component, inject, input, model } from '@angular/core';
import { CardComponent } from '../../shared/components/card/card.component';
import { CoachModel } from '../../shared/models/coach-model';
import { DialogService } from '../../services/dialog.service';
import { CoachDialogComponent } from '../coach-dialog/coach-dialog.component';

@Component({
  selector: 'app-coach-card',
  imports: [CardComponent],
  templateUrl: './coach-card.component.html',
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
