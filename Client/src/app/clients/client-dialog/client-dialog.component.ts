import { Component, Inject, effect, input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Guid } from 'typescript-guid';
import { Client } from '../../shared/models/client-model';
import { SpinnerService } from '../../shared/spinner/spinner.service';
import { ClientService } from '../client.service';
import { finalize } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { SnackBarService } from '../../services/snack-bar.service';

export interface ClientDialogData{
  client: Client
}

@Component({
  selector: 'app-client-dialog',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers:[
    ClientService,
    SnackBarService
  ],
  templateUrl: './client-dialog.component.html',
  styleUrl: './client-dialog.component.scss'
})
export class ClientDialogComponent {
  public form: FormGroup;
  public get name() { return this.form.get('name')}
  public get phone() { return this.form.get('phone')}
  public get socialMediaLink() { return this.form.get('socialMediaLink')}
  public id: string;
  data = input.required<ClientDialogData>()

  constructor(private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<ClientDialogComponent>,
    private spinnerService: SpinnerService,
    private clientService: ClientService
  ){
    effect(() =>{
      this.id = this.data().client?.id;
      this.name?.setValue(this.data().client?.name)
      this.phone?.setValue(this.data().client?.phone)
      this.socialMediaLink?.setValue(this.data().client?.socialMediaLink)
    })
  }

    ngOnInit(){
      this.form = this.formBuilder.group({
        name: new FormControl('', [Validators.required]),
        phone: new FormControl(''),
        socialMediaLink: new FormControl('')
      })
    }

    onCloseClick(){
      this.dialogRef.close();
    }

    submit(){
      if (this.form.valid){
        const client: Client = {
          id: this.id,
          name: this.name?.value,
          phone: this.phone?.value,
          socialMediaLink: this.socialMediaLink?.value
        }
        this.spinnerService.loadingOn()
        this.clientService.saveClient(client)
        .pipe(
          finalize(()=> this.spinnerService.loadingOff())
        )
        .subscribe((result: Client) =>{
          this.dialogRef.close(result)
        })
      }
    }
}
