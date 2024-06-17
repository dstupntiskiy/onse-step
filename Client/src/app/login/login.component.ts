import { Component, inject } from '@angular/core';
import { UserService } from '../shared/services/user.service';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { SpinnerService } from '../shared/spinner/spinner.service';
import { finalize } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  providers:[
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  userService = inject(UserService)
  spinnerService = inject(SpinnerService)
  router = inject(Router)
  login = new FormControl<string>('', [Validators.required])
  password = new FormControl<string>('',[Validators.required])

  onLogin(){
    if(this.login.valid && this.password.valid)
    {
      this.spinnerService.loadingOn()
      this.userService.login(this.login.value as string, this.password.value as string)
        .pipe(
          finalize(() => this.spinnerService.loadingOff())
        )
        .subscribe(result =>{
          if(result){
            this.router.navigate([''])
          }
        })
    }
  }
}
