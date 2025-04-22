import { Component, input } from '@angular/core';
import { DynamicComponent } from '../../shared/dialog/base-dialog/base-dialog.component';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

export interface DutyDialogData{

}

@Component({
  selector: 'app-duty-dialog',
  standalone: true,
  imports: [
    MatIcon,
    MatInputModule,
    MatFormFieldModule
  ],
  templateUrl: './duty-dialog.component.html',
  styleUrl: './duty-dialog.component.scss'
})
export class DutyDialogComponent implements DynamicComponent {
  data = input.required<DutyDialogData>()
}
