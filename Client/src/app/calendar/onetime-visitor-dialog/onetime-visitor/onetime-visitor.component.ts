import { Component, input, output } from '@angular/core';
import { OnetimeVisitorModel } from '../../../shared/models/onetime-visitor-model';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-onetime-visitor',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './onetime-visitor.component.html',
  styleUrl: './onetime-visitor.component.scss'
})
export class OnetimeVisitorComponent {
  visitor = input<OnetimeVisitorModel>()
  removeVisitorOutput = output<OnetimeVisitorModel>()

  removeVisitor(){
    this.removeVisitorOutput.emit(this.visitor() as OnetimeVisitorModel)
  }
}
